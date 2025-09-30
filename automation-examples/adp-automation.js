/**
 * ADP System Automation Examples
 * Real-world code snippets for automating ADP applications
 */

// Advanced Login Automation with Multiple Strategies
class ADPLoginAutomation {
    constructor(page) {
        this.page = page;
        this.loginStrategies = {
            standard: {
                usernameSelector: '[data-testid="username"]',
                passwordSelector: '[data-testid="password"]',
                submitSelector: '[data-testid="login-submit"]'
            },
            fallback: {
                usernameSelector: 'input[name="username"]',
                passwordSelector: 'input[type="password"]',
                submitSelector: 'button[type="submit"]'
            },
            advanced: {
                usernameSelector: '#loginForm input:nth-child(1)',
                passwordSelector: '#loginForm input:nth-child(2)',
                submitSelector: '#loginForm button'
            }
        };
    }

    async login(username, password, strategy = 'standard') {
        const selectors = this.loginStrategies[strategy];
        
        try {
            // Wait for page to be ready
            await this.page.waitForLoadState('domcontentloaded');
            
            // Smart waiting for login form
            await this.page.waitForSelector(selectors.usernameSelector, { 
                timeout: 10000,
                state: 'visible' 
            });
            
            // Clear and type username
            await this.page.fill(selectors.usernameSelector, '');
            await this.page.fill(selectors.usernameSelector, username);
            
            // Clear and type password
            await this.page.fill(selectors.passwordSelector, '');
            await this.page.fill(selectors.passwordSelector, password);
            
            // Submit with retry logic
            await this.submitWithRetry(selectors.submitSelector);
            
            // Verify successful login
            await this.verifyLoginSuccess();
            
            console.log('✅ ADP Login successful');
            return true;
            
        } catch (error) {
            console.error(`❌ Login failed with ${strategy} strategy:`, error.message);
            
            // Try fallback strategy
            if (strategy === 'standard') {
                return await this.login(username, password, 'fallback');
            }
            throw error;
        }
    }

    async submitWithRetry(submitSelector, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.page.click(submitSelector);
                
                // Wait for navigation or error message
                await Promise.race([
                    this.page.waitForNavigation({ timeout: 5000 }),
                    this.page.waitForSelector('.error-message', { timeout: 2000 })
                ]);
                
                return; // Success
                
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await this.page.waitForTimeout(1000); // Wait before retry
            }
        }
    }

    async verifyLoginSuccess() {
        // Multiple success indicators
        const successIndicators = [
            '.dashboard',
            '[data-testid="user-menu"]',
            '.main-navigation',
            'text=Welcome'
        ];
        
        for (const indicator of successIndicators) {
            try {
                await this.page.waitForSelector(indicator, { timeout: 3000 });
                return true;
            } catch (error) {
                continue; // Try next indicator
            }
        }
        
        throw new Error('Login verification failed - no success indicators found');
    }
}

// Employee Onboarding Automation
class EmployeeOnboardingBot {
    constructor(page) {
        this.page = page;
    }

    async addNewEmployee(employeeData) {
        try {
            // Navigate to employee addition page
            await this.navigateToAddEmployee();
            
            // Fill personal information
            await this.fillPersonalInfo(employeeData.personal);
            
            // Fill employment details
            await this.fillEmploymentDetails(employeeData.employment);
            
            // Set up payroll information
            await this.setupPayroll(employeeData.payroll);
            
            // Configure benefits
            await this.configureBenefits(employeeData.benefits);
            
            // Submit and verify
            await this.submitAndVerify(employeeData.personal.firstName);
            
            console.log(`✅ Employee ${employeeData.personal.firstName} ${employeeData.personal.lastName} added successfully`);
            
        } catch (error) {
            console.error('❌ Employee onboarding failed:', error.message);
            await this.takeErrorScreenshot(employeeData.personal.firstName);
            throw error;
        }
    }

    async navigateToAddEmployee() {
        // Smart navigation with multiple paths
        const navigationPaths = [
            () => this.page.click('[data-testid="add-employee"]'),
            () => this.page.click('text=Add Employee'),
            () => this.page.goto('/employees/new'),
            () => {
                this.page.click('.employee-menu');
                this.page.click('text=Add New');
            }
        ];

        for (const path of navigationPaths) {
            try {
                await path();
                await this.page.waitForSelector('.employee-form', { timeout: 5000 });
                return;
            } catch (error) {
                continue;
            }
        }
        
        throw new Error('Could not navigate to add employee page');
    }

