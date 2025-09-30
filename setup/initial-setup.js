#!/usr/bin/env node
/**
 * Initial Setup Script for AI Learning System
 * Configures the system for first-time use
 */

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class SetupWizard {
    constructor() {
        this.config = {};
    }

    async start() {
        console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 AI Learning System - Setup Wizard                      ║
║                                                              ║
║   Welcome to your personal automation learning companion!    ║
║   This wizard will configure your system in just 5 minutes. ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`));

        console.log(chalk.yellow('\n📋 Setup Steps:'));
        console.log('   1. Configure API access (free)');
        console.log('   2. Setup email notifications');
        console.log('   3. Choose learning preferences');
        console.log('   4. Initialize system');
        console.log('   5. Start learning!\n');

        try {
            await this.configureAPI();
            await this.configureEmail();
            await this.configureLearning();
            await this.createEnvFile();
            await this.initializeDirectories();
            await this.generateWelcomeContent();
            
            console.log(chalk.green('\n🎉 Setup Complete! Your AI Learning System is ready!'));
            console.log(chalk.blue('\n🚀 To start your learning journey:'));
            console.log(chalk.white('   npm start\n'));
            
        } catch (error) {
            console.error(chalk.red('\n❌ Setup failed:', error.message));
            console.log(chalk.yellow('💡 You can run this setup again with: npm run setup'));
        } finally {
            rl.close();
        }
    }

    async configureAPI() {
        console.log(chalk.blue('\n🔑 Step 1: API Configuration'));
        console.log('We use OpenRouter.ai for free AI content generation.');
        console.log('Get your free API key at: https://openrouter.ai/\n');

        const hasKey = await this.question('Do you have an OpenRouter API key? (y/n): ');
        
        if (hasKey.toLowerCase() === 'y') {
            this.config.OPENROUTER_API_KEY = await this.question('Enter your API key: ');
        } else {
            console.log(chalk.yellow('\n📝 To get your free API key:'));
            console.log('   1. Visit https://openrouter.ai/');
            console.log('   2. Sign up (free)');
            console.log('   3. Go to API Keys section');
            console.log('   4. Create a new key');
            console.log('   5. Come back and run setup again\n');
            
            this.config.OPENROUTER_API_KEY = 'your_api_key_here';
        }
    }

    async configureEmail() {
        console.log(chalk.blue('\n📧 Step 2: Email Notifications'));
        console.log('Configure email to receive your daily learning content.\n');

        this.config.EMAIL_USER = await this.question('Your email address: ');
        
        console.log(chalk.yellow('\n🔐 For Gmail users:'));
        console.log('   1. Enable 2-factor authentication');
        console.log('   2. Generate app password: https://myaccount.google.com/apppasswords');
        console.log('   3. Use the 16-character app password (not your regular password)\n');

        const hasAppPassword = await this.question('Do you have an app password ready? (y/n): ');
        
        if (hasAppPassword.toLowerCase() === 'y') {
            this.config.EMAIL_APP_PASSWORD = await this.question('Enter app password: ');
        } else {
            console.log(chalk.yellow('💡 You can add the app password later in the .env file'));
            this.config.EMAIL_APP_PASSWORD = 'your_app_password_here';
        }

        this.config.NOTIFICATION_EMAIL = this.config.EMAIL_USER;
    }

    async configureLearning() {
        console.log(chalk.blue('\n🎓 Step 3: Learning Preferences'));
        
        console.log('\nWhat\'s your current automation experience level?');
        console.log('1. Beginner - New to automation');
        console.log('2. Intermediate - Some experience');  
        console.log('3. Advanced - Experienced practitioner');
        console.log('4. Expert - Senior automation architect');

        const level = await this.question('Select level (1-4): ');
        const levels = { '1': 'beginner', '2': 'intermediate', '3': 'advanced', '4': 'expert' };
        this.config.LEARNING_LEVEL = levels[level] || 'intermediate';

        console.log('\nWhich areas are you most interested in? (comma-separated)');
        console.log('Options: playwright, cucumber, api-testing, browser-automation, dom, ai-integration');
        
        const focusAreas = await this.question('Focus areas: ');
        this.config.FOCUS_AREAS = focusAreas || 'playwright,cucumber,api-testing';

        console.log('\nPreferred programming language?');
        console.log('1. JavaScript');
        console.log('2. TypeScript'); 
        console.log('3. Both');

        const langChoice = await this.question('Select (1-3): ');
        const languages = { '1': 'javascript', '2': 'typescript', '3': 'javascript,typescript' };
        this.config.PREFERRED_LANGUAGE = languages[langChoice] || 'javascript';

        // Timezone detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.config.LEARNING_TIMEZONE = timezone;
        
        console.log(chalk.green(`\n✅ Detected timezone: ${timezone}`));
    }

    async createEnvFile() {
        console.log(chalk.blue('\n📝 Step 4: Creating configuration file...'));

        const envContent = `# AI Learning System Configuration
# Generated on ${new Date().toISOString()}

# OpenRouter AI API Configuration
OPENROUTER_API_KEY=${this.config.OPENROUTER_API_KEY}

# Email Configuration
EMAIL_USER=${this.config.EMAIL_USER}
EMAIL_APP_PASSWORD=${this.config.EMAIL_APP_PASSWORD}
NOTIFICATION_EMAIL=${this.config.NOTIFICATION_EMAIL}

# Learning Preferences
LEARNING_LEVEL=${this.config.LEARNING_LEVEL}
FOCUS_AREAS=${this.config.FOCUS_AREAS}
PREFERRED_LANGUAGE=${this.config.PREFERRED_LANGUAGE}
LEARNING_TIMEZONE=${this.config.LEARNING_TIMEZONE}

# System Configuration
DEBUG_MODE=false
AUTO_GENERATE=true
SAVE_BACKUPS=true
`;

        await fs.writeFile('.env', envContent);
        console.log(chalk.green('✅ Configuration saved to .env'));
    }

    async initializeDirectories() {
        console.log(chalk.blue('\n📁 Initializing directories...'));

        const directories = [
            'daily-lessons',
            'automation-examples', 
            'ai-tools',
            'email-automation',
            'learning-paths',
            'utils',
            'screenshots',
            'archive'
        ];

        for (const dir of directories) {
            await fs.ensureDir(dir);
        }

        console.log(chalk.green('✅ Directory structure created'));
    }

    async generateWelcomeContent() {
        console.log(chalk.blue('\n🎯 Generating your first lesson...'));

        try {
            const LessonGenerator = require('../ai-tools/lesson-generator');
            const generator = new LessonGenerator();

            const welcomeLesson = await generator.generateLesson({
                type: 'welcome',
                title: 'Welcome to Your AI Learning Journey',
                focus: 'getting_started'
            });

            const todayFolder = path.join('daily-lessons', new Date().toISOString().split('T')[0]);
            await fs.ensureDir(todayFolder);
            
            const lessonPath = path.join(todayFolder, 'welcome-lesson.md');
            await fs.writeFile(lessonPath, welcomeLesson);

            console.log(chalk.green(`✅ Welcome lesson created: ${lessonPath}`));
            
        } catch (error) {
            console.log(chalk.yellow('⚠️  Could not generate welcome lesson (API key needed)'));
            await this.createManualWelcome();
        }
    }

    async createManualWelcome() {
        const welcomeContent = `# 🎉 Welcome to Your AI Learning System!

*Your personalized automation learning journey starts now.*

## 🎯 What You've Just Created

Congratulations! You've successfully set up a powerful learning system that will:

- Generate **daily automation lessons** tailored to your skill level
- Send **email notifications** with new content  
- Provide **real-world code examples** for ADP systems
- Track your **learning progress** automatically
- Use **AI to create personalized content**

## 🚀 Next Steps

1. **Start the system**: Run \`npm start\` to begin
2. **Check your email**: Look for learning notifications
3. **Explore examples**: Browse the \`automation-examples/\` folder
4. **Follow learning paths**: Check \`learning-paths/README.md\`

## 📅 Your Daily Schedule

| Time | Content |
|------|---------|
| 7:00 AM | Beginner → PRO Series |
| 8:00 AM | Pro-Tip Power Hour |
| 1:00 PM | Things to Know |
| 3:00 PM | AI Implementation |
| 5:00 PM | Expert Level |

## 💡 First Learning Challenge

Try this advanced element locator pattern:

\`\`\`javascript
// Multi-strategy element finding
class SmartLocator {
    async findElement(strategies) {
        for (const strategy of strategies) {
            try {
                const element = await page.locator(strategy).first();
                if (await element.isVisible()) {
                    return element;
                }
            } catch (error) {
                continue; // Try next strategy
            }
        }
        throw new Error('Element not found with any strategy');
    }
}

// Usage for ADP systems
const locator = new SmartLocator(page);
const submitButton = await locator.findElement([
    '[data-testid="submit-button"]',
    'button:has-text("Submit")',
    '.submit-btn',
    'input[type="submit"]'
]);
\`\`\`

This pattern ensures your tests are resilient to UI changes!

## 🎓 Your Learning Configuration

- **Level**: ${this.config.LEARNING_LEVEL}
- **Focus Areas**: ${this.config.FOCUS_AREAS}
- **Language**: ${this.config.PREFERRED_LANGUAGE}
- **Timezone**: ${this.config.LEARNING_TIMEZONE}

## 🔧 System Commands

\`\`\`bash
npm start                    # Start the learning system
npm run generate-lesson      # Create a lesson now
npm run send-notifications   # Test email notifications  
npm run morning-routine      # Run full morning routine
\`\`\`

## 📞 Need Help?

- Check the README.md for detailed documentation
- All code examples are in \`automation-examples/\`
- Modify settings in the \`.env\` file
- Re-run setup with \`npm run setup\`

---

**🚀 Ready to become an automation expert? Run \`npm start\` and let the learning begin!**

*Generated on ${new Date().toLocaleString()}*
`;

        const todayFolder = path.join('daily-lessons', new Date().toISOString().split('T')[0]);
        await fs.ensureDir(todayFolder);
        
        const lessonPath = path.join(todayFolder, 'welcome-lesson.md');
        await fs.writeFile(lessonPath, welcomeContent);
        
        console.log(chalk.green(`✅ Manual welcome lesson created: ${lessonPath}`));
    }

    question(prompt) {
        return new Promise((resolve) => {
            rl.question(chalk.white(prompt), resolve);
        });
    }
}

// Run setup if called directly
if (require.main === module) {
    const wizard = new SetupWizard();
    wizard.start().catch(console.error);
}

module.exports = SetupWizard;