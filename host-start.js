import { execSync } from 'child_process';

const runCommand = (cmd, description) => {
  console.log(`\n${description}...`);
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('✅ Success\n');
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    process.exit(1);
  }
}

runCommand('cd ./backend && npm start', '🚀 Starting backend server');