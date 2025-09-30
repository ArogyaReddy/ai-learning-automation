/**
 * Advanced Browser Automation Utilities
 * Production-ready helper functions for complex automation scenarios
 */

// Smart Element Locator with AI-like Behavior
class SmartElementLocator {
    constructor(page) {
        this.page = page;
        this.retryCount = 3;
        this.retryDelay = 1000;
    }

    async findElement(strategies, options = {}) {
        const { timeout = 10000, retries = this.retryCount } = options;
        
        for (let attempt = 0; attempt < retries; attempt++) {
            for (const strategy of strategies) {
                try {
                    const element = await this.page.locator(strategy).first();
                    
                    // Check if element is actually interactable
                    if (await this.isElementReady(element, timeout)) {
                        console.log(`✅ Element found with strategy: ${strategy}`);
                        return element;
                    }
                } catch (error) {
                    // Try next strategy
                    continue;
                }
            }
            
            if (attempt < retries - 1) {
                console.log(`⏳ Attempt ${attempt + 1} failed, retrying...`);
                await this.page.waitForTimeout(this.retryDelay);
            }
        }
        
        throw new Error(`Element not found with any of the ${strategies.length} strategies after ${retries} attempts`);
    }

    async isElementReady(element, timeout) {
        try {
            // Check multiple conditions
            await Promise.all([
                element.waitFor({ state: 'visible', timeout: timeout / 4 }),
                element.waitFor({ state: 'stable', timeout: timeout / 4 })
            ]);
            
            // Additional checks
            const isEnabled = await element.isEnabled();
            const boundingBox = await element.boundingBox();
            
            return isEnabled && boundingBox && boundingBox.width > 0 && boundingBox.height > 0;
            
        } catch (error) {
            return false;
        }
    }
}

// Shadow DOM Navigation Helper
class ShadowDOMNavigator {
    constructor(page) {
        this.page = page;
    }

    async findInShadowDOM(hostSelector, shadowSelector) {
        return await this.page.evaluateHandle(
            ({ hostSelector, shadowSelector }) => {
                const host = document.querySelector(hostSelector);
                if (!host || !host.shadowRoot) {
                    throw new Error(`Shadow host not found: ${hostSelector}`);
                }
                
                const shadowElement = host.shadowRoot.querySelector(shadowSelector);
                if (!shadowElement) {
                    throw new Error(`Element not found in shadow DOM: ${shadowSelector}`);
                }
                
                return shadowElement;
            },
            { hostSelector, shadowSelector }
        );
    }

    async clickInShadowDOM(hostSelector, shadowSelector) {
        const element = await this.findInShadowDOM(hostSelector, shadowSelector);
        
        await this.page.evaluate(element => {
            element.click();
        }, element);
    }

    async typeInShadowDOM(hostSelector, shadowSelector, text) {
        const element = await this.findInShadowDOM(hostSelector, shadowSelector);
        
        await this.page.evaluate(
            ({ element, text }) => {
                element.focus();
                element.value = text;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            },
            { element, text }
        );
    }
}

// Dynamic Content Handler
class DynamicContentHandler {
    constructor(page) {
        this.page = page;
    }

    async waitForDynamicContent(selector, expectedCount = 1, timeout = 30000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const elements = await this.page.locator(selector);
                const count = await elements.count();
                
                if (count >= expectedCount) {
                    // Wait a bit more to ensure content is stable
                    await this.page.waitForTimeout(500);
                    
                    const finalCount = await elements.count();
                    if (finalCount === count) {
                        return elements;
                    }
                }
                
                await this.page.waitForTimeout(1000);
                
            } catch (error) {
                await this.page.waitForTimeout(1000);
            }
        }
        
        throw new Error(`Dynamic content not loaded within ${timeout}ms`);
    }

    async waitForTableToLoad(tableSelector, minRows = 1) {
        console.log(`⏳ Waiting for table to load: ${tableSelector}`);
        
        // Wait for table to appear
        await this.page.waitForSelector(tableSelector);
        
        // Wait for loading indicators to disappear
        const loadingSelectors = [
            '.loading',
            '.spinner',
            '.sk-loading',
            '[data-testid="loading"]'
        ];
        
        for (const loadingSelector of loadingSelectors) {
            try {
                await this.page.waitForSelector(loadingSelector, { 
                    state: 'hidden', 
                    timeout: 5000 
                });
            } catch (error) {
                // Loading indicator might not exist
            }
        }
        
        // Wait for minimum rows
        const rowsSelector = `${tableSelector} tbody tr`;
        await this.waitForDynamicContent(rowsSelector, minRows);
        
        console.log('✅ Table loaded successfully');
    }
}

// Form Automation with Validation
class SmartFormFiller {
    constructor(page) {
        this.page = page;
        this.locator = new SmartElementLocator(page);
    }

    async fillForm(formData, formSelector = 'form') {
        console.log('📝 Starting smart form filling...');
        
        // Wait for form to be ready
        await this.page.waitForSelector(formSelector);
        
        const results = {
            success: [],
            failed: [],
            skipped: []
        };
        
        for (const [fieldName, fieldData] of Object.entries(formData)) {
            try {
                await this.fillField(fieldName, fieldData, formSelector);
                results.success.push(fieldName);
                console.log(`✅ ${fieldName}: Filled successfully`);
                
            } catch (error) {
                results.failed.push({ field: fieldName, error: error.message });
                console.error(`❌ ${fieldName}: ${error.message}`);
            }
        }
        
        console.log(`📊 Form filling complete: ${results.success.length} success, ${results.failed.length} failed`);
        return results;
    }

    async fillField(fieldName, fieldData, formSelector) {
        const { value, type = 'text', required = false } = fieldData;
        
        if (!value && !required) {
            console.log(`⏭️  Skipping optional field: ${fieldName}`);
            return;
        }
        
        // Multiple selector strategies for the field
        const strategies = [
            `${formSelector} [name="${fieldName}"]`,
            `${formSelector} #${fieldName}`,
            `${formSelector} [data-testid="${fieldName}"]`,
            `${formSelector} [data-field="${fieldName}"]`,
            `${formSelector} .${fieldName}-field input`,
            `${formSelector} label:has-text("${fieldName}") + input`
        ];
        
        const element = await this.locator.findElement(strategies);
        
        // Handle different field types
        switch (type) {
            case 'select':
                await element.selectOption(value);
                break;
                
            case 'checkbox':
                if (value) await element.check();
                else await element.uncheck();
                break;
                
            case 'radio':
                await this.page.check(`input[name="${fieldName}"][value="${value}"]`);
                break;
                
            case 'date':
                await this.fillDateField(element, value);
                break;
                
            case 'file':
                await element.setInputFiles(value);
                break;
                
            default: // text, email, password, etc.
                await element.fill(value);
                
                // Trigger validation
                await element.blur();
                await this.page.waitForTimeout(300);
        }
        
        // Verify field was filled correctly (for non-file inputs)
        if (type !== 'file' && type !== 'checkbox' && type !== 'radio') {
            await this.verifyFieldValue(element, value, type);
        }
    }

    async fillDateField(element, dateValue) {
        // Different strategies for date inputs
        const elementType = await element.getAttribute('type');
        
        if (elementType === 'date') {
            // HTML5 date input
            await element.fill(dateValue);
        } else {
            // Regular input field - might open date picker
            await element.click();
            
            // Check if date picker opened
            const datePicker = this.page.locator('.date-picker, .datepicker, [role="dialog"]');
            
            if (await datePicker.isVisible()) {
                await this.navigateDatePicker(datePicker, dateValue);
            } else {
                // Just type the date
                await element.fill(dateValue);
            }
        }
    }

    async navigateDatePicker(datePicker, dateValue) {
        // Parse target date
        const targetDate = new Date(dateValue);
        const targetMonth = targetDate.getMonth();
        const targetYear = targetDate.getFullYear();
        const targetDay = targetDate.getDate();
        
        // Navigate to correct month/year
        // This is a simplified version - real implementation would be more robust
        const monthSelect = datePicker.locator('select[name="month"], .month-select');
        const yearSelect = datePicker.locator('select[name="year"], .year-select');
        
        if (await monthSelect.isVisible()) {
            await monthSelect.selectOption({ index: targetMonth });
        }
        
        if (await yearSelect.isVisible()) {
            await yearSelect.selectOption(targetYear.toString());
        }
        
        // Click on the day
        const dayButton = datePicker.locator(`button:has-text("${targetDay}")`);
        await dayButton.click();
    }

    async verifyFieldValue(element, expectedValue, type) {
        let actualValue;
        
        switch (type) {
            case 'select':
                actualValue = await element.locator('option:checked').textContent();
                break;
            default:
                actualValue = await element.inputValue();
        }
        
        if (actualValue !== expectedValue) {
            console.warn(`⚠️  Value mismatch - Expected: "${expectedValue}", Got: "${actualValue}"`);
        }
    }
}

// Performance Monitor for Automation
class PerformanceMonitor {
    constructor(page) {
        this.page = page;
        this.metrics = [];
    }

    async startMonitoring(testName) {
        this.testName = testName;
        this.startTime = Date.now();
        
        // Start collecting performance metrics
        await this.page.addInitScript(() => {
            window.performanceMarks = [];
            
            const originalMark = performance.mark;
            performance.mark = function(name) {
                window.performanceMarks.push({ name, timestamp: Date.now() });
                return originalMark.call(this, name);
            };
        });
    }

    async recordAction(actionName, actionFunction) {
        const actionStart = Date.now();
        
        try {
            const result = await actionFunction();
            const actionEnd = Date.now();
            
            this.metrics.push({
                action: actionName,
                duration: actionEnd - actionStart,
                success: true,
                timestamp: actionStart
            });
            
            return result;
            
        } catch (error) {
            const actionEnd = Date.now();
            
            this.metrics.push({
                action: actionName,
                duration: actionEnd - actionStart,
                success: false,
                error: error.message,
                timestamp: actionStart
            });
            
            throw error;
        }
    }

    async getReport() {
        const totalDuration = Date.now() - this.startTime;
        const successfulActions = this.metrics.filter(m => m.success);
        const failedActions = this.metrics.filter(m => !m.success);
        
        // Get browser performance metrics
        const browserMetrics = await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };
        });

        return {
            testName: this.testName,
            totalDuration,
            actionCount: this.metrics.length,
            successRate: (successfulActions.length / this.metrics.length) * 100,
            averageActionTime: successfulActions.reduce((sum, m) => sum + m.duration, 0) / successfulActions.length,
            slowestAction: this.metrics.reduce((max, m) => m.duration > max.duration ? m : max, this.metrics[0]),
            failedActions: failedActions.map(f => ({ action: f.action, error: f.error })),
            browserMetrics,
            detailedMetrics: this.metrics
        };
    }
}

module.exports = {
    SmartElementLocator,
    ShadowDOMNavigator,
    DynamicContentHandler,
    SmartFormFiller,
    PerformanceMonitor
};