##  Playwright for ADP Automation: Navigating Shadow DOM & Employee Onboarding

**Learning Objective:** Master the art of automating ADP RUN Onboarding using Playwright, effectively navigating Shadow DOM structures and handling dynamic elements.

**Real-World Scenario:** Automate the process of creating a new employee profile in ADP RUN Onboarding. This will involve:

*  Locating and inputting employee information (name, email, position, etc.)
*  Selecting benefits packages
*  Uploading documents (resume, ID, etc.)
*  Submitting the completed onboarding form.

**Code Implementation:**

```javascript
const { chromium } = require('playwright');

async function automateOnboarding() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to ADP RUN Onboarding page
  await page.goto('https://your-adp-onboarding-url');

  // Handle Shadow DOM: Accessing elements within a specific shadow root
  await page.waitForSelector('div[role="application"] #employeeIdInput');
  await page.locator('div[role="application"] #employeeIdInput').type('YOUR_EMPLOYEE_ID');

  // Example: Selecting benefits package (adjust selectors as needed)
  const benefitOptions = await page.locator('div[role="application"] #benefitsContainer button');
  await benefitOptions.first().click();

  // Handling dynamic form elements
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');

  // Uploading document (adjust selector and file path as needed)
  await page.locator('input[type="file"]').uploadFile('path/to/resume.pdf');

  // Submitting the form
  await page.locator('button[type="submit"]').click();

  // Further actions after submission (e.g., verification, next steps)
  

  await browser.close();
}

automateOnboarding();
```

**Step-by-Step Execution:**

1.  **Install Necessary Packages:**  `npm install playwright`
2.  **Replace Placeholders:** Update the code with your ADP RUN Onboarding URL, employee ID, file path, etc.
3.  **Run:** Execute the `automateOnboarding()` function using a Node.js environment.

**Pro Tips:**

*   **Shadow DOM Inspection:** Use Playwright's `page.inspect()` or browser's developer tools to identify shadow root elements and their specific selectors.
*   **Dynamic Content Handling:** Employ `waitForSelector` or `waitForXPath` with dynamic locators (e.g., `//*[@id="dynamic-element-"]`) to ensure elements are available before interacting with them.
*   **Element Visibility Checks:** Use `page.locator().isVisible()` to verify that an element is visible before interacting with it, especially for dynamically loaded content.


* **Scroll Handling:** Use `page.locator(...).scrollIntoView()` to ensure elements are within the viewport before interacting.
*   **Custom Wait Strategies:** Develop custom wait strategies using `page.on('dialog', ...)` or `page.waitForFunction()` to handle complex interactions and asynchronous behavior.

**Practice Challenge:**

Modify the code to automate the process of selecting a specific benefits package based on its name. Explore Playwright's API for handling checkboxes and radio buttons within Shadow DOM.

**Next Steps:**

1. **Advanced Navigation:**  Explore ADP RUN's navigation structure.  Automate user login, menu traversal, and switching between different sections (payroll, employees, reports).
2. **Data-Driven Testing:**  

Introduce data-driven testing techniques.  Use a CSV file or JSON object to store employee information and benefits selections, dynamically populating the onboarding form.  

3. **Error Handling & Reporting:** Implement robust error handling mechanisms (e.g., using `try-catch` blocks) and logging to track and report failures.



