#!/usr/bin/env node
/**
 * Test Email Automation - Send immediate test lesson
 */

const DailyAutomation = require('./daily-automation.js');

async function testEmailAutomation() {
    console.log('🧪 Testing Automated Email Delivery...\n');
    
    const automation = new DailyAutomation();
    
    // Test all 5 daily lesson types
    const testLessons = [
        {
            type: 'series',
            title: '🌅 7AM Test: From Beginner to PRO',
            focus: 'progressive_learning'
        },
        {
            type: 'pro-tip', 
            title: '☕ 8AM Test: Pro-Tip Power Hour',
            focus: 'advanced_techniques'
        },
        {
            type: 'knowledge',
            title: '🍽️ 1PM Test: Things to Know', 
            focus: 'essential_concepts'
        },
        {
            type: 'ai-implementation',
            title: '🤖 3PM Test: AI Implementation Masterclass',
            focus: 'ai_automation_solutions'
        },
        {
            type: 'expert',
            title: '🚀 5PM Test: Expert Level - Only PRO Can Do',
            focus: 'expert_techniques'
        }
    ];
    
    console.log('📧 Testing email delivery for all 5 daily lessons...\n');
    
    for (let i = 0; i < testLessons.length; i++) {
        const lesson = testLessons[i];
        
        console.log(`${i + 1}/5 Testing: ${lesson.title}`);
        
        try {
            await automation.generateDailyContent(lesson);
            console.log(`✅ Success: Email sent for ${lesson.type}`);
        } catch (error) {
            console.log(`❌ Failed: ${lesson.type} - ${error.message}`);
        }
        
        // Small delay between emails to avoid rate limiting
        if (i < testLessons.length - 1) {
            console.log('   ⏳ Waiting 2 seconds...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎉 Email Test Complete!');
    console.log('📧 Check your email inbox - you should have received 5 test lessons');
    console.log('📅 The automated system will continue sending these at:');
    console.log('   • 7:00 AM - Beginner → PRO Series');
    console.log('   • 8:00 AM - Pro-Tip Power Hour');
    console.log('   • 1:00 PM - Things to Know');
    console.log('   • 3:00 PM - AI Implementation');
    console.log('   • 5:00 PM - Expert Level');
    console.log('\n🤖 Background daemon is running and will handle all future emails automatically!');
}

testEmailAutomation().catch(console.error);