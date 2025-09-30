#!/usr/bin/env node

/**
 * API Key Update Helper Script
 * Run this after getting your new OpenRouter API key
 */

const fs = require('fs');
const readline = require('readline');

console.log('🔧 API KEY UPDATE HELPER');
console.log('========================\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Steps to fix your system:');
console.log('1. ✅ Get new API key from: https://openrouter.ai/keys');
console.log('2. ⬇️  Paste it below to update your local .env file');
console.log('3. 🌐 Then update GitHub repository secret manually\n');

rl.question('Paste your NEW OpenRouter API key (starts with sk-or-v1-): ', (apiKey) => {
    if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
        console.log('❌ Invalid API key format. Must start with sk-or-v1-');
        process.exit(1);
    }

    try {
        // Read current .env file
        let envContent = fs.readFileSync('.env', 'utf8');
        
        // Replace the API key line
        envContent = envContent.replace(
            /OPENROUTER_API_KEY=.*/,
            `OPENROUTER_API_KEY=${apiKey}`
        );
        
        // Write back to .env
        fs.writeFileSync('.env', envContent);
        
        console.log('\n✅ SUCCESS: Local .env file updated!');
        console.log('\n📋 NEXT STEPS:');
        console.log('1. ✅ Local .env updated');
        console.log('2. 🌐 Update GitHub Secret: OPENROUTER_API_KEY');
        console.log('   - Go to: https://github.com/ArogyaReddy/ai-learning-automation/settings/secrets/actions');
        console.log('   - Edit: OPENROUTER_API_KEY');
        console.log('   - Paste same key: ' + apiKey.substring(0, 20) + '...');
        console.log('3. 🧪 Test: Run workflow in GitHub Actions');
        console.log('\n🎯 Your system will be fully operational after step 2!');
        
    } catch (error) {
        console.log('❌ Error updating .env file:', error.message);
    }
    
    rl.close();
});