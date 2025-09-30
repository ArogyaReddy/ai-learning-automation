#!/usr/bin/env node
/**
 * ONE-CLICK AUTOMATION SETUP
 * Makes your AI Learning System completely autonomous
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
🚀 AI Learning System - One-Click Automation
===========================================

This will make your learning system completely autonomous:

✅ Background daemon (runs 24/7)
✅ Auto-start on system boot  
✅ Email notifications
✅ Daily lesson generation
✅ No manual intervention needed

Setting up automation...
`);

async function setupCompleteAutomation() {
    try {
        // 1. Test current configuration
        console.log('🔧 Testing configuration...');
        await runCommand('node', ['test-config.js']);
        
        // 2. Setup background daemon
        console.log('🤖 Starting background daemon...');
        const daemon = spawn('node', ['daemon.js', 'start'], {
            detached: true,
            stdio: 'ignore'
        });
        daemon.unref();
        
        // 3. Setup auto-start service
        console.log('⚙️ Installing auto-start service...');
        await setupAutoStart();
        
        // 4. Create desktop shortcuts
        console.log('🖥️ Creating desktop shortcuts...');
        await createDesktopShortcuts();
        
        console.log(`
🎉 AUTOMATION SETUP COMPLETE!
============================

Your AI Learning System is now:
✅ Running in the background
✅ Will auto-start on boot
✅ Generating daily lessons at:
   • 7:00 AM - Beginner → PRO Series
   • 8:00 AM - Pro-Tip Power Hour  
   • 1:00 PM - Things to Know
   • 3:00 PM - AI Implementation
   • 5:00 PM - Expert Level

📧 Notifications sent to: ${process.env.EMAIL_USER}

🖥️ Desktop shortcuts created:
   • Start AI Learning System
   • Stop AI Learning System  
   • Check Learning Status

🎯 YOU'RE ALL SET! 
No more manual work needed. Your learning journey is now fully automated.

📊 Monitor your progress:
   • Check your email for daily lessons
   • View generated content in daily-lessons/
   • Use desktop shortcuts to control the system
        `);
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Manual setup available with: npm run automate');
    }
}

async function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'pipe' });
        
        let output = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

async function setupAutoStart() {
    const nodePath = await runCommand('which', ['node']);
    const currentDir = process.cwd();
    
    // Create LaunchAgent plist
    const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ailearning.automation</string>
    
    <key>Program</key>
    <string>${nodePath.trim()}</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>${nodePath.trim()}</string>
        <string>${currentDir}/daemon.js</string>
        <string>start</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>${currentDir}</string>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <true/>
    
    <key>StandardOutPath</key>
    <string>${currentDir}/logs/daemon.out</string>
    
    <key>StandardErrorPath</key>
    <string>${currentDir}/logs/daemon.err</string>
</dict>
</plist>`;

    const plistPath = `${process.env.HOME}/Library/LaunchAgents/com.ailearning.automation.plist`;
    fs.writeFileSync(plistPath, plistContent);
    
    // Load the service
    await runCommand('launchctl', ['load', plistPath]);
}

async function createDesktopShortcuts() {
    const desktopPath = `${process.env.HOME}/Desktop`;
    const currentDir = process.cwd();
    
    // Start shortcut
    const startScript = `#!/bin/bash
cd "${currentDir}"
node daemon.js start
echo "✅ AI Learning System started!"
echo "📧 Check your email for notifications"
read -p "Press Enter to close..."`;
    
    fs.writeFileSync(`${desktopPath}/Start AI Learning System.command`, startScript);
    fs.chmodSync(`${desktopPath}/Start AI Learning System.command`, 0o755);
    
    // Stop shortcut  
    const stopScript = `#!/bin/bash
cd "${currentDir}"
node daemon.js stop
echo "🛑 AI Learning System stopped"
read -p "Press Enter to close..."`;
    
    fs.writeFileSync(`${desktopPath}/Stop AI Learning System.command`, stopScript);
    fs.chmodSync(`${desktopPath}/Stop AI Learning System.command`, 0o755);
    
    // Status shortcut
    const statusScript = `#!/bin/bash
cd "${currentDir}"
node daemon.js status
echo ""
echo "📊 Recent lessons:"
ls -la daily-lessons/*/
echo ""
read -p "Press Enter to close..."`;
    
    fs.writeFileSync(`${desktopPath}/Check Learning Status.command`, statusScript);
    fs.chmodSync(`${desktopPath}/Check Learning Status.command`, 0o755);
}

// Run setup
setupCompleteAutomation();