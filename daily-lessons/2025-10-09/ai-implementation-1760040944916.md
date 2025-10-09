## Playwright Lesson: Automating ADP Onboarding Flow

###  1. Learning Objective:

Master using Playwright and TypeScript to automate the ADP Onboarding flow for new employees, focusing on navigating the application, filling out forms, and submitting the onboarding package.

### 2. Real-World Scenario:

You need to automate the onboarding process for new hires at your company. This involves creating a Playwright script that: 

* **Logs into the ADP RUN Onboarding platform.**
* **Fills out the employee's personal information form.**
* **Navigates to the payroll information section and enters tax details.**
* **Submits the completed onboarding package.**

### 3. Code Implementation:

```typescript
import { test, expect } from '@playwright/test';

async function run() {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://<your-adp-onboarding-url>'); // Replace with actual URL

    // Login 
    await page.fill('#username', 'your_username');
    await page.fill('#password', 'your_password');
    await page.click('button:text("Login")');

    // Navigate to Onboarding
    await page.waitForNavigation(); // Wait for navigation to complete
    await page.click('a:text("Onboarding")');

    // Fill out employee information form
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    // ... fill other form fields ...

    // Navigate to Payroll section
    await page.waitForSelector('#payrollTab');
    await page.click('#payrollTab');

    // Fill out payroll information
    await page.fill('#taxFilingStatus', 'married');
    await page.fill('#w4Deductions', 'standard');
    // ... fill other payroll fields ...

    // Submit Onboarding Package
    await page.click('button:text("Submit")');

    // Verify completion
    await expect(page.textContent('#confirmationMessage')).toContain('Successfully submitted!');

    await browser.close();
}

test.describe('ADP Onboarding Automation', () => {
    run();
});


```

### 4. Step-by-Step Execution:

1. **Install Dependencies:** Make sure you have Playwright installed:  `npm install --save playwright`
2. **Replace Placeholders:** Update the code with your actual ADP URL, login credentials, and form field IDs.
3. **Run the Test:** Execute the `test` command in your terminal (e.g., `npx playwright test`).

### 5. Pro Tips:

* **Shadow DOM Handling:** Use Playwright's `page.evaluate()` to interact with elements within the shadow DOM. 
* **Selectors:** Employ robust selectors (e.g., XPath, CSS with descendant combinators) to ensure consistent targeting even with dynamic website structures.
* **Delay/Polling:** Implement waits and polling techniques to account for  asynchronous operations and prevent timing issues.
* **Test Assertions:** Use Playwright's assertion library (`expect`) to validate successful completion and expected outcomes. 
* **Page Context:** Utilize Playwright's context switching (`page.context()`) to manage multiple browser windows/tabs for scenarios requiring complex interactions.

### 6. Practice Challenge:

Modify the script to:

* **Upload an employee document (e.g., I-9 form) using JavaScript code.**
* **Handle potential error messages and logs the error details.**

### 7. Next Steps:

* Explore advanced features like waiting for specific conditions, handling JavaScript alerts, and utilizing Playwright's built-in API for web scraping.
* Learn about mocking backend services to isolate frontend automation and speed up testing.
* Integrate Playwright with CI/CD pipelines for automated testing of onboarding flows. 

Remember, continuous learning and practice are key to mastering automation with Playwright. 


