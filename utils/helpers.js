/**
 * Utility functions for the AI Learning System
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Create daily folder structure for lessons
 */
async function createDailyFolder() {
    const today = getCurrentDate();
    const dailyPath = path.join(__dirname, '../daily-lessons', today);
    
    await fs.ensureDir(dailyPath);
    return dailyPath;
}

/**
 * Get learning progress statistics
 */
async function getLearningStats() {
    const dailyLessonsDir = path.join(__dirname, '../daily-lessons');
    
    try {
        const files = await fs.readdir(dailyLessonsDir, { recursive: true });
        const lessons = files.filter(file => file.endsWith('.md'));
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        let recentLessons = 0;
        for (const lesson of lessons) {
            const lessonPath = path.join(dailyLessonsDir, lesson);
            const stats = await fs.stat(lessonPath);
            if (stats.mtime > thirtyDaysAgo) {
                recentLessons++;
            }
        }
        
        return {
            totalLessons: lessons.length,
            recentLessons,
            streakDays: await calculateLearningStreak()
        };
    } catch (error) {
        return { totalLessons: 0, recentLessons: 0, streakDays: 0 };
    }
}

/**
 * Calculate learning streak (consecutive days)
 */
async function calculateLearningStreak() {
    const dailyLessonsDir = path.join(__dirname, '../daily-lessons');
    let streak = 0;
    
    try {
        const today = new Date();
        let checkDate = new Date(today);
        
        while (streak < 365) { // Max 365 days to prevent infinite loop
            const dateStr = checkDate.toISOString().split('T')[0];
            const dayFolder = path.join(dailyLessonsDir, dateStr);
            
            const exists = await fs.pathExists(dayFolder);
            if (!exists) break;
            
            const files = await fs.readdir(dayFolder);
            const hasLessons = files.some(file => file.endsWith('.md'));
            
            if (!hasLessons) break;
            
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    } catch (error) {
        console.error('Error calculating streak:', error.message);
    }
    
    return streak;
}

/**
 * Ensure all required directories exist
 */
async function ensureDirectories() {
    const directories = [
        'daily-lessons',
        'automation-examples',
        'ai-tools',
        'email-automation',
        'learning-paths',
        'utils'
    ];
    
    for (const dir of directories) {
        await fs.ensureDir(path.join(__dirname, '..', dir));
    }
}

/**
 * Clean up old lesson files (keep last 30 days)
 */
async function cleanupOldLessons() {
    const dailyLessonsDir = path.join(__dirname, '../daily-lessons');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
        const folders = await fs.readdir(dailyLessonsDir);
        
        for (const folder of folders) {
            const folderPath = path.join(dailyLessonsDir, folder);
            const stats = await fs.stat(folderPath);
            
            if (stats.isDirectory() && stats.mtime < thirtyDaysAgo) {
                // Move to archive instead of deleting
                const archivePath = path.join(__dirname, '../archive', folder);
                await fs.move(folderPath, archivePath);
                console.log(`📦 Archived old lessons: ${folder}`);
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error.message);
    }
}

/**
 * Generate learning report
 */
async function generateLearningReport() {
    const stats = await getLearningStats();
    const today = getCurrentDate();
    
    const report = `
# Learning Progress Report
Generated: ${new Date().toLocaleString()}

## 📊 Statistics
- **Total Lessons**: ${stats.totalLessons}
- **Recent Lessons (30 days)**: ${stats.recentLessons}
- **Learning Streak**: ${stats.streakDays} days
- **Average per week**: ${Math.round(stats.recentLessons / 4.3)} lessons

## 🎯 Progress Analysis
${stats.streakDays > 7 ? '🔥 Amazing streak! You\'re building strong learning habits.' : '💪 Keep building your learning momentum!'}
${stats.recentLessons > 20 ? '🚀 Excellent consistency this month!' : '📈 Room to increase learning frequency.'}

## 🎓 Next Steps
- Continue daily learning sessions
- Focus on practical implementation
- Share knowledge with your team
- Build portfolio of automation solutions

---
*Keep up the great work! Every lesson brings you closer to automation mastery.*
    `;
    
    const reportPath = path.join(__dirname, '../daily-lessons', today, 'progress-report.md');
    await fs.writeFile(reportPath, report.trim());
    
    return report;
}

module.exports = {
    getCurrentDate,
    createDailyFolder,
    getLearningStats,
    calculateLearningStreak,
    ensureDirectories,
    cleanupOldLessons,
    generateLearningReport
};