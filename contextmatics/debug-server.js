const { spawn } = require('child_process');
const fs = require('fs');

const logStream = fs.createWriteStream('./server-debug.log');

const child = spawn('npm.cmd', ['run', 'dev'], {
    cwd: process.cwd(),
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
    console.log('STDOUT:', data.toString());
    logStream.write('STDOUT: ' + data.toString());
});

child.stderr.on('data', (data) => {
    console.log('STDERR:', data.toString());
    logStream.write('STDERR: ' + data.toString());
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    logStream.write(`child process exited with code ${code}\n`);
    logStream.end();
});

console.log('Server starter initiated...');
