

## Lesson 1: Automating ADP Onboarding with Playwright

**1. Learning Objective**: Successfully automate basic employee onboarding tasks within ADP Onboarding using Playwright, including navigating the interface, filling out forms, and interacting with dynamic elements.

**2. Real-World Scenario**: Imagine you're tasked with automating the onboarding process for new hires at a company. This involves creating new user accounts, filling out personal information, uploading documents, and completing mandatory training modules within ADP Onboarding. Currently, this is a manual task, time-consuming and prone to errors. Automation can significantly streamline this process, saving time and improving accuracy.

**3. Code Implementation**:

```javascript
const { chromium } = require('playwright');

async function automateOnboarding() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to ADP Onboarding
  await page.goto('https://www.adp.com/onboarding');

  // Input username and password
  await page.fill('input[name="username"]', 'your_username');
  await page.fill('input[name="password"]', 'your_password');

  // Submit login form
  await page.click('button[type="submit"]');

  // Locate and fill out the new hire form fields
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="email"]', 'john.doe@example.com');

  // ... other form fields

  // Handle dynamic elements, if needed
  const documentUploadInput = await page.$('input[type="file"]');
  await documentUploadInput.uploadFile('path/to/document.pdf');

  // Click submit button
  await page.click('button[type="submit"]');

  // ... additional actions like navigating to training modules

  await browser.close();
}

automateOnboarding();
```

**4. Step-by-Step Execution**:

1. **Install Playwright:** `npm install playwright`
2. **Install any necessary dependencies:** (e.g., `pdf-parse` if uploading PDF documents).
3. **Replace placeholders:** Update `your_username`, `your_password`, and `path/to/document.pdf` with your actual credentials and document path.
4. **Run the script:** `node your_script_name.js`

**5. Pro Tips**:

* **Handle dynamic element selection:** Utilize Playwright's selectors (e.g., `page.$eval`, `page.$$eval`) to target elements based on content, attributes, and even CSS variables.
* **Use async/await for asynchronous operations:** Ensure your code is asynchronous-friendly for smooth interactions with the web page.
* **Manage session persistence:** Implement strategies like cookies and OAuth for long-running tasks or sessions across multiple pages.
* **Leverage browser context switching:** Use different browser contexts for simulating different users or environments.

**6. Practice Challenge**:

* Automate the process of updating employee information (e.g., address, phone number) within ADP Onboarding.
* Create a script to download relevant reports from ADP Onboarding and save them to a specific directory.

**7. Next Steps**:

* Explore advanced Playwright features like screenshots, video recording, and network interception.
* Learn to work with shadow DOM and handle complex forms effectively.
* Integrate Playwright with a CI/CD pipeline to automate regular testing and deployment of ADP Onboarding solutions.


Remember, automation is a powerful tool that can significantly improve efficiency and accuracy in payroll and HR processes. Continuously explore Playwright's capabilities and experiment with real-world scenarios to optimize your automation workflows.