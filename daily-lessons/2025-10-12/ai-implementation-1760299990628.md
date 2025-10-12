

## Automation Lesson: Handling Dynamic Content in ADP RUN

**Learning Objective:** Master the art of handling dynamic content, including shadow-DOM, in ADP RUN automation scenarios using Playwright and TypeScript

**Real-World Scenario:** Imagine you need to automate the verification of employee onboarding details on ADP RUN Onboarding. The system dynamically populates certain fields based on user input and API calls, making it challenging to locate elements with static locators.

**Code Implementation:**

```typescript
import { chromium } from 'playwright';

async function verifyOnboardingDetails() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.adp.com/run-onboarding'); // Replace with actual URL

  // Wait for the dynamic element to be loaded
  await page.waitForSelector('//div[@data-testid="onboarding-details"]', { state: 'visible' });

  // Extract and verify employee name using shadow-DOM traversal
  const employeeNameElement = await page.evaluate(() => {
    const shadowRoot = document.querySelector('div[data-testid="onboarding-details"]')?.shadowRoot;
    if (shadowRoot) {
      return shadowRoot.querySelector('h2.employee-name').textContent;
    }
    return null;
  });

  console.log(`Employee Name: ${employeeNameElement}`);
  await browser.close();
}

verifyOnboardingDetails();
```

**Step-by-Step Execution:**

1. Ensure you have Playwright installed: `npm install playwright`.
2. Replace `https://www.adp.com/run-onboarding` with the actual URL of your ADP RUN Onboarding page.
3. Run the script: `node index.js` (assuming you saved the code as `index.js`).
4. Observe Playwright launch the browser, navigate to the page, and log the employee name.

**Pro Tips:**

* **Data-testid Selectors:** Explore using data-testid attributes in your ARDP applications for more reliable and maintainable locators as they are often scoped to individual components.

* **Mocking APIs:** For complex onboarding scenarios involving API calls, consider using Playwright's `requestInterception` feature to mock API responses and simulate various data scenarios.
* **Shadow-DOM Exploration:** Use `console.dir` in your browser's developer tools to inspect the structure of shadow-DOM elements within the ADP RUN app.

 **Practice Challenge:**

*  Automate the process of entering employee details into ADP RUN Onboarding. Use dynamic locators to handle varying input field placements and handle potential validation errors.


**Next Steps:**

In the next lesson, we'll delve into handling complex form submissions in ADP RUN Payroll, incorporating techniques for:

*  Dynamically checking and unchecking radio buttons and checkboxes based on conditions.
*  Upgrading to TypeScript for enhanced type safety and code maintainability. 
*  Integrating Error Handling and Reporting to handle unexpected scenarios.



