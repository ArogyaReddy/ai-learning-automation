## Playwright Automation for ADP Onboarding

This lesson will guide you through automating a specific user interaction within the ADP Onboarding system using Playwright, focusing on scenarios relevant to employee data input.

**1. Learning Objective**: 

By the end of this lesson, you will be able to:

*  Understand how to navigate complex web pages within ADP Onboarding, specifically ADP RUN Onboarding.
*  Identify and interact with elements within ADP Onboarding's microstructure using Playwright.
*  Handle shadow DOM structures encountered in modern web applications.
*  Implement a scenario for automating employee information input during the ADP Onboarding process.

**2. Real-World Scenario**:

Imagine you need to automate the onboarding process for new employees. Let's programmatically fill in essential details like name, address, and contact information within the ADP RUN Onboarding platform. This will save time and ensure consistent data entry.

**3. Code Implementation**:

```javascript
const { chromium } = require('playwright');

async function automateOnboarding() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://run.adp.com/onboarding'); // Replace with actual URL

  // Input Name
  await page.locator('input[name="firstName"]').fill('John');
  await page.locator('input[name="lastName"]').fill('Doe');

  // Navigate to Address section (Shadow DOM)
  const addressSection = await page.$(
    `//shadow-root[@id="onboarding-form"] //div[contains(@class, "address")]`
  );
  await addressSection.waitForExist();

  // Input Address Details
  await addressSection.locator('input[name="streetAddress"]').fill('123 Main St');
  await addressSection.locator('input[name="city"]').fill('Anytown');

  // ... (Code for filling in other fields like State, Zip, Phone, etc.)

  // Submit the Onboarding Form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  await browser.close();
}

automateOnboarding();
```

**4. Step-by-Step Execution**:

1. **Install Playwright**: 
   ```bash
   npm install playwright
   ```

2. **Run the code**: 
   ```bash
   node automateOnboarding.js
   ```

3. **Monitor the Browser**: Watch as Playwright opens a browser window and interacts with the ADP Onboarding site, filling in the specified fields.

**5. Pro Tips**:

* **Leverage Playwright's selectors**: Utilize the comprehensive selectors provided by Playwright (locator, expect, etc.) to accurately target elements within complex web structures.
* **Combine selectors**: Combine multiple selectors to isolate specific elements. For example, use `class`, `id`, and `attribute` selectors together for precise targeting.
* **Handle dynamic content**: Use Playwright's API effectively to handle dynamic content modifications, including waiting for elements to load (`waitForExist()`) or checking for specific conditions (`page.expect()`).
* **Data-driven testing**:  Implement data-driven testing by reading employee information from a file and dynamically populating the fields, allowing you to automate onboarding for multiple employees efficiently.

**6. Practice Challenge**:

*  Modify the code to handle additional employee details, such as phone number, email address, emergency contact information, etc.
*  Implement functionality to select dropdown values, like employment type or tax withholding status, within the ADP Onboarding page.
*  Add error handling to gracefully manage scenarios where input fields may be empty or validation fails.

**7. Next Steps**:

* **Document Your Code**: Comment your code thoroughly to ensure readability and maintainability.
* **Version Control**: Utilize a version control system like Git to track changes and collaborate effectively.
* **Integration with CI/CD**:  
   Integrate your Playwright tests into a continuous integration and continuous delivery pipeline for automated testing and deployment.
* **Explore Advanced Playwright Features**:  Explore features like debugging, network interception, and API mocking to further enhance your testing capabilities.


