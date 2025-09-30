#!/usr/bin/env node
/**
 * GitHub Actions Automation Script
 * Runs the AI Learning System completely FREE in GitHub Actions
 */

const DailyAutomation = require('../../daily-automation');
const { createDailyFolder, generateLearningReport } = require('../../utils/helpers');

async function runGitHubAutomation() {
    const lessonType = process.argv[2] || 'series';
    
    console.log(`🚀 GitHub Actions - AI Learning System`);
    console.log(`🕒 UTC Time: ${new Date().toISOString()}`);
    console.log(`📚 Generating lesson type: ${lessonType}`);
    console.log(`💰 Cost: $0.00 (Free Forever!)`);
    console.log('====================================\n');

    try {
        // Ensure logs directory exists
        const fs = require('fs');
        const path = require('path');
        
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs', { recursive: true });
        }

        const automation = new DailyAutomation();
        
        // Map lesson types to configurations
        const lessonConfigs = {
            'series': {
                type: 'series',
                title: 'From Beginner to PRO',
                focus: 'progressive_learning'
            },
            'pro-tip': {
                type: 'pro-tip',
                title: 'Pro-Tip Power Hour',
                focus: 'advanced_techniques'
            },
            'knowledge': {
                type: 'knowledge',
                title: 'Things to Know',
                focus: 'essential_concepts'
            },
            'ai-implementation': {
                type: 'ai-implementation',
                title: 'AI Implementation Masterclass',
                focus: 'ai_automation_solutions'
            },
            'expert': {
                type: 'expert',
                title: 'Expert Level - Only PRO Can Do',
                focus: 'expert_techniques'
            },
            'weekly-summary': {
                type: 'weekly-summary',
                title: 'Weekly Learning Progress',
                focus: 'progress_summary'
            }
        };

        const config = lessonConfigs[lessonType] || lessonConfigs['series'];
        
        if (lessonType === 'weekly-summary') {
            await generateWeeklySummary();
        } else {
            await automation.generateDailyContent(config);
        }

        // Log success for GitHub Actions
        const logEntry = {
            timestamp: new Date().toISOString(),
            lessonType: config.type,
            title: config.title,
            status: 'success',
            platform: 'github-actions',
            cost: '$0.00'
        };
        
        const logFile = path.join('logs', 'github-actions.log');
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        
        console.log('✅ SUCCESS: Lesson generated and email sent!');
        console.log('📧 Check your email for the new learning content');
        console.log('💰 Total cost: $0.00 (GitHub Actions Free Tier)');
        console.log('🔄 Next lesson will be generated automatically');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        
        // Still try to send a fallback email
        console.log('🔄 Attempting fallback lesson generation...');
        
        try {
            const LessonGenerator = require('../../ai-tools/lesson-generator');
            const NotificationSender = require('../../email-automation/notification-sender');
            
            const generator = new LessonGenerator();
            const sender = new NotificationSender();
            
            const fallbackLesson = generator.getFallbackLesson({
                type: lessonType,
                title: `${lessonType} - Offline Lesson`,
                focus: 'fallback_content'
            });
            
            const todayFolder = await createDailyFolder();
            const fs = require('fs');
            const path = require('path');
            
            const fileName = `${lessonType}-fallback-${Date.now()}.md`;
            const filePath = path.join(todayFolder, fileName);
            fs.writeFileSync(filePath, fallbackLesson);
            
            await sender.sendLearningNotification({
                title: `Fallback Lesson: ${lessonType}`,
                content: fallbackLesson.substring(0, 500),
                filePath
            });
            
            console.log('✅ Fallback lesson sent successfully!');
            
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError.message);
            process.exit(1);
        }
    }
}

async function generateWeeklySummary() {
    console.log('📊 Generating weekly summary...');
    
    const NotificationSender = require('../../email-automation/notification-sender');
    const sender = new NotificationSender();
    
    await sender.sendWeeklySummary();
    console.log('✅ Weekly summary sent!');
}

// Run the automation
runGitHubAutomation().catch(error => {
    console.error('💥 CRITICAL ERROR:', error.message);
    process.exit(1);
});