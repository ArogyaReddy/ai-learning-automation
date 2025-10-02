

## Lesson: Automating ADP Onboarding with Playwright

**Learning Objective:**  Today, you'll learn to automate the employee onboarding process within ADP using Playwright, focusing on navigating the onboarding portal, filling out forms, and verifying successful completion.

**Real-World Scenario:** Imagine you're automating the process of creating a new employee account in ADP. This involves: 

* Logging into the ADP Onboarding portal.
* Selecting the "New Hire" option.
* Filling in the employee's personal information (name, address, contact details).
* Uploading required documents (resume, tax forms).
* Verifying successful onboarding confirmation.
* Potentially handling dynamic content and shadow DOM elements specific to ADP's interface.

**Code Implementation (JavaScript with Playwright):**

```javascript
const { chromium } = require('playwright');

async function automateADPOnboarding() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to ADP Onboarding portal 
  await page.goto('https://www.adp.com/onboarding');

  // Fill in login credentials
  await page.fill('input[name="username"]', 'your_username');
  await page.fill('input[name="password"]', 'your_password');
  await page.click('button[type="submit"]');

  // Select "New Hire" option
  await page.click('a[href="#new-hire"]'); 

  // Locate and fill employee information fields
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  // ... fill in other fields

  // Handle file upload (example)
  await page.setInputFiles('input[type="file"]', ['resume.pdf']);

  // Locate and click on submit button
  await page.click('button[type="submit"]');

  // Verify onboarding confirmation
  const confirmationMessage = await page.innerText('h1');
  console.log('Onboarding Confirmation:', confirmationMessage);

  await browser.close();
}

automateADPOnboarding();
```

**Step-by-Step Execution:**

1. **Install Playwright:** `npm install playwright`
2. **Obtain ADP Credentials:** You'll need valid login credentials for the ADP Onboarding portal.
3. **Modify Code:** Fill in your credentials and adapt the selectors to match the specific ADP Onboarding interface.
4. **Run the Script:** Execute the `node your_script_name.js` command in your terminal.

**Pro Tips:**

* **Dynamic Content:**  If ADP uses dynamic content loading, implement waits like `await page.waitForSelector()` to ensure elements are loaded before interacting with them.
* **Shadow DOM:** Use `::shadow` and `// *` selectors to target elements within shadow DOMs. Playwright provides excellent documentation on navigating shadow DOM.
* **Playwright API:**

 Explore the comprehensive Playwright API documentation for advanced features like screenshots, video recording, and network traffic inspection.


**Practice Challenge:**

1. **Automating Document Upload:** Implement code to automatically upload multiple documents (e.g., tax forms) to the onboarding portal.

**Next Steps:**

* **Error Handling:** Add robust error handling to gracefully handle unexpected scenarios (e.g., login failures, form validation errors).
* **Data-Driven Testing:** Use fixtures or data files to automate testing with various employee data sets.
* **Integration with CI/CD:** Integrate your Playwright tests into your continuous integration/continuous delivery pipeline for automated and frequent testing.



Let me know if you have any other questions or want to explore specific aspects of ADP automation in detail.