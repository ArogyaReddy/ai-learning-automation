# 📱 **DISCORD & TELEGRAM SETUP GUIDE**

## 🎮 **DISCORD SETUP** (5 minutes)

### **Step 1: Create Discord Webhook**
1. **Open Discord** on desktop or web
2. **Go to your server** (or create a new one)
3. **Right-click your channel** → "Edit Channel"
4. **Click "Integrations"** → "Webhooks" → "New Webhook"
5. **Name it**: "AI Learning Bot"
6. **Copy Webhook URL** (looks like: `https://discord.com/api/webhooks/...`)

### **Step 2: Add to Your System**
```bash
# Edit your .env file:
nano /Users/arog/ai-lessons/.env

# Add this line (replace with your webhook URL):
DISCORD_WEBHOOK=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL_HERE
```

### **Step 3: Test Discord**
```bash
# Test your setup:
node -e "
require('dotenv').config();
const InstantMessagingNotifier = require('./messaging/instant-notifications');
const notifier = new InstantMessagingNotifier();
notifier.sendDiscordNotification({
  title: 'Test: AI Learning System',
  type: 'test',
  content: 'Your Discord integration is working! You will receive learning notifications here.'
});
"
```

---

## 📱 **TELEGRAM SETUP** (10 minutes)

### **Step 1: Create Telegram Bot**
1. **Open Telegram** on any device
2. **Search for**: `@BotFather`
3. **Start conversation** with BotFather
4. **Send**: `/newbot`
5. **Choose bot name**: "AI Learning Bot"
6. **Choose username**: "YourNameLearningBot" (must end in 'bot')
7. **Copy the token** (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### **Step 2: Get Your Chat ID**
1. **Send a message** to your new bot (any message)
2. **Visit this URL** in browser (replace TOKEN):
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
3. **Find your chat ID** in the response (looks like: `"id":123456789`)

### **Step 3: Add to Your System**
```bash
# Edit your .env file:
nano /Users/arog/ai-lessons/.env

# Add these lines:
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
```

### **Step 4: Test Telegram**
```bash
# Test your setup:
node -e "
require('dotenv').config();
const InstantMessagingNotifier = require('./messaging/instant-notifications');
const notifier = new InstantMessagingNotifier();
notifier.sendTelegramNotification({
  title: 'Test: AI Learning System',
  type: 'test', 
  content: 'Your Telegram integration is working! You will receive learning notifications here.'
});
"
```

---

## 🔧 **ADD TO GITHUB ACTIONS**

For cloud automation, add these secrets to GitHub:

### **Repository Secrets to Add:**
1. **Go to**: https://github.com/ArogyaReddy/ai-learning-automation/settings/secrets/actions
2. **Add these secrets** (if you want messaging in cloud too):

| **Secret Name** | **Value** | **Required?** |
|-----------------|-----------|---------------|
| `DISCORD_WEBHOOK` | Your Discord webhook URL | Optional |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token | Optional |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | Optional |

---

## 📊 **NOTIFICATION FLOW**

### **🎯 What You'll Get:**
1. **📧 Email**: Full lesson content (primary notification)
2. **🎮 Discord**: Rich embed with lesson preview  
3. **📱 Telegram**: Formatted message with lesson info

### **⏰ When You'll Get Them:**
- **Same schedule** as emails (7 AM, 8 AM, 1 PM, 3 PM, 5 PM EST)
- **Instant delivery** - Discord/Telegram arrive within seconds
- **Email includes full content** - Messaging includes preview

### **📱 Mobile Benefits:**
- **Push notifications** on your phone
- **Quick preview** without opening email
- **Community sharing** in Discord servers
- **Personal bot** in Telegram

---

## 💰 **COST: Still FREE!**

### **Discord:**
- ✅ **Webhooks**: Completely free
- ✅ **No limits**: For reasonable usage
- ✅ **Rich formatting**: Embeds, colors, timestamps

### **Telegram:**
- ✅ **Bot API**: Completely free  
- ✅ **No rate limits**: For personal use
- ✅ **Instant delivery**: Push to mobile

---

## 🧪 **TEST YOUR SETUP**

### **Complete Test Command:**
```bash
# Test all notification systems:
node test-email-automation.js

# This will now send:
# ✅ Email notifications (existing)
# ✅ Discord messages (if configured) 
# ✅ Telegram messages (if configured)
```

### **Expected Results:**
- **📧 Email**: Arrives in Gmail inbox
- **🎮 Discord**: Rich embed in your channel
- **📱 Telegram**: Formatted message from your bot

---

## ⚡ **QUICK SETUP SUMMARY**

### **Discord** (Easiest):
1. Create webhook in Discord channel
2. Add `DISCORD_WEBHOOK=...` to `.env`
3. Test with provided command

### **Telegram** (More features):
1. Create bot with @BotFather
2. Get your chat ID from bot API
3. Add both token and chat ID to `.env`
4. Test with provided command

### **GitHub Actions** (Cloud):
1. Add same values as repository secrets
2. Instant messaging works in cloud too

**Choose Discord for simplicity, Telegram for mobile power, or both!** 📱🎮

---

## 🎯 **BENEFITS OF INSTANT MESSAGING**

- **⚡ Instant alerts**: Know immediately when lessons are generated
- **📱 Mobile notifications**: Never miss a learning opportunity  
- **👥 Share with team**: Discord servers for team learning
- **🤖 Personal assistant**: Telegram bot just for you
- **📊 Quick previews**: See lesson topics without opening email
- **🔔 Multiple channels**: Backup if email is delayed

**Your learning system just became a personal AI assistant!** 🚀✨