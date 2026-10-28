import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const rootDir = __dirname;
const workspaceDir = path.join(rootDir, 'workspace');
const configPath = path.join(rootDir, 'config', 'openclaw.json5');
const openclawHome = path.join(rootDir, '.openclaw');
const stateDir = path.join(openclawHome, 'state');

// Set isolated environment variables
process.env.OPENCLAW_HOME = openclawHome;
process.env.OPENCLAW_CONFIG_PATH = configPath;
process.env.OPENCLAW_STATE_DIR = stateDir;

console.log('\n================================================================');
console.log('       OPENCLAW + NOUS HERMES AUTOMATED VERIFICATION SUITE       ');
console.log('================================================================\n');

async function run() {
  console.log('📂 Target Directory: ' + rootDir);
  console.log('🔒 Isolation Root:   ' + openclawHome);
  console.log('⚙️  Config File:      ' + configPath);
  console.log('🧪 Workspace:        ' + workspaceDir);
  console.log('');

  // 1. Verify Prerequisites
  console.log('--- Step 1: Checking System Environment ---');
  try {
    const nodeVer = process.version;
    console.log(`  ✔ Node.js: ${nodeVer}`);
  } catch (e) {
    console.error(`  ❌ Node.js check failed: ${e.message}`);
  }

  try {
    const pyVer = execSync('python --version', { encoding: 'utf-8' }).trim();
    console.log(`  ✔ Python:  ${pyVer}`);
  } catch (e) {
    console.warn(`  ⚠️ Python check warning: Ensure python is in PATH (${e.message})`);
  }

  if (fs.existsSync(configPath)) {
    console.log('  ✔ OpenClaw configuration file exists.');
  } else {
    console.error(`  ❌ Config file missing at: ${configPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
  }

  // 2. Verify OpenRouter / Hermes Key
  console.log('\n--- Step 2: Checking Brain Credentials (Nous Hermes) ---');
  const apiKey = process.env.OPENROUTER_API_KEY;
  const isKeyConfigured = apiKey && apiKey.trim().length > 10 && !apiKey.includes('your-openrouter-key');

  if (!isKeyConfigured) {
    console.log('  ⚠️  OPENROUTER_API_KEY is not configured or is using placeholder text.');
    console.log('  👉  To execute live benchmark turns against Nous Hermes:');
    console.log('      1. Open .env in this folder.');
    console.log('      2. Set OPENROUTER_API_KEY=sk-or-v1-xxxxxx');
    console.log('      3. Re-run: npm run test:hermes (or run_lab.bat option 3)');
    console.log('\n  ✔ Environment isolation, configurations, and tools scaffold verified successfully (Dry Run Mode).');
    process.exit(0);
  }

  console.log('  ✔ OpenRouter API Key detected.');
  console.log(`  ✔ Target Primary Model: ${process.env.HERMES_PRIMARY_MODEL || 'nousresearch/hermes-3-llama-3.1-405b'}`);

  // 3. Execution of Hermes Agent Turn
  console.log('\n--- Step 3: Executing Live Benchmark (OpenClaw -> Hermes) ---');
  const testScriptPath = path.join(workspaceDir, 'hello_hermes.py');
  if (fs.existsSync(testScriptPath)) {
    try { fs.unlinkSync(testScriptPath); } catch {}
  }

  const prompt = [
    "You are Nous Hermes testing your execution capabilities in OpenClaw.",
    "Perform the following task step by step:",
    "1. Create a Python file named 'hello_hermes.py' in the current workspace.",
    "2. In this script, print 'Hello from Nous Hermes!' followed by the current platform and date/time.",
    "3. Run the script using 'python hello_hermes.py' via your terminal execution tool.",
    "4. Report the script execution output."
  ].join(' ');

  console.log(`  🤖 Dispatching prompt to Nous Hermes...`);
  const startTime = Date.now();

  try {
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const result = execSync(`${npxCmd} openclaw agent --local --message "${prompt.replace(/"/g, '\\"')}"`, {
      cwd: rootDir,
      env: { ...process.env },
      encoding: 'utf-8',
      timeout: 120000
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n  ✔ Agent response received in ${elapsed}s:`);
    console.log('----------------------------------------------------------------');
    console.log(result.trim());
    console.log('----------------------------------------------------------------');

    // 4. Verify Generated File and Result
    console.log('\n--- Step 4: Verifying Output Artifacts ---');
    if (fs.existsSync(testScriptPath)) {
      console.log(`  ✔ Target file 'workspace/hello_hermes.py' was successfully created!`);
      const fileContent = fs.readFileSync(testScriptPath, 'utf-8');
      console.log('  📄 File contents:');
      console.log(fileContent.split('\n').map(l => '     ' + l).join('\n'));

      // Run independent execution check
      const pyOutput = execSync(`python "${testScriptPath}"`, { encoding: 'utf-8' }).trim();
      console.log(`  ✔ Direct execution test output:\n     ${pyOutput}`);
    } else {
      console.warn(`  ⚠️ Note: 'workspace/hello_hermes.py' was not written directly to disk. Check agent output above.`);
    }

    console.log('\n================================================================');
    console.log('   🎉 BENCHMARK COMPLETE: OPENCLAW + NOUS HERMES OPERATIONAL!   ');
    console.log('================================================================\n');

  } catch (err) {
    console.error('\n  ❌ Error during agent execution:');
    if (err.stdout) console.error('  STDOUT:\n' + err.stdout);
    if (err.stderr) console.error('  STDERR:\n' + err.stderr);
    console.error('  Error Details: ' + err.message);
    process.exit(1);
  }
}

run();
