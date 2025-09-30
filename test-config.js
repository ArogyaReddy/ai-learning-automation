#!/usr/bin/env node
/**
 * Diagnostic Script - Test API and Email Configuration
 */

const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testConfiguration() {
    console.log('🔧 Testing AI Learning System Configuration\n');

    // Test 1: Environment Variables
    console.log('1️⃣  Environment Variables:');
    console.log(`   OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? 'Set ✅' : 'Missing ❌'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Set ✅' : 'Missing ❌'}`);
    console.log(`   EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? 'Set ✅' : 'Missing ❌'}`);
    
    if (process.env.EMAIL_APP_PASSWORD) {
        const pwd = process.env.EMAIL_APP_PASSWORD;
        console.log(`   Password Format: ${pwd.length} chars ${pwd.length === 16 ? '✅' : '❌ (should be 16)'}`);
        console.log(`   Contains spaces: ${pwd.includes(' ') ? '✅ (correct format)' : '❌ (app passwords have spaces)'}`);
    }

    console.log('\n2️⃣  Testing OpenRouter API:');
    
    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: "google/gemma-2-9b-it:free",
            messages: [{
                role: "user", 
                content: "Generate a simple 'Hello World' automation test in JavaScript."
            }],
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        console.log('   ✅ API Working! Response received');
        console.log(`   📝 Generated: "${response.data.choices[0].message.content.substring(0, 100)}..."`);
        
    } catch (error) {
        console.log('   ❌ API Error:', error.response?.status, error.response?.statusText);
        if (error.response?.status === 404) {
            console.log('   💡 Suggestion: Check if the model name is correct');
        } else if (error.response?.status === 401) {
            console.log('   💡 Suggestion: Check your API key');
        } else if (error.response?.status === 429) {
            console.log('   💡 Suggestion: Rate limited, try again later');
        }
        console.log('   🔍 Full error:', error.message);
    }

    console.log('\n3️⃣  Testing Email Configuration:');
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        // Test connection
        await transporter.verify();
        console.log('   ✅ Email configuration is valid!');
        
        // Send test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '🎯 AI Learning System - Test Notification',
            html: `
                <h2>🎉 Configuration Test Successful!</h2>
                <p>Your AI Learning System is properly configured and ready to send notifications.</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Next steps:</strong> Run <code>npm start</code> to begin your learning journey!</p>
            `
        });

        console.log('   ✅ Test email sent successfully!');
        console.log(`   📧 Message ID: ${info.messageId}`);
        
    } catch (error) {
        console.log('   ❌ Email Error:', error.message);
        
        if (error.message.includes('Application-specific password')) {
            console.log('\n   🔧 How to fix Gmail App Password:');
            console.log('   1. Enable 2-Factor Authentication on Gmail');
            console.log('   2. Go to: https://myaccount.google.com/apppasswords');
            console.log('   3. Select "Mail" and generate password');
            console.log('   4. Use the 16-character password (with spaces)');
            console.log('   5. Update EMAIL_APP_PASSWORD in .env file');
        } else if (error.message.includes('Invalid login')) {
            console.log('   💡 Check your Gmail username and app password');
        }
    }

    console.log('\n4️⃣  Quick Fixes:');
    
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_api_key')) {
        console.log('   🔑 Get free OpenRouter API key: https://openrouter.ai/');
    }
    
    if (!process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD.length !== 16) {
        console.log('   📧 Setup Gmail app password: https://myaccount.google.com/apppasswords');
    }

    console.log('\n5️⃣  System Status:');
    
    const hasValidAPI = process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('your_api_key');
    const hasValidEmail = process.env.EMAIL_APP_PASSWORD && process.env.EMAIL_APP_PASSWORD.length >= 16;
    
    if (hasValidAPI && hasValidEmail) {
        console.log('   🎉 System ready! Run: npm start');
    } else if (hasValidAPI) {
        console.log('   ⚠️  API ready, fix email to get notifications');
    } else if (hasValidEmail) {
        console.log('   ⚠️  Email ready, fix API for AI content generation');
    } else {
        console.log('   🔧 Complete setup needed - check steps above');
    }
}

