const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const serverUrl = 'http://127.0.0.1:4173/choice_train_V1.4.2.html';
const localNodeModulesDir = path.join(rootDir, 'node_modules');
const siblingNodeModulesDir = path.resolve(rootDir, '..', '..', 'Experimental_Choice_Train', 'node_modules');
const localPlaywrightBin = path.join(
  rootDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);
const siblingPlaywrightBin = path.resolve(
  rootDir,
  '..',
  '..',
  'Experimental_Choice_Train',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);
const playwrightBin = fs.existsSync(localPlaywrightBin)
  ? localPlaywrightBin
  : fs.existsSync(siblingPlaywrightBin)
    ? siblingPlaywrightBin
    : null;

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
  if (!playwrightBin) {
    throw new Error(
      'Playwright was not found. Run "npm install" in this repository, or keep the sibling Experimental_Choice_Train workspace available for shared local test tooling.'
    );
  }

  serverProcess = spawn(process.execPath, [path.join(__dirname, 'static-server.js')], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  await waitForServer(serverUrl);
  const testEnv = {
    ...process.env,
    NODE_PATH: [localNodeModulesDir, siblingNodeModulesDir, process.env.NODE_PATH]
      .filter(Boolean)
      .join(path.delimiter)
  };

  if (process.platform === 'win32') {
    testProcess = spawn('cmd.exe', ['/c', playwrightBin, 'test', ...process.argv.slice(2)], {
      cwd: rootDir,
      stdio: 'inherit',
      env: testEnv
    });
  } else {
    testProcess = spawn(playwrightBin, ['test', ...process.argv.slice(2)], {
      cwd: rootDir,
      stdio: 'inherit',
      env: testEnv
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
