#!/bin/bash

# AI Learning System - Automation Setup Script
# Makes the system completely autonomous

set -e

echo "🚀 Setting up AI Learning System Automation..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js installation
if ! command_exists node; then
    echo "❌ Node.js not found. Installing via Homebrew..."
    if ! command_exists brew; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
fi

# Get Node.js path
NODE_PATH=$(which node)
echo "✅ Node.js found at: $NODE_PATH"

# Create logs directory
mkdir -p logs

echo ""
echo "Choose automation method:"
echo "1) Background Daemon (runs until you stop it)"
echo "2) System Service (auto-starts on boot)"
echo "3) Manual cron jobs"
echo "4) All of the above"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1|4)
        echo ""
        echo "🤖 Setting up Background Daemon..."
        
        # Start daemon
        echo "Starting daemon in background..."
        nohup node daemon.js start > logs/daemon.out 2> logs/daemon.err &
        
        echo "✅ Daemon started! Check status with:"
        echo "   tail -f logs/daemon.out"
        echo ""
        ;;
esac

case $choice in
    2|4)
        echo ""
        echo "🔧 Setting up System Service (auto-start)..."
        
        # Update paths in plist file
        CURRENT_DIR=$(pwd)
        sed -i.bak "s|/Users/arog/ai-lessons|$CURRENT_DIR|g" com.ailearning.automation.plist
        sed -i.bak "s|/usr/local/bin/node|$NODE_PATH|g" com.ailearning.automation.plist
        
        # Copy to LaunchAgents
        cp com.ailearning.automation.plist ~/Library/LaunchAgents/
        
        # Load the service
        launchctl load ~/Library/LaunchAgents/com.ailearning.automation.plist
        
        echo "✅ System service installed!"
        echo "   Your AI Learning System will now start automatically on boot"
        echo "   Control with:"
        echo "     launchctl start com.ailearning.automation"
        echo "     launchctl stop com.ailearning.automation"
        echo ""
        ;;
esac

case $choice in
    3|4)
        echo ""
        echo "⏰ Setting up Cron Jobs..."
        
        # Create cron entries
        CRON_ENTRIES="
# AI Learning System - Automated Daily Lessons
0 7 * * * cd $CURRENT_DIR && node -e \"
const DailyAutomation = require('./daily-automation.js');
const automation = new DailyAutomation();
automation.generateDailyContent({
    type: 'series',
    title: 'From Beginner to PRO',
    focus: 'progressive_learning'
}).catch(console.error);
\"

0 8 * * * cd $CURRENT_DIR && node -e \"
const DailyAutomation = require('./daily-automation.js');
const automation = new DailyAutomation();
automation.generateDailyContent({
    type: 'pro-tip',
    title: 'Pro-Tip Power Hour',
    focus: 'advanced_techniques'
}).catch(console.error);
\"

0 13 * * * cd $CURRENT_DIR && node -e \"
const DailyAutomation = require('./daily-automation.js');
const automation = new DailyAutomation();
automation.generateDailyContent({
    type: 'knowledge',
    title: 'Things to Know',
    focus: 'essential_concepts'
}).catch(console.error);
\"

0 15 * * * cd $CURRENT_DIR && node -e \"
const DailyAutomation = require('./daily-automation.js');
const automation = new DailyAutomation();
automation.generateDailyContent({
    type: 'ai-implementation',
    title: 'AI Implementation Masterclass',
    focus: 'ai_automation_solutions'
}).catch(console.error);
\"

0 17 * * * cd $CURRENT_DIR && node -e \"
const DailyAutomation = require('./daily-automation.js');
const automation = new DailyAutomation();
automation.generateDailyContent({
    type: 'expert',
    title: 'Expert Level - Only PRO Can Do',
    focus: 'expert_techniques'
}).catch(console.error);
\"
"
        
        # Add to crontab
        (crontab -l 2>/dev/null || true; echo "$CRON_ENTRIES") | crontab -
        
        echo "✅ Cron jobs installed!"
        echo "   View with: crontab -l"
        echo ""
        ;;
esac

# Create management scripts
echo ""
echo "📋 Creating management commands..."

# Start script
cat > start-learning-system.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting AI Learning System..."

