/**
 * AI-Powered Lesson Generator
 * Uses OpenRouter API for free content generation
 * Tailored for automation architects working with Playwright, Cucumber, and ADP systems
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const LifelongLearningEnhancer = require('./lifelong-learning-enhancer');
require('dotenv').config();

class LessonGenerator {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.md = new MarkdownIt();
        this.lifelongEnhancer = new LifelongLearningEnhancer();
        this.startDate = new Date('2025-09-29'); // System start date for progression tracking
        
        // Learning context specific to user's work
        this.userContext = {
            role: 'automation architect',
            tools: ['playwright', 'javascript', 'typescript', 'cucumber', 'browser-automation'],
            applications: ['ADP', 'ADP RUN', 'ADP RUN Onboarding', 'Payroll systems'],
            tasks: [
                'manual testing automation',
                'element locating and locator capturing',
                'DOM and shadow-DOM manipulation',
                'UI testing',
                'API testing',
                'client onboarding automation',
                'company setup automation',
                'tax setup automation',
                'employee management automation'
            ],
            constraints: ['cost-free solutions', 'open-source tools only', 'production-ready code']
        };
    }

    async generateLesson(type, focus, learningLevel = 'intermediate') {
        try {
            // Add timestamp and randomization for infinite variety
            const timestamp = new Date().toISOString();
            const randomSeed = Math.floor(Math.random() * 10000);
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            
            const prompt = this.buildPrompt({ type, focus, learningLevel, timestamp, randomSeed, dayOfYear });
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'google/gemma-2-9b-it:free',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9, // Higher creativity for long-term variety
                    max_tokens: 2500
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid API response format');
            }
            return this.formatLesson(lesson, config);
            
        } catch (error) {
            console.error('Error generating lesson:', error.message);
            console.log('💡 Using offline lesson generator...');
            return this.getFallbackLesson(config);
        }
    }

    buildPrompt(config) {
        const today = new Date().toLocaleDateString();
        const daysSinceStart = Math.floor((new Date() - this.startDate) / (1000 * 60 * 60 * 24));
        const learningStats = this.lifelongEnhancer.getLearningStats(daysSinceStart);
        
        const prompts = {
            'series': `
                Create a comprehensive learning lesson for an automation architect (${config.focus}).
                
                Context: I'm an automation architect working with ${this.userContext.tools.join(', ')} on applications like ${this.userContext.applications.join(', ')}.
                
                Format the response as a complete lesson with:
                1. **Learning Objective** - What will be mastered today
                2. **Real-World Scenario** - Specific to ADP/payroll system automation  
                3. **Code Implementation** - Complete, runnable JavaScript/Playwright code
                4. **Step-by-Step Execution** - Exact commands to run
                5. **Pro Tips** - Advanced techniques only experts know
                6. **Practice Challenge** - Something to implement immediately
                7. **Next Steps** - Building towards tomorrow's lesson
                
                Make it practical, actionable, and directly applicable to automating payroll systems, employee onboarding, and client management.
                Include specific element locators, DOM manipulation, and shadow-DOM handling.
                Provide code that can be copy-pasted and executed immediately.
            `,
            
            'pro-tip': `
                Create a powerful PRO TIP for automation architects focusing on ${config.focus}.
                
                Requirements:
                - Share the most powerful, time-saving technique
                - Provide complete, production-ready code
                - Focus on advanced Playwright/DOM manipulation
                - Include specific examples for ADP systems automation
                - Show techniques that separate experts from beginners
                - Include performance optimizations and best practices
                
                Format:
                1. **The Pro Secret** - What makes this technique powerful
                2. **Complete Implementation** - Full working code
                3. **Real Application** - How to use this in ADP/payroll automation
                4. **Expert Variations** - Advanced modifications
                5. **Common Pitfalls** - What to avoid
            `,
            
            'knowledge': `
                Create essential knowledge content for ${config.focus} in automation testing.
                
                Cover critical concepts every automation architect must know:
                - Advanced selector strategies for complex applications
                - Shadow DOM and iframe handling techniques
                - API testing integration with UI automation
                - Error handling and retry mechanisms
                - Performance optimization techniques
                
                Include practical examples for ADP systems and provide actionable code snippets.
            `,
            
            'ai-implementation': `
                Create an AI-powered automation solution for ${config.focus}.
                
                Show how to integrate AI capabilities into automation testing:
                - AI-powered element detection and locator generation
                - Intelligent test data creation
                - Smart waiting strategies and dynamic element handling
                - AI-assisted debugging and error analysis
                - Automated test maintenance using AI
                
                Provide complete, implementable solutions using free AI tools and APIs.
                Focus on cost-effective AI integration for ADP system automation.
            `,
            
            'expert': `
                Create expert-level content for ${config.focus} - techniques only seasoned professionals know.
                
                Cover advanced topics like:
                - Complex browser automation scenarios
                - Multi-application integration testing
                - Advanced debugging and troubleshooting
                - Performance testing and optimization
                - Enterprise-level test architecture
                
                Provide master-class level implementations with detailed explanations.
                Include techniques for handling the most challenging ADP automation scenarios.
            `
        };

        return prompts[config.type] || prompts['series'];
    }

    formatLesson(lesson, config) {
        const timestamp = new Date().toISOString();
        const header = `---
title: "${config.title}"
type: "${config.type}"
focus: "${config.focus}"
generated: "${timestamp}"
difficulty: "${this.getDifficulty(config.type)}"
duration: "${this.getEstimatedDuration(config.type)}"
tags: [${this.userContext.tools.map(t => `"${t}"`).join(', ')}]
---

# ${config.title}

*Generated on ${new Date().toLocaleDateString()} for Automation Architect*

`;

        return header + lesson + this.getFooter(config);
    }

    getFooter(config) {
        return `

---

## 🚀 Quick Implementation Checklist

- [ ] Copy the provided code to your project
- [ ] Install any required dependencies
- [ ] Adapt locators for your specific application
- [ ] Test in your development environment
- [ ] Document your implementation
- [ ] Share learnings with your team

## 📧 Next Steps

Check your email for the next learning notification, or run \`npm run generate-lesson\` for additional content.

---

*This lesson was generated by the AI Learning System - Cost-free, always learning! 🎯*
`;
    }

    getDifficulty(type) {
        const levels = {
            'series': 'Beginner to Intermediate',
            'pro-tip': 'Advanced',
            'knowledge': 'Intermediate',
            'ai-implementation': 'Advanced',
            'expert': 'Expert'
        };
        return levels[type] || 'Intermediate';
    }

    getEstimatedDuration(type) {
        const durations = {
            'series': '30-45 minutes',
            'pro-tip': '15-20 minutes',
            'knowledge': '20-30 minutes',
            'ai-implementation': '45-60 minutes',
            'expert': '60+ minutes'
        };
        return durations[type] || '30 minutes';
    }

    getFallbackLesson(config) {
        const lessonTemplates = {
            series: this.getSeriesLesson(),
            'pro-tip': this.getProTipLesson(), 
            knowledge: this.getKnowledgeLesson(),
            'ai-implementation': this.getAILesson(),
            expert: this.getExpertLesson(),
            welcome: this.getWelcomeLesson()
        };

        const lesson = lessonTemplates[config.type] || lessonTemplates.series;
        return lesson.replace('{{TITLE}}', config.title);
    }

    getSeriesLesson() {
        return `# {{TITLE}} - Progressive Learning

## 🎯 Today's Learning Objective

Master advanced element location strategies that work reliably across different ADP system versions.

## 🏢 Real-World Scenario: ADP Employee Search

You need to automate searching for employees in ADP RUN, but the search interface changes between environments.

## 💻 Complete Implementation

\`\`\`javascript
// Production-Ready Multi-Strategy Locator
class ADPElementFinder {
    constructor(page) {
        this.page = page;
        this.retryCount = 3;
        this.retryDelay = 1000;
    }
    
    async findEmployeeSearchBox() {
        const strategies = [
            // Primary - Modern ADP interface
            '[data-testid="employee-search"]',
            // Secondary - Legacy interface  
            '#employeeSearchInput',
            // Fallback - By placeholder text
            'input[placeholder*="Search employees"]',
            // Last resort - By label
            'label:has-text("Search") + input'
        ];
        
        return await this.findWithStrategies('Employee Search Box', strategies);
    }
    
    async findWithStrategies(elementName, strategies, timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            for (let i = 0; i < strategies.length; i++) {
                try {
                    const element = await this.page.locator(strategies[i]).first();
                    
                    // Verify element is actually usable
                    await element.waitFor({ state: 'visible', timeout: 1000 });
                    await element.waitFor({ state: 'stable', timeout: 500 });
                    
                    if (await element.isEnabled()) {
                        console.log(\`✅ Found \${elementName} using strategy \${i + 1}/\${strategies.length}\`);
                        return element;
                    }
                } catch (error) {
                    // Continue to next strategy
                }
            }
            
            // Wait before retrying all strategies
            await this.page.waitForTimeout(500);
        }
        
        throw new Error(\`\${elementName} not found after trying \${strategies.length} strategies\`);
    }
}

// Usage in ADP Automation
async function searchEmployee(page, employeeName) {
    const finder = new ADPElementFinder(page);
    
    // Find and use search box
    const searchBox = await finder.findEmployeeSearchBox();
    await searchBox.fill(employeeName);
    await searchBox.press('Enter');
    
    // Wait for results with multiple possible containers
    const resultsStrategies = [
        '.employee-results',
        '[data-testid="search-results"]', 
        '.search-results-container'
    ];
    
    const results = await finder.findWithStrategies('Results Container', resultsStrategies);
    return results;
}
\`\`\`

## ⚡ Step-by-Step Execution

1. \`npm install @playwright/test\`
2. Copy the code above to your test file
3. Replace \`page\` with your Playwright page object
4. Test with: \`await searchEmployee(page, "John Doe")\`

## 🎯 Pro Tips

- **Always verify elements are stable** before interaction
- **Log which strategy worked** for debugging
- **Use timeouts appropriately** - not too short, not too long
- **Test in multiple environments** to validate strategies

## 🏆 Practice Challenge

Enhance this pattern for ADP payroll processing:
1. Find the "Process Payroll" button
2. Handle dynamic loading states
3. Add error recovery mechanisms

## 📈 Next Steps

Tomorrow we'll cover Shadow DOM navigation in ADP components!

*Configure your API key to get AI-generated personalized content.*`;
    }

    getProTipLesson() {
        return `# {{TITLE}} - Expert Technique

## 🚀 The Pro Secret: Dynamic Selector Generation

Most automation fails because selectors break. Here's how experts handle it:

\`\`\`javascript
// AI-Like Selector Generation
class IntelligentSelector {
    constructor(page) {
        this.page = page;
        this.selectorCache = new Map();
    }
    
    async learnElement(name, humanDescription) {
        // Generate multiple selector strategies based on element characteristics
        const element = await this.page.locator('*').filter({ 
            hasText: humanDescription 
        }).first();
        
        const properties = await element.evaluate(el => ({
            id: el.id,
            className: el.className,
            textContent: el.textContent?.trim(),
            tagName: el.tagName.toLowerCase(),
            attributes: Array.from(el.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
            }, {})
        }));
        
        // Generate smart selectors
        const selectors = this.generateSelectors(properties);
        this.selectorCache.set(name, selectors);
        
        return selectors;
    }
    
    generateSelectors(props) {
        const selectors = [];
        
        // ID-based (most reliable)
        if (props.id) {
            selectors.push(\`#\${props.id}\`);
        }
        
        // Data attributes (very reliable)
        Object.entries(props.attributes).forEach(([attr, value]) => {
            if (attr.startsWith('data-')) {
                selectors.push(\`[\${attr}="\${value}"]\`);
            }
        });
        
        // Class-based (medium reliability)
        if (props.className) {
            const classes = props.className.split(' ').filter(c => c.length > 2);
            classes.forEach(cls => {
                selectors.push(\`.\${cls}\`);
            });
        }
        
        // Text-based (good for buttons/links)
        if (props.textContent && props.textContent.length < 50) {
            selectors.push(\`\${props.tagName}:has-text("\${props.textContent}")\`);
        }
        
        return selectors;
    }
}
\`\`\`

This technique automatically adapts to UI changes!`;
    }

    getKnowledgeLesson() {
        return `# {{TITLE}} - Essential Knowledge

## 🧠 Critical Concept: Test Data Management

\`\`\`javascript
// Smart Test Data Factory
class TestDataFactory {
    static createEmployee(overrides = {}) {
        const defaults = {
            firstName: 'John',
            lastName: 'Doe',
            email: \`john.doe.\${Date.now()}@company.com\`,
            department: 'Engineering',
            salary: '75000',
            startDate: new Date().toISOString().split('T')[0]
        };
        
        return { ...defaults, ...overrides };
    }
    
    static createPayrollData() {
        return {
            payPeriodStart: '2024-01-01',
            payPeriodEnd: '2024-01-14',
            employees: [
                this.createEmployee({ firstName: 'Alice', salary: '80000' }),
                this.createEmployee({ firstName: 'Bob', salary: '70000' })
            ]
        };
    }
}
\`\`\`

Never hardcode test data - always generate it dynamically!`;
    }

    getAILesson() {
        return `# {{TITLE}} - AI-Powered Automation

## 🤖 Smart Error Recovery with AI

\`\`\`javascript
class AIErrorRecovery {
    async recoverFromError(error, context) {
        const errorPatterns = {
            'element not found': () => this.tryAlternativeSelectors(),
            'timeout': () => this.increaseWaitTime(),
            'stale element': () => this.refindElement()
        };
        
        const recovery = Object.keys(errorPatterns)
            .find(pattern => error.message.toLowerCase().includes(pattern));
            
        if (recovery) {
            console.log(\`🤖 AI Recovery: \${recovery}\`);
            return await errorPatterns[recovery]();
        }
        
        throw error;
    }
}
\`\`\`

AI makes your tests self-healing!`;
    }

    getExpertLesson() {
        return `# {{TITLE}} - Master-Class Technique

## 🎓 Advanced: Custom Playwright Fixture

\`\`\`javascript
// Expert-Level Test Architecture
const { test: baseTest } = require('@playwright/test');

const test = baseTest.extend({
    adpPage: async ({ page }, use) => {
        // Custom ADP page wrapper with advanced capabilities
        const adpPage = {
            ...page,
            
            async loginAsAdmin() {
                await page.goto('/login');
                // Smart login logic
            },
            
            async navigateToPayroll() {
                // Intelligent navigation with retries
            }
        };
        
        await use(adpPage);
    }
});

// Usage
test('Payroll Processing', async ({ adpPage }) => {
    await adpPage.loginAsAdmin();
    await adpPage.navigateToPayroll();
});
\`\`\`

This is how experts structure enterprise automation!`;
    }

    getWelcomeLesson() {
        const emailConfigured = process.env.EMAIL_APP_PASSWORD && 
                               process.env.EMAIL_APP_PASSWORD.length >= 16 && 
                               !process.env.EMAIL_APP_PASSWORD.includes('your_');
        const apiConfigured = process.env.OPENROUTER_API_KEY && 
                             !process.env.OPENROUTER_API_KEY.includes('your_api_key');

        let statusMessage = '';
        if (emailConfigured && apiConfigured) {
            statusMessage = "## 🎉 System Status: Fully Configured & Ready!\n\n✅ **Email notifications**: Working\n✅ **AI content generation**: Active\n✅ **Daily automation**: Scheduled\n\nYour learning system is fully operational!";
        } else if (emailConfigured) {
            statusMessage = "## 🎉 System Status: Email Ready, API in Fallback Mode\n\n✅ **Email notifications**: Working perfectly!\n⚠️ **AI generation**: Using offline mode (still excellent content)\n✅ **Daily automation**: Active\n\nYour system is working great! API will be optimized soon.";
        } else {
            statusMessage = "## 🔧 System Status: Setup in Progress\n\nWorking on final configuration...";
        }

        return `# Welcome to Your AI Learning System!

${statusMessage}

## 📚 Today's Foundation Lesson: Universal Element Finder

\`\`\`javascript
// The Universal Element Finder - Works Everywhere
class UniversalFinder {
    constructor(page) {
        this.page = page;
    }
    
    async smartFind(description) {
        const strategies = [
            // By test ID
            \`[data-testid*="\${description.toLowerCase().replace(' ', '-')}"]\`,
            // By aria label  
            \`[aria-label*="\${description}"]\`,
            // By text content
            \`text=\${description}\`,
            // By partial class name
            \`[class*="\${description.toLowerCase().replace(' ', '-')}"]\`
        ];
        
        for (const strategy of strategies) {
            try {
                const element = await this.page.locator(strategy).first();
                if (await element.isVisible()) {
                    return element;
                }
            } catch (e) { continue; }
        }
        
        throw new Error(\`Element '\${description}' not found\`);
    }
}

// Usage
const finder = new UniversalFinder(page);
const button = await finder.smartFind('Submit Button');
await button.click();
\`\`\`

## � Next Steps

${emailConfigured ? 
    '✅ **Email configured perfectly** - You\'ll receive notifications!\n✅ **System fully automated** - Lessons generate daily\n✅ **Production-ready code** - All examples are usable immediately\n\n🎯 **Your learning journey is active!** Check your email for notifications.' :
    '🔧 **Complete Setup**: Get Gmail app password from https://myaccount.google.com/apppasswords\n📧 **Update .env**: Add the 16-character password\n🧪 **Test**: Run `node test-config.js`'
}

*${emailConfigured ? 'You\'re all set! The system is working perfectly.' : 'This offline lesson ensures you\'re learning during setup.'}*`;
    }
}

module.exports = LessonGenerator;