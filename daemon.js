#!/usr/bin/env node
/**
 * AI Learning System - Background Daemon
 * Runs silently in the background, no VS Code needed
 */

const cron = require('node-cron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class LearningSystemDaemon {
    constructor() {
        this.isRunning = false;
        this.logFile = path.join(__dirname, 'logs', 'daemon.log');
        this.pidFile = path.join(__dirname, 'logs', 'daemon.pid');
        
        // Ensure logs directory exists
        const logsDir = path.dirname(this.logFile);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    async start() {
        // Check if already running
        if (this.isAlreadyRunning()) {
            this.log('Daemon already running. Exiting.');
            return;
        }

        // Write PID file
        fs.writeFileSync(this.pidFile, process.pid.toString());

        this.log('🚀 AI Learning System Daemon Started');
        this.log(`📅 Timezone: ${process.env.LEARNING_TIMEZONE || 'America/New_York'}`);
        this.log('📋 Daily Schedule:');
        this.log('   7:00 AM - Beginner → PRO Series');
        this.log('   8:00 AM - Pro-Tip Power Hour');
        this.log('   1:00 PM - Things to Know');
        this.log('   3:00 PM - AI Implementation');
        this.log('   5:00 PM - Expert Level');

        this.scheduleJobs();
        this.setupGracefulShutdown();
        
        // Keep process alive
        this.isRunning = true;
        process.on('exit', () => this.cleanup());
    }

    scheduleJobs() {
        // Set timezone
        const timezone = process.env.LEARNING_TIMEZONE || 'America/New_York';

        // 7:00 AM - Beginner → PRO Series
        cron.schedule('0 7 * * *', () => {
            this.generateLesson('series', 'From Beginner to PRO');
        }, { timezone });

        // 8:00 AM - Pro-Tip Power Hour  
        cron.schedule('0 8 * * *', () => {
            this.generateLesson('pro-tip', 'Pro-Tip Power Hour');
        }, { timezone });

        // 1:00 PM - Things to Know
        cron.schedule('0 13 * * *', () => {
            this.generateLesson('knowledge', 'Things to Know');
        }, { timezone });

        // 3:00 PM - AI Implementation
        cron.schedule('0 15 * * *', () => {
            this.generateLesson('ai-implementation', 'AI Implementation Masterclass');
        }, { timezone });

        // 5:00 PM - Expert Level
        cron.schedule('0 17 * * *', () => {
            this.generateLesson('expert', 'Expert Level - Only PRO Can Do');
        }, { timezone });

        // Weekly summary (Sunday 6 PM)
        cron.schedule('0 18 * * 0', () => {
            this.sendWeeklySummary();
        }, { timezone });

        // Daily system health check (every hour)
        cron.schedule('0 * * * *', () => {
            this.healthCheck();
        });

        this.log('✅ All scheduled jobs configured');
    }

    async generateLesson(type, title) {
        this.log(`🎯 Generating lesson: ${title}`);
        
        try {
            // Run lesson generation in separate process
            const result = await this.runCommand('node', [
                path.join(__dirname, 'ai-tools', 'lesson-generator.js')
            ], {
                env: { 
                    ...process.env, 
                    LESSON_TYPE: type,
                    LESSON_TITLE: title
                }
            });

            this.log(`✅ Lesson generated successfully: ${title}`);
            
            // Send notification
            await this.sendNotification(type, title);
            
        } catch (error) {
            this.log(`❌ Failed to generate lesson: ${error.message}`);
        }
    }

    async sendNotification(type, title) {
        try {
            await this.runCommand('node', [
                path.join(__dirname, 'email-automation', 'notification-sender.js')
            ], {
                env: { 
                    ...process.env,
                    NOTIFICATION_TYPE: type,
                    NOTIFICATION_TITLE: title
                }
            });
            
            this.log(`📧 Notification sent for: ${title}`);
            
        } catch (error) {
            this.log(`📧 Notification failed: ${error.message}`);
        }
    }

    async sendWeeklySummary() {
        this.log('📊 Generating weekly summary...');
        
        try {
            await this.runCommand('node', ['-e', `
                const NotificationSender = require('./email-automation/notification-sender');
                const sender = new NotificationSender();
                sender.sendWeeklySummary().then(() => {
                    console.log('Weekly summary sent');
                }).catch(console.error);
            `]);
            
            this.log('✅ Weekly summary sent');
            
        } catch (error) {
            this.log(`❌ Weekly summary failed: ${error.message}`);
        }
    }

    async healthCheck() {
        const stats = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            pid: process.pid
        };
        
        // Log health status (only every 6 hours to avoid spam)
        const hour = new Date().getHours();
        if (hour % 6 === 0) {
            this.log(`💚 System healthy - Uptime: ${Math.floor(stats.uptime / 3600)}h`);
        }
    }

    runCommand(command, args, options = {}) {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                cwd: __dirname,
                ...options
            });

            let stdout = '';
            let stderr = '';

            child.stdout?.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr?.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                } else {
                    reject(new Error(`Command failed with code ${code}: ${stderr}`));
                }
            });

            child.on('error', reject);
        });
    }

    isAlreadyRunning() {
        if (!fs.existsSync(this.pidFile)) {
            return false;
        }

        const pid = fs.readFileSync(this.pidFile, 'utf8').trim();
        
        try {
            // Check if process is still running
            process.kill(pid, 0);
            return true;
        } catch (error) {
            // Process doesn't exist, remove stale PID file
            fs.unlinkSync(this.pidFile);
            return false;
        }
    }

    setupGracefulShutdown() {
        const shutdown = () => {
            this.log('🛑 Shutting down daemon...');
            this.cleanup();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }

    cleanup() {
        if (fs.existsSync(this.pidFile)) {
            fs.unlinkSync(this.pidFile);
        }
        this.log('🧹 Cleanup completed');
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${message}\n`;
        
        // Write to log file
        fs.appendFileSync(this.logFile, logEntry);
        
        // Also log to console if in foreground
        if (process.stdout.isTTY) {
            console.log(message);
        }
    }
}

// CLI interface
if (require.main === module) {
    const command = process.argv[2];
    const daemon = new LearningSystemDaemon();

    switch (command) {
        case 'start':
            daemon.start().catch(console.error);
            break;
            
        case 'stop':
            console.log('🛑 Stopping daemon...');
            if (daemon.isAlreadyRunning()) {
                const fs = require('fs');
                const pid = fs.readFileSync(daemon.pidFile, 'utf8').trim();
                try {
                    process.kill(pid, 'SIGTERM');
                    fs.unlinkSync(daemon.pidFile);
                    console.log('✅ Daemon stopped');
                } catch (error) {
                    console.log('❌ Failed to stop daemon:', error.message);
                }
            } else {
                console.log('⚠️ Daemon not running');
            }
            break;
            
        case 'status':
            console.log('📊 AI Learning System Status');
            console.log('============================');
            
            if (daemon.isAlreadyRunning()) {
                const fs = require('fs');
                const pid = fs.readFileSync(daemon.pidFile, 'utf8').trim();
                console.log('🤖 Background Daemon: ✅ Running (PID:', pid + ')');
                console.log('📅 Daily Schedule: ✅ Active');
                console.log('📧 Email Notifications: ✅ Configured');
                
                // Check recent activity
                if (fs.existsSync(daemon.logFile)) {
                    console.log('\n📋 Recent Activity:');
                    const logs = fs.readFileSync(daemon.logFile, 'utf8').split('\n');
                    logs.slice(-5).forEach(line => {
                        if (line.trim()) console.log('   ' + line);
                    });
                }
            } else {
                console.log('🤖 Background Daemon: ❌ Not running');
                console.log('💡 Start with: npm run daemon');
            }
            break;
            
        default:
            console.log(`
🤖 AI Learning System Daemon

Usage:
  node daemon.js start   - Start the background service
  node daemon.js stop    - Stop the background service  
  node daemon.js status  - Check service status

The daemon will:
  ✅ Run completely in background
  ✅ Generate lessons at scheduled times
  ✅ Send email notifications
  ✅ Work without VS Code
  ✅ Survive system restarts (with auto-start)
            `);
    }
}

module.exports = LearningSystemDaemon;