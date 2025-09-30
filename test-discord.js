#!/usr/bin/env node

/**
 * Discord Webhook Test Script
 * Test your Discord webhook integration
 */

require('dotenv').config();

async function testDiscordWebhook() {
    const webhookUrl = process.env.DISCORD_WEBHOOK;
    
    if (!webhookUrl) {
        console.log('❌ DISCORD_WEBHOOK not found in .env file');
        console.log('📝 Please add your webhook URL to .env:');
        console.log('   DISCORD_WEBHOOK=https://discord.com/api/webhooks/...');
        return;
    }
    
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        console.log('❌ Invalid webhook URL format');
        console.log('✅ Should start with: https://discord.com/api/webhooks/');
        return;
    }
    
    console.log('🧪 Testing Discord webhook...');
    console.log('📡 Webhook URL:', webhookUrl.substring(0, 50) + '...');
    
    const testMessage = {
        username: "AI Learning Bot",
        avatar_url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png",
        embeds: [{
            title: "🎉 Discord Integration Test",
            description: "Your AI Learning System is successfully connected to Discord!",
            color: 0x00AE86,
            fields: [
                {
                    name: "✅ Status",
                    value: "Webhook Working",
                    inline: true
                },
                {
                    name: "📅 Setup Date", 
                    value: new Date().toLocaleDateString(),
                    inline: true
                },
                {
                    name: "🎯 Next Step",
                    value: "You'll receive learning notifications here",
                    inline: false
                }
            ],
            footer: {
                text: "AI Learning System - Free Automation"
            },
            timestamp: new Date().toISOString()
        }]
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testMessage)
        });
        
        if (response.ok) {
            console.log('✅ SUCCESS: Test message sent to Discord!');
            console.log('📱 Check your Discord channel for the test message');
            console.log('🎯 Your AI Learning notifications will appear there');
        } else {
            console.log('❌ FAILED: Discord returned error:', response.status);
            console.log('🔧 Check your webhook URL and try again');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('🌐 Check your internet connection and webhook URL');
    }
}

testDiscordWebhook();