// Alternative offline mode function
function createOfflineLesson() {
    const offlineLesson = `# Daily Automation Lesson - Offline Mode

## Today's Focus: Production-Ready Element Locators

### The Pro Technique: Multi-Strategy Element Finding

\`\`\`javascript
class ProductionLocator {
    constructor(page) {
        this.page = page;
        this.strategies = new Map();
    }
    
    // Register multiple strategies for an element
    register(elementName, strategies) {
        this.strategies.set(elementName, strategies);
    }
    
    async find(elementName, timeout = 10000) {
        const strategies = this.strategies.get(elementName);
        if (!strategies) {
            throw new Error(\`No strategies registered for: \${elementName}\`);
        }
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            for (const [strategyName, selector] of Object.entries(strategies)) {
                try {
                    const element = await this.page.locator(selector).first();
                    
                    if (await element.isVisible({ timeout: 1000 })) {
                        console.log(\`✅ Found \${elementName} using: \${strategyName}\`);
                        return element;
                    }
                } catch (error) {
                    // Try next strategy
                    continue;
                }
            }
            
            // Wait before retrying all strategies
            await this.page.waitForTimeout(500);
        }
        
        throw new Error(\`Element '\${elementName}' not found after \${timeout}ms\`);
    }
}

// Usage for ADP Systems
const locator = new ProductionLocator(page);

// Register strategies for ADP elements
locator.register('submitButton', {
    primary: '[data-testid="submit-btn"]',
    secondary: 'button:has-text("Submit")', 
    fallback: '.submit-button',
    generic: 'input[type="submit"]'
});

locator.register('employeeTable', {
    primary: '[data-testid="employee-table"]',
    secondary: '.employee-list table',
    fallback: 'table:has(th:text("Employee"))',
    generic: 'table tbody tr'
});

// Use in your tests
const submitBtn = await locator.find('submitButton');
await submitBtn.click();

const table = await locator.find('employeeTable');
const rowCount = await table.locator('tr').count();
\`\`\`

### Why This Pattern Works:

1. **Resilience**: Multiple fallback strategies
2. **Performance**: Stops at first successful match
3. **Maintainability**: Centralized element definitions
4. **Debugging**: Clear logging of which strategy worked
5. **Scalability**: Easy to add new elements and strategies

### Real-World Application:

Use this for ADP systems where:
- UI changes frequently
- Different environments have different IDs
- Elements load dynamically
- Shadow DOM is involved

### Your Challenge:

Implement this pattern in your current automation project and share your experience!

---

*This lesson works offline. Configure your API and email for AI-generated personalized content.*
`;

    const fs = require('fs');
    const path = require('path');
    
    // Create today's folder
    const today = new Date().toISOString().split('T')[0];
    const todayFolder = path.join('daily-lessons', today);
    
    if (!fs.existsSync(todayFolder)) {
        fs.mkdirSync(todayFolder, { recursive: true });
    }
    
    // Save offline lesson
    const lessonPath = path.join(todayFolder, 'offline-lesson.md');
    fs.writeFileSync(lessonPath, offlineLesson);
    
    console.log(`📚 Offline lesson created: ${lessonPath}`);
    return lessonPath;
}

// Run diagnostics
testConfiguration().catch(error => {
    console.error('❌ Diagnostic failed:', error.message);
    
    console.log('\n📚 Creating offline lesson instead...');
    createOfflineLesson();
    
    console.log('\n🔧 To fix issues and get full functionality:');
    console.log('1. Get OpenRouter API key: https://openrouter.ai/');
    console.log('2. Setup Gmail app password: https://myaccount.google.com/apppasswords');
    console.log('3. Update .env file with correct credentials');
    console.log('4. Run this diagnostic again: node test-config.js');
});

module.exports = { testConfiguration, createOfflineLesson };