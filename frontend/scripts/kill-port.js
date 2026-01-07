#!/usr/bin/env node

/**
 * Script to kill process using port 4173
 * Cross-platform solution using Node.js
 */

import { exec } from 'child_process';
import os from 'os';

const port = 4173;
const platform = os.platform();

console.log(`🔍 Checking for process using port ${port}...`);

function killProcessOnPort(port) {
  return new Promise((resolve, reject) => {
    let command;
    
    if (platform === 'win32') {
      // Windows: Find process using port
      const findCommand = `netstat -ano | findstr :${port}`;
      
      exec(findCommand, (findError, findStdout) => {
        if (findError || !findStdout.trim()) {
          console.log(`ℹ️  Port ${port} is available`);
          setTimeout(() => resolve(), 500);
          return;
        }
        
        // Extract PID from output
        const lines = findStdout.trim().split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.add(match[1]);
          }
        });
        
        if (pids.size === 0) {
          console.log(`ℹ️  Port ${port} is available`);
          setTimeout(() => resolve(), 500);
          return;
        }
        
        // Kill all processes using the port
        const killPromises = Array.from(pids).map(pid => {
          return new Promise((killResolve) => {
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (!killError) {
                console.log(`✅ Stopped process ${pid} using port ${port}`);
              }
              killResolve();
            });
          });
        });
        
        Promise.all(killPromises).then(() => {
          setTimeout(() => resolve(), 1000);
        });
      });
    } else {
      // Unix/Linux/Mac: Find process using port and kill it
      command = `lsof -ti:${port} | xargs kill -9 2>/dev/null || echo "Port ${port} is available"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error && !stdout.includes('available')) {
          console.log(`ℹ️  Port ${port} is available`);
        } else {
          if (stdout.includes('available')) {
            console.log(`ℹ️  Port ${port} is available`);
          } else {
            console.log(`✅ Process using port ${port} has been stopped`);
          }
        }
        setTimeout(() => resolve(), 1000);
      });
    }
  });
}

killProcessOnPort(port)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });

