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

console.log('Starting deployment process\n');

// Frontend
runCommand('cd ./frontend && npm i', 'Installing frontend dependencies');
runCommand('cd ./frontend && npm run build:UPLOAD', 'Building frontend');

// Backend
runCommand('cd ./backend && npm i', 'Installing backend dependencies');