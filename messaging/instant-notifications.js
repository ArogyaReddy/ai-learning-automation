/**
 * Discord & Telegram Notification Integration
 * Extends the email system with instant messaging alerts
 */

class InstantMessagingNotifier {
    constructor() {
        this.discordWebhook = process.env.DISCORD_WEBHOOK;
        this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        this.telegramChatId = process.env.TELEGRAM_CHAT_ID;
    }

    async sendDiscordNotification(lesson) {
        if (!this.discordWebhook) {
            console.log('📢 Discord webhook not configured - skipping Discord notification');
            return;
        }

        try {
            const embed = {
                title: `🎓 ${lesson.title}`,
                description: lesson.content.substring(0, 300) + '...',
                color: 0x00AE86, // Green color
                fields: [
                    {
                        name: "📚 Lesson Type",
                        value: lesson.type,
                        inline: true
                    },
                    {
                        name: "⏰ Generated At",
                        value: new Date().toLocaleString(),
                        inline: true
                    },
                    {
                        name: "🎯 Focus Area",
                        value: process.env.FOCUS_AREAS || "Automation",
                        inline: true
                    }
                ],
                footer: {
                    text: "AI Learning System - Free Automation"
                },
                timestamp: new Date().toISOString()
            };

            const payload = {
                username: "AI Learning Bot",
                avatar_url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png",
                embeds: [embed]
            };

            const response = await fetch(this.discordWebhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ Discord notification sent successfully');
            } else {
                console.log('❌ Discord notification failed:', response.status);
            }
        } catch (error) {
            console.log('❌ Discord notification error:', error.message);
        }
    }

    async sendTelegramNotification(lesson) {
        if (!this.telegramBotToken || !this.telegramChatId) {
            console.log('📱 Telegram not configured - skipping Telegram notification');
            return;
        }

        try {
            const message = `
🎓 *${lesson.title}*

📚 Lesson Type: ${lesson.type}
⏰ Time: ${new Date().toLocaleString()}
🎯 Focus: ${process.env.FOCUS_AREAS || "Automation"}

📝 Preview:
${lesson.content.substring(0, 200)}...

💡 Full lesson delivered to your email!

🤖 AI Learning System - Free Automation
            `.trim();

            const payload = {
                chat_id: this.telegramChatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            };

            const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ Telegram notification sent successfully');
            } else {
                console.log('❌ Telegram notification failed:', response.status);
            }
        } catch (error) {
            console.log('❌ Telegram notification error:', error.message);
        }
    }

    async sendAllNotifications(lesson) {
        const notifications = [];
        
        // Send Discord notification
        if (this.discordWebhook) {
            notifications.push(this.sendDiscordNotification(lesson));
        }
        
        // Send Telegram notification  
        if (this.telegramBotToken && this.telegramChatId) {
            notifications.push(this.sendTelegramNotification(lesson));
        }

        // Wait for all notifications to complete
        if (notifications.length > 0) {
            await Promise.all(notifications);
            console.log(`📱 Sent ${notifications.length} instant message notification(s)`);
        } else {
            console.log('📱 No instant messaging configured - email only');
        }
    }
}

module.exports = InstantMessagingNotifier;