# Method 1: Start daemon
if [ -f daemon.js ]; then
    echo "Starting background daemon..."
    nohup node daemon.js start > logs/daemon.out 2> logs/daemon.err &
    echo "✅ Daemon started"
fi

# Method 2: Start system service
if [ -f ~/Library/LaunchAgents/com.ailearning.automation.plist ]; then
    echo "Starting system service..."
    launchctl start com.ailearning.automation 2>/dev/null || true
    echo "✅ System service started"
fi

echo ""
echo "🎯 AI Learning System Status:"
echo "📧 Email notifications: $(grep EMAIL_USER .env | cut -d'=' -f2)"
echo "🤖 API configured: $(grep OPENROUTER_API_KEY .env | grep -v 'your_api_key' >/dev/null && echo 'Yes' || echo 'Offline mode')"
echo "📅 Daily schedule: 7AM, 8AM, 1PM, 3PM, 5PM"
echo ""
echo "📊 Monitor with:"
echo "   tail -f logs/daemon.out"
echo "   ls -la daily-lessons/"
EOF

chmod +x start-learning-system.sh

# Stop script
cat > stop-learning-system.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping AI Learning System..."

# Stop daemon
if [ -f logs/daemon.pid ]; then
    pid=$(cat logs/daemon.pid)
    kill $pid 2>/dev/null && echo "✅ Daemon stopped" || echo "⚠️ Daemon not running"
fi

# Stop system service
launchctl stop com.ailearning.automation 2>/dev/null && echo "✅ System service stopped" || true

echo "🔧 System stopped"
EOF

chmod +x stop-learning-system.sh

# Status script
cat > status-learning-system.sh << 'EOF'
#!/bin/bash
echo "📊 AI Learning System Status"
echo "================================"

# Check daemon
if [ -f logs/daemon.pid ]; then
    pid=$(cat logs/daemon.pid)
    if kill -0 $pid 2>/dev/null; then
        echo "🤖 Background Daemon: ✅ Running (PID: $pid)"
    else
        echo "🤖 Background Daemon: ❌ Stopped"
    fi
else
    echo "🤖 Background Daemon: ❌ Not started"
fi

# Check system service
if launchctl list | grep -q com.ailearning.automation; then
    echo "🔧 System Service: ✅ Loaded"
else
    echo "🔧 System Service: ❌ Not loaded"
fi

# Check cron jobs
if crontab -l 2>/dev/null | grep -q "AI Learning System"; then
    echo "⏰ Cron Jobs: ✅ Installed"
else
    echo "⏰ Cron Jobs: ❌ Not installed"
fi

# Check recent lessons
echo ""
echo "📚 Recent Lessons:"
find daily-lessons -name "*.md" -newer daily-lessons 2>/dev/null | head -5 | while read lesson; do
    echo "   📄 $lesson"
done

# Check logs
echo ""
echo "📋 Recent Activity (last 5 lines):"
if [ -f logs/daemon.out ]; then
    tail -5 logs/daemon.out | sed 's/^/   /'
else
    echo "   No recent activity logs"
fi
EOF

chmod +x status-learning-system.sh

echo ""
echo "🎉 Automation Setup Complete!"
echo "================================"
echo ""
echo "🚀 Your AI Learning System is now fully automated!"
echo ""
echo "📋 Management Commands:"
echo "   ./start-learning-system.sh    - Start all automation"
echo "   ./stop-learning-system.sh     - Stop all automation"
echo "   ./status-learning-system.sh   - Check system status"
echo ""
echo "📊 Monitoring:"
echo "   tail -f logs/daemon.out       - Watch live activity"
echo "   ls daily-lessons/             - See generated lessons"
echo "   cat logs/daemon.log           - Full system log"
echo ""
echo "📧 You'll receive notifications at: $(grep EMAIL_USER .env | cut -d'=' -f2)"
echo "📅 Daily schedule: 7:00 AM, 8:00 AM, 1:00 PM, 3:00 PM, 5:00 PM"
echo ""
echo "✅ No more manual work needed - everything runs automatically!"

# Test the system
echo ""
echo "🧪 Running quick test..."
if node test-config.js | grep -q "System ready"; then
    echo "✅ System test passed!"
else
    echo "⚠️ System test had issues - check configuration"
fi

echo ""
echo "🎯 Quick Start: ./start-learning-system.sh"