    async fillPersonalInfo(personal) {
        const fields = [
            { selector: '#firstName', value: personal.firstName },
            { selector: '#lastName', value: personal.lastName },
            { selector: '#email', value: personal.email },
            { selector: '#phone', value: personal.phone },
            { selector: '#address', value: personal.address }
        ];

        for (const field of fields) {
            await this.smartFill(field.selector, field.value);
        }
    }

    async fillEmploymentDetails(employment) {
        // Department dropdown
        await this.selectFromDropdown('#department', employment.department);
        
        // Job title
        await this.smartFill('#jobTitle', employment.jobTitle);
        
        // Start date with date picker handling
        await this.handleDatePicker('#startDate', employment.startDate);
        
        // Employment type
        await this.selectFromDropdown('#employmentType', employment.type);
        
        // Manager selection
        await this.selectManager(employment.managerId);
    }

    async setupPayroll(payroll) {
        // Salary information
        await this.smartFill('#salary', payroll.salary);
        
        // Pay frequency
        await this.selectFromDropdown('#payFrequency', payroll.frequency);
        
        // Tax information
        await this.configureTaxes(payroll.taxes);
        
        // Direct deposit setup
        if (payroll.directDeposit) {
            await this.setupDirectDeposit(payroll.directDeposit);
        }
    }

    async smartFill(selector, value) {
        if (!value) return;
        
        // Wait for field to be available
        await this.page.waitForSelector(selector, { state: 'visible' });
        
        // Clear existing content
        await this.page.fill(selector, '');
        
        // Type new value with realistic typing speed
        await this.page.type(selector, value, { delay: 50 });
        
        // Verify the value was entered correctly
        const actualValue = await this.page.inputValue(selector);
        if (actualValue !== value) {
            throw new Error(`Field ${selector} value mismatch. Expected: ${value}, Got: ${actualValue}`);
        }
    }

    async takeErrorScreenshot(employeeName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `error-${employeeName}-${timestamp}.png`;
        await this.page.screenshot({ 
            path: `./screenshots/${filename}`, 
            fullPage: true 
        });
        console.log(`📸 Error screenshot saved: ${filename}`);
    }
}

// Payroll Processing Automation
class PayrollProcessor {
    constructor(page) {
        this.page = page;
    }

    async processPayroll(payPeriod) {
        console.log(`🔄 Processing payroll for ${payPeriod}`);
        
        try {
            // Navigate to payroll section
            await this.navigateToPayroll();
            
            // Select pay period
            await this.selectPayPeriod(payPeriod);
            
            // Review employee hours
            await this.reviewEmployeeHours();
            
            // Calculate payroll
            await this.calculatePayroll();
            
            // Review calculations
            await this.reviewCalculations();
            
            // Submit for approval
            await this.submitForApproval();
            
            console.log('✅ Payroll processing completed successfully');
            
        } catch (error) {
            console.error('❌ Payroll processing failed:', error.message);
            throw error;
        }
    }

    async reviewEmployeeHours() {
        // Get all employee rows
        const employeeRows = await this.page.locator('.employee-hours-row');
        const count = await employeeRows.count();
        
        console.log(`📊 Reviewing hours for ${count} employees`);
        
        for (let i = 0; i < count; i++) {
            const row = employeeRows.nth(i);
            
            // Get employee name
            const name = await row.locator('.employee-name').textContent();
            
            // Get hours worked
            const hours = await row.locator('.hours-input').inputValue();
            
            // Validate hours (0-80 range for bi-weekly)
            const hoursNum = parseFloat(hours);
            if (hoursNum < 0 || hoursNum > 80) {
                console.warn(`⚠️  ${name}: Unusual hours (${hours})`);
                
                // Flag for manual review
                await row.locator('.flag-for-review').check();
            }
            
            console.log(`✓ ${name}: ${hours} hours`);
        }
    }
}

module.exports = {
    ADPLoginAutomation,
    EmployeeOnboardingBot,
    PayrollProcessor
};