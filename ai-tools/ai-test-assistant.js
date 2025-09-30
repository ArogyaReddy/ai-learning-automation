/**
 * AI-Powered Test Assistant
 * Uses OpenRouter API to provide intelligent automation assistance
 */

const axios = require('axios');
require('dotenv').config();

class AITestAssistant {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    }

    async generateLocatorStrategy(elementDescription, pageContext = '') {
        const prompt = `
        As an expert automation engineer, generate robust locator strategies for this element:
        
        Element Description: ${elementDescription}
        Page Context: ${pageContext}
        
        Provide 5 different locator strategies in order of reliability:
        1. Most specific and reliable
        2. Backup strategy
        3. Fallback option
        4. Last resort
        5. Dynamic/AI-powered approach
        
        Format as JavaScript array of strings that can be used directly with Playwright.
        Include comments explaining each strategy.
        `;

        try {
            const response = await this.callAI(prompt);
            return this.parseLocatorStrategies(response);
        } catch (error) {
            console.error('AI locator generation failed:', error.message);
            return this.getFallbackLocators(elementDescription);
        }
    }

    async generateTestData(dataType, context = '') {
        const prompt = `
        Generate realistic test data for automation testing:
        
        Data Type: ${dataType}
        Context: ${context}
        
        Provide diverse, realistic data that covers:
        - Happy path scenarios
        - Edge cases
        - Boundary conditions
        - Invalid data for negative testing
        
        Return as JavaScript object with clear structure.
        `;

        try {
            const response = await this.callAI(prompt);
            return this.parseTestData(response);
        } catch (error) {
            console.error('AI test data generation failed:', error.message);
            return this.getFallbackTestData(dataType);
        }
    }

    async analyzePage(pageUrl, pageContent = '') {
        const prompt = `
        Analyze this web page for automation opportunities:
        
        URL: ${pageUrl}
        Content Preview: ${pageContent.substring(0, 1000)}
        
        Provide:
        1. Key elements to automate
        2. Potential challenges
        3. Recommended automation approach
        4. Risk areas
        5. Performance considerations
        
        Focus on ADP/payroll system patterns.
        `;

        try {
            const response = await this.callAI(prompt);
            return this.parsePageAnalysis(response);
        } catch (error) {
            console.error('AI page analysis failed:', error.message);
            return this.getFallbackAnalysis();
        }
    }

    async suggestWaitStrategy(scenario) {
        const prompt = `
        Suggest the best waiting strategy for this scenario:
        
        Scenario: ${scenario}
        
        Recommend:
        1. Primary waiting approach
        2. Backup strategies
        3. Timeout values
        4. Error handling
        5. Performance optimization
        
        Provide Playwright code examples.
        `;

        try {
            const response = await this.callAI(prompt);
            return this.parseWaitStrategy(response);
        } catch (error) {
            console.error('AI wait strategy failed:', error.message);
            return this.getFallbackWaitStrategy();
        }
    }

    async debugTestFailure(errorMessage, testContext) {
        const prompt = `
        Help debug this test failure:
        
        Error: ${errorMessage}
        Test Context: ${testContext}
        
        Provide:
        1. Root cause analysis
        2. Debugging steps
        3. Potential fixes
        4. Prevention strategies
        5. Code improvements
        
        Focus on practical, actionable solutions.
        `;

        try {
            const response = await this.callAI(prompt);
            return this.parseDebugSuggestions(response);
        } catch (error) {
            console.error('AI debugging failed:', error.message);
            return this.getFallbackDebugSuggestions(errorMessage);
        }
    }

    async callAI(prompt) {
        const response = await axios.post(this.apiUrl, {
            model: "microsoft/phi-3-mini-128k-instruct:free",
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.3,
            max_tokens: 1500
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    }

    parseLocatorStrategies(response) {
        try {
            // Extract JavaScript array from response
            const arrayMatch = response.match(/\[([\s\S]*?)\]/);
            if (arrayMatch) {
                return eval(`[${arrayMatch[1]}]`);
            }
        } catch (error) {
            // Fallback parsing
        }
        
        // Extract strategies manually
        const strategies = [];
        const lines = response.split('\n');
        
        for (const line of lines) {
            if (line.includes('\'') || line.includes('"')) {
                const match = line.match(/['"]([^'"]+)['"]/);
                if (match) {
                    strategies.push(match[1]);
                }
            }
        }
        
        return strategies.slice(0, 5);
    }

    parseTestData(response) {
        try {
            // Try to extract JSON object
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            // Manual parsing fallback
        }
        
        return this.extractStructuredData(response);
    }

    parsePageAnalysis(response) {
        const sections = response.split(/\d+\./);
        
        return {
            keyElements: this.extractSection(sections, 1),
            challenges: this.extractSection(sections, 2),
            approach: this.extractSection(sections, 3),
            risks: this.extractSection(sections, 4),
            performance: this.extractSection(sections, 5)
        };
    }

    parseWaitStrategy(response) {
        return {
            primary: this.extractCodeBlock(response, 0),
            backup: this.extractCodeBlock(response, 1),
            timeout: this.extractNumber(response, 'timeout') || 10000,
            explanation: response.substring(0, 300)
        };
    }

    parseDebugSuggestions(response) {
        const sections = response.split(/\d+\./);
        
        return {
            rootCause: this.extractSection(sections, 1),
            debugSteps: this.extractSection(sections, 2),
            fixes: this.extractSection(sections, 3),
            prevention: this.extractSection(sections, 4),
            improvements: this.extractSection(sections, 5)
        };
    }

    extractSection(sections, index) {
        if (sections[index]) {
            return sections[index].trim().split('\n')[0];
        }
        return 'Analysis not available';
    }

    extractCodeBlock(text, index = 0) {
        const codeBlocks = text.match(/```[\s\S]*?```/g);
        if (codeBlocks && codeBlocks[index]) {
            return codeBlocks[index].replace(/```\w*\n?/g, '').trim();
        }
        return null;
    }

    extractNumber(text, keyword) {
        const regex = new RegExp(`${keyword}[^\\d]*(\\d+)`, 'i');
        const match = text.match(regex);
        return match ? parseInt(match[1]) : null;
    }

    extractStructuredData(response) {
        // Basic structured data extraction
        const data = {};
        const lines = response.split('\n');
        
        let currentSection = 'general';
        for (const line of lines) {
            if (line.includes(':')) {
                const [key, value] = line.split(':', 2);
                data[key.trim().toLowerCase()] = value.trim();
            }
        }
        
        return data;
    }

    // Fallback methods for offline/error scenarios
    getFallbackLocators(elementDescription) {
        const baseSelectors = [
            `[data-testid*="${elementDescription.toLowerCase()}"]`,
            `[aria-label*="${elementDescription}"]`,
            `text=${elementDescription}`,
            `css=*[class*="${elementDescription.toLowerCase()}"]`,
            `css=*[id*="${elementDescription.toLowerCase()}"]`
        ];
        
        return baseSelectors;
    }

    getFallbackTestData(dataType) {
        const dataTemplates = {
            employee: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '555-0123'
            },
            payroll: {
                salary: '75000',
                frequency: 'bi-weekly',
                startDate: '2024-01-01'
            }
        };
        
        return dataTemplates[dataType] || { value: 'test-data' };
    }

    getFallbackAnalysis() {
        return {
            keyElements: 'Form inputs, submit buttons, navigation elements',
            challenges: 'Dynamic content, loading states, validation messages',
            approach: 'Page object pattern with robust waiting strategies',
            risks: 'Element locator changes, timing issues, data dependencies',
            performance: 'Minimize waits, use parallel execution where possible'
        };
    }

    getFallbackWaitStrategy() {
        return {
            primary: 'await page.waitForSelector(selector, { state: "visible" })',
            backup: 'await page.waitForLoadState("networkidle")',
            timeout: 10000,
            explanation: 'Use explicit waits for better reliability'
        };
    }

    getFallbackDebugSuggestions(errorMessage) {
        const commonSolutions = {
            'timeout': 'Increase timeout or improve waiting strategy',
            'not found': 'Verify selector accuracy and element availability',
            'not visible': 'Check for overlay elements or loading states',
            'not clickable': 'Ensure element is not covered by other elements'
        };
        
        const suggestion = Object.keys(commonSolutions)
            .find(key => errorMessage.toLowerCase().includes(key));
            
        return {
            rootCause: suggestion ? commonSolutions[suggestion] : 'Check element state and timing',
            debugSteps: 'Take screenshots, check page state, verify selectors',
            fixes: 'Update selectors, improve waiting, handle edge cases',
            prevention: 'Use robust locator strategies, add proper waits',
            improvements: 'Implement retry logic, add better error handling'
        };
    }
}

// Smart Test Generator using AI
class SmartTestGenerator {
    constructor() {
        this.aiAssistant = new AITestAssistant();
    }

    async generateTestSuite(applicationUrl, testRequirements) {
        console.log('🤖 Generating AI-powered test suite...');
        
        try {
            // Analyze the application
            const analysis = await this.aiAssistant.analyzePage(applicationUrl, testRequirements);
            
            // Generate test scenarios
            const scenarios = await this.generateScenarios(testRequirements);
            
            // Create test code
            const testCode = await this.generateTestCode(scenarios, analysis);
            
            return {
                analysis,
                scenarios,
                testCode,
                metadata: {
                    generated: new Date().toISOString(),
                    aiModel: 'llama-3.1-8b',
                    version: '1.0'
                }
            };
            
        } catch (error) {
            console.error('Test generation failed:', error.message);
            throw error;
        }
    }

    async generateScenarios(requirements) {
        const prompt = `
        Generate comprehensive test scenarios for:
        ${requirements}
        
        Include:
        - Positive test cases
        - Negative test cases
        - Edge cases
        - Performance scenarios
        - Accessibility tests
        
        Format as structured test scenarios.
        `;

        const response = await this.aiAssistant.callAI(prompt);
        return this.parseScenarios(response);
    }

    async generateTestCode(scenarios, analysis) {
        const testTemplate = `
        const { test, expect } = require('@playwright/test');
        
        test.describe('AI Generated Test Suite', () => {
            ${scenarios.map(scenario => this.generateTestFunction(scenario)).join('\n\n')}
        });
        `;
        
        return testTemplate;
    }

    generateTestFunction(scenario) {
        return `
    test('${scenario.name}', async ({ page }) => {
        // ${scenario.description}
        ${scenario.steps.map(step => `        ${step}`).join('\n')}
    });`;
    }

    parseScenarios(response) {
        // Parse AI response into structured scenarios
        const scenarios = [];
        const sections = response.split(/test|scenario/i);
        
        for (let i = 1; i < sections.length; i++) {
            const section = sections[i].trim();
            if (section) {
                scenarios.push({
                    name: this.extractTestName(section),
                    description: this.extractDescription(section),
                    steps: this.extractSteps(section)
                });
            }
        }
        
        return scenarios;
    }

    extractTestName(text) {
        const firstLine = text.split('\n')[0];
        return firstLine.replace(/[^\w\s]/g, '').trim() || 'Generated Test';
    }

    extractDescription(text) {
        const lines = text.split('\n');
        return lines.find(line => line.length > 20)?.trim() || 'AI generated test scenario';
    }

    extractSteps(text) {
        const steps = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            if (line.includes('await ') || line.includes('expect(')) {
                steps.push(line.trim());
            }
        }
        
        return steps.length > 0 ? steps : [
            'await page.goto("/");',
            '// Add test steps here'
        ];
    }
}

module.exports = {
    AITestAssistant,
    SmartTestGenerator
};