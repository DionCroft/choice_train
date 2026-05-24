const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const serverUrl = 'http://127.0.0.1:4173/choice_train_V1.3.1.html';
const playwrightBin = path.join(
  rootDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);

let serverProcess = null;
let testProcess = null;
let shuttingDown = false;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 20_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, res => {
          res.resume();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
            resolve();
            return;
          }
          reject(new Error(`Unexpected status ${res.statusCode}`));
        });
        req.on('error', reject);
      });
      return;
    } catch (_error) {
      await wait(250);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function stopProcess(child, signal = 'SIGTERM') {
  return new Promise(resolve => {
    if (!child || child.killed) {
      resolve();
      return;
    }
    child.once('exit', () => resolve());
    try {
      child.kill(signal);
    } catch (_error) {
      resolve();
    }
    setTimeout(() => {
      if (!child.killed) {
        try {
          child.kill('SIGKILL');
        } catch (_error) {}
      }
      resolve();
    }, 4_000);
  });
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (testProcess && !testProcess.killed) {
    await stopProcess(testProcess);
  }
  if (serverProcess && !serverProcess.killed) {
    await stopProcess(serverProcess);
  }
  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

async function main() {
  serverProcess = spawn(process.execPath, [path.join(__dirname, 'static-server.js')], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  await waitForServer(serverUrl);

  if (process.platform === 'win32') {
    testProcess = spawn('cmd.exe', ['/c', playwrightBin, 'test', ...process.argv.slice(2)], {
      cwd: rootDir,
      stdio: 'inherit'
    });
  } else {
    testProcess = spawn(playwrightBin, ['test', ...process.argv.slice(2)], {
      cwd: rootDir,
      stdio: 'inherit'
    });
  }

  testProcess.on('exit', async code => {
    await shutdown(code || 0);
  });
}

main().catch(async error => {
  process.stderr.write(`${error.stack || error}\n`);
  await shutdown(1);
});
