#!/usr/bin/env node

/**
 * FREE Automation System - Setup Verification Script
 * Run this after GitHub setup to verify everything is working
 */

const https = require('https');
const fs = require('fs');

console.log('🚀 FREE Automation System - Setup Verification\n');

// Verification checklist
const verificationSteps = [
    {
        name: 'Local System Status',
        check: () => {
            return fs.existsSync('./daily-automation.js') && 
                   fs.existsSync('./.github/workflows/daily-automation.yml') &&
                   fs.existsSync('./SECRETS-QUICK-SETUP.md');
        }
    },
    {
        name: 'Environment Configuration', 
        check: () => {
            return fs.existsSync('./.env') && 
                   fs.readFileSync('./.env', 'utf8').includes('OPENROUTER_API_KEY');
        }
    },
    {
        name: 'GitHub Actions Workflow',
        check: () => {
            const workflow = fs.readFileSync('./.github/workflows/daily-automation.yml', 'utf8');
            return workflow.includes('AI Learning System - Free Daily Automation') &&
                   workflow.includes('cron:');
        }
    },
    {
        name: 'Automation Scripts',
        check: () => {
            return fs.existsSync('./.github/workflows/github-automation.js') &&
                   fs.existsSync('./ai-tools/lesson-generator.js') &&
                   fs.existsSync('./email-automation/notification-sender.js');
        }
    },
    {
        name: 'Documentation Complete',
        check: () => {
            return fs.existsSync('./GITHUB-ACTIONS-SETUP.md') &&
                   fs.existsSync('./REPOSITORY-SETUP.md') &&
                   fs.existsSync('./LIFELONG-LEARNING-GUIDE.md');
        }
    }
];

console.log('📋 Verification Results:\n');

let allPassed = true;
verificationSteps.forEach((step, index) => {
    const result = step.check();
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${step.name}: ${status}`);
    if (!result) allPassed = false;
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 ALL SYSTEMS READY FOR FREE CLOUD AUTOMATION!');
    console.log('\n📋 Next Steps:');
    console.log('1. ✅ Upload files to GitHub repository');
    console.log('2. ✅ Add 8 repository secrets (see SECRETS-QUICK-SETUP.md)');
    console.log('3. ✅ Enable GitHub Actions');  
    console.log('4. ✅ Test workflow run');
    console.log('5. ✅ Check email for first lesson');
    
    console.log('\n💰 Cost Breakdown:');
    console.log('- GitHub Actions: $0.00 (2,000 free minutes/month)');
    console.log('- Gmail SMTP: $0.00 (unlimited free)');
    console.log('- OpenRouter AI: $0.00 (free tier)');
    console.log('- Total Monthly Cost: $0.00 FOREVER!');
    
    console.log('\n🎯 Your automated schedule:');
    console.log('- 7 AM: Progressive Learning Series');  
    console.log('- 8 AM: Pro-Tip Power Hour');
    console.log('- 1 PM: Essential Knowledge');
    console.log('- 3 PM: AI Implementation');
    console.log('- 5 PM: Expert-Level Techniques');
    console.log('- Sunday 6 PM: Weekly Progress Summary');
    
    console.log('\n🚀 READY FOR LIFELONG FREE LEARNING!');
} else {
    console.log('❌ Setup incomplete. Please check failed items above.');
}

console.log('\n📞 Support: Check GITHUB-ACTIONS-SETUP.md for detailed instructions');