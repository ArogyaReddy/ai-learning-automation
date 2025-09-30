/**
 * Email Automation System
 * Sends learning notifications without any paid services
 * Uses free email services and SMTP
 */

const nodemailer = require('nodemailer');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

class NotificationSender {
    constructor() {
        this.setupTransporter();
    }

    setupTransporter() {
        // Use free email services - Gmail, Yahoo, etc.
        this.transporter = nodemailer.createTransport({
            service: 'gmail',  // You can change this to yahoo, outlook, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD  // Use app password, not regular password
            }
        });
    }

    async sendLearningNotification(lessonData) {
        try {
            const emailContent = this.buildEmailContent(lessonData);
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
                subject: `🎯 ${lessonData.title} - Your Daily Learning is Ready!`,
                html: emailContent,
                attachments: [{
                    filename: 'lesson.md',
                    path: lessonData.filePath
                }]
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email notification sent for: ${lessonData.title}`);
            
        } catch (error) {
            console.error(`❌ Failed to send email: ${error.message}`);
            // Fallback: Create desktop notification file
            await this.createDesktopNotification(lessonData);
        }
    }

    buildEmailContent(lessonData) {
        const timestamp = new Date().toLocaleString();
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
                .title { font-size: 24px; font-weight: bold; margin: 0; }
                .subtitle { font-size: 14px; opacity: 0.9; margin: 5px 0 0 0; }
                .content { line-height: 1.6; color: #333; }
                .preview { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
                .emoji { font-size: 1.2em; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="title">🚀 ${lessonData.title}</div>
                    <div class="subtitle">Your personalized automation learning • ${timestamp}</div>
                </div>
                
                <div class="content">
                    <p>Hi there, Automation Architect! 👨‍💻</p>
                    
                    <p>Your daily learning content is ready and waiting for you. This lesson is specifically crafted for your work with <strong>Playwright, ADP systems, and browser automation</strong>.</p>
                    
                    <div class="preview">
                        <strong>📝 Lesson Preview:</strong><br>
                        ${lessonData.content}
                    </div>
                    
                    <p><strong>🎯 What you'll learn today:</strong></p>
                    <ul>
                        <li>Production-ready code you can use immediately</li>
                        <li>Advanced techniques for ADP system automation</li>
                        <li>Pro tips that separate experts from beginners</li>
                        <li>Real-world scenarios from your daily work</li>
                    </ul>
                    
                    <p>The complete lesson is attached as a markdown file, or you can find it in your workspace at:</p>
                    <code>${lessonData.filePath}</code>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" class="button">🚀 Start Learning Now</a>
                    </div>
                    
                    <p><strong>⏰ Coming up next:</strong> Check your schedule for the next learning session, or run your automation system to generate additional content anytime!</p>
                </div>
                
                <div class="footer">
                    <p><span class="emoji">🤖</span> <strong>AI Learning System</strong> - Powering your growth as an automation expert</p>
                    <p>💡 <em>Remember: Every expert was once a beginner, but every beginner can become an expert with the right learning system!</em></p>
                    <p>📧 This system uses no paid subscriptions and runs completely free on open-source tools.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    async createDesktopNotification(lessonData) {
        // Fallback: Create a notification file on desktop
        const notificationPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'AI-Learning-Notification.txt');
        
        const notificationText = `
🎯 AI LEARNING NOTIFICATION 🎯
${new Date().toLocaleString()}

📚 ${lessonData.title}

Your daily learning content is ready!
Location: ${lessonData.filePath}

Preview:
${lessonData.content}

Open your AI Learning System workspace to start learning!

---
This is a fallback notification created because email delivery failed.
Check your email configuration in the .env file.
        `;
        
        await fs.writeFile(notificationPath, notificationText);
        console.log(`📋 Desktop notification created: ${notificationPath}`);
    }

    async sendWeeklySummary() {
        try {
            const weeklyLessons = await this.getWeeklyLessons();
            const summaryContent = this.buildWeeklySummary(weeklyLessons);
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
                subject: '📊 Weekly Learning Progress Summary',
                html: summaryContent
            };

            await this.transporter.sendMail(mailOptions);
            console.log('✅ Weekly summary sent!');
            
        } catch (error) {
            console.error(`❌ Failed to send weekly summary: ${error.message}`);
        }
    }

    async getWeeklyLessons() {
        const dailyLessonsDir = path.join(__dirname, '../daily-lessons');
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        // Get lessons from the past week
        const lessons = [];
        try {
            const files = await fs.readdir(dailyLessonsDir, { recursive: true });
            for (const file of files) {
                const filePath = path.join(dailyLessonsDir, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile() && stats.mtime > weekAgo && file.endsWith('.md')) {
                    lessons.push({
                        name: file,
                        path: filePath,
                        date: stats.mtime
                    });
                }
            }
        } catch (error) {
            console.log('No lessons found for weekly summary');
        }
        
        return lessons;
    }

    buildWeeklySummary(lessons) {
        const lessonCount = lessons.length;
        const topicsLearned = lessonCount * 3; // Assuming 3 key topics per lesson
        
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #667eea;">📊 Your Weekly Learning Journey</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>🎯 This Week's Achievements</h3>
                <ul>
                    <li><strong>${lessonCount}</strong> lessons completed</li>
                    <li><strong>${topicsLearned}+</strong> new concepts mastered</li>
                    <li><strong>Production-ready</strong> code examples added to your toolkit</li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>📚 Recent Lessons</h3>
                ${lessons.map(lesson => `
                    <div style="padding: 10px; border-left: 3px solid #667eea; margin: 10px 0; background: #f9f9f9;">
                        <strong>${lesson.name}</strong><br>
                        <small>${lesson.date.toLocaleDateString()}</small>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 18px; color: #667eea;">
                    🚀 Keep up the amazing progress!
                </p>
                <p>Your dedication to continuous learning is building expertise that sets you apart as an automation architect.</p>
            </div>
        </div>
        `;
    }
}

module.exports = NotificationSender;