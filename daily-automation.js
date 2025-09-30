#!/usr/bin/env node
/**
 * AI Learning System - Daily Automation
 * Generates personalized learning content for automation architects
 * Uses OpenRouter AI API for free content generation
 */

const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config();

const LessonGenerator = require('./ai-tools/lesson-generator');
const NotificationSender = require('./email-automation/notification-sender');
const { getCurrentDate, createDailyFolder } = require('./utils/helpers');

class DailyAutomation {
    constructor() {
        this.lessonGenerator = new LessonGenerator();
        this.notificationSender = new NotificationSender();
        
        // Schedule daily content generation - LIFELONG LEARNING SYSTEM
        const schedules = [
            { time: '0 12 * * *', config: { type: 'series', title: 'Beginner → PRO Series', focus: 'progressive_learning' }},
            { time: '0 13 * * *', config: { type: 'pro-tip', title: 'Pro-Tip Power Hour', focus: 'expert_techniques' }},
            { time: '0 18 * * *', config: { type: 'knowledge', title: 'Things to Know', focus: 'essential_concepts' }},
            { time: '0 20 * * *', config: { type: 'ai-implementation', title: 'AI Implementation Masterclass', focus: 'ai_automation' }},
            { time: '0 22 * * *', config: { type: 'expert', title: 'Only PRO Can Do', focus: 'master_level' }},
            // Weekly deep-dive sessions for advanced mastery
            { time: '0 14 0 * *', config: { type: 'weekly-deep-dive', title: 'Weekly Mastery Deep-Dive', focus: 'comprehensive_mastery' }},
            // Monthly skill assessment and progression
            { time: '0 15 1 * *', config: { type: 'monthly-assessment', title: 'Monthly Skills Assessment', focus: 'skill_progression' }}
        ];
    }

    async start() {
        console.log(chalk.green('🚀 AI Learning System Started - LIFELONG LEARNING MODE!'));
        console.log(chalk.magenta('🎯 This system runs FOREVER - continuous skill evolution'));
        console.log(chalk.blue('📅 Permanent learning schedule activated:'));
        
        Object.entries(this.schedule).forEach(([time, config]) => {
            const timeStr = this.cronToHumanTime(time);
            console.log(chalk.yellow(`⏰ ${timeStr}: ${config.title}`));
        });

        // Schedule all learning sessions - PERMANENT OPERATION
        Object.entries(this.schedule).forEach(([cronTime, config]) => {
            cron.schedule(cronTime, () => this.generateDailyContent(config));
        });

        // Generate initial content if starting for the first time
        await this.generateInitialContent();
        
        console.log(chalk.green('✅ System ready for PERPETUAL LEARNING! 🚀'));
        console.log(chalk.blue('📧 Fresh content delivered daily - no expiration date'));
        console.log(chalk.magenta('🎓 Your journey: Beginner → Expert → Master → Innovator'));
        console.log(chalk.cyan('⚡ Waiting for scheduled times... System runs 24/7/365'));
    }

    async generateDailyContent(config) {
        try {
            console.log(chalk.cyan(`\n🎯 Generating ${config.title} content...`));
            
            const todayFolder = await createDailyFolder();
            const content = await this.lessonGenerator.generateLesson(config);
            
            // Save content to daily folder
            const fileName = `${config.type}-${Date.now()}.md`;
            const filePath = path.join(todayFolder, fileName);
            await fs.writeFile(filePath, content);
            
            // Send notification
            await this.notificationSender.sendLearningNotification({
                title: config.title,
                content: content.substring(0, 500) + '...',
                filePath
            });
            
            console.log(chalk.green(`✅ ${config.title} content generated and notification sent!`));
            
        } catch (error) {
            console.error(chalk.red(`❌ Error generating content: ${error.message}`));
        }
    }

    async generateInitialContent() {
        console.log(chalk.blue('\n🎬 Generating initial learning content...'));
        
        const sampleConfig = {
            type: 'welcome',
            title: 'Welcome to Your AI Learning Journey',
            focus: 'system_overview'
        };
        
        await this.generateDailyContent(sampleConfig);
    }

    cronToHumanTime(cronExpression) {
        const parts = cronExpression.split(' ');
        const hour = parseInt(parts[1]);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:00 ${ampm}`;
    }
}

// Start the system
if (require.main === module) {
    const automation = new DailyAutomation();
    automation.start().catch(console.error);
}

module.exports = DailyAutomation;