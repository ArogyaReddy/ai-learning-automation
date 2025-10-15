## Learning Objective

Today, we'll learn how to automate processes in ADP's platform using JavaScript and Playwright. This will involve navigating to specific pages, filling out forms, and extracting data, ultimately empowering you to automate tasks like employee onboarding, payroll processing, and client management.

## Real-World Scenario

Imagine working for an HR department responsible for onboarding new employees. Manually filling out forms for each new hire can be tedious and error-prone. We can use Playwright to automate this process, saving time and ensuring accuracy.

## Code Implementation

```javascript
const { chromium } = require('playwright');

async function automateOnboarding(username, password, employeeData) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to ADP login page
  await page.goto('https://www.adp.com/login'); 

  // Fill in login credentials
  await page.type('#username', username);
  await page.type('#password', password);
  await page.click('button[type="submit"]');

  // Wait for dashboard to load (adjust delay if needed)
  await page.waitForLoadState('networkidle');

  // Navigate to onboarding page
  await page.goto('https://www.adp.com/onboarding'); // Replace with actual URL

  // Fill in employee data
  await page.type('#firstName', employeeData.firstName);
  await page.type('#lastName', employeeData.lastName);
  // ... fill in other fields

  // Submit onboarding form
  await page.click('button[type="submit"]');

  // Extract confirmation message (optional)
  const confirmationMessage = await page.textContent('body');
  console.log('Confirmation Message:', confirmationMessage);

  await browser.close();
}

// Example usage
automateOnboarding('your_username', 'your_password', {
  firstName: 'John',
  lastName: 'Doe',
  // ...other employee data
});
```

## Step-by-Step Execution

1. **Install Playwright:** `npm install playwright`
2. **Run the code:** `node onboarding.js` (or your filename)
3. **Enter Credentials:** Replace `'your_username'` and `'your_password'` with your actual ADP credentials.
4. **Input Employee Data:** Populate the `employeeData` object with the necessary information for the new hire.
5. **Observe Output:** The script will log the confirmation message (if available) to your console.

## Pro Tips

* **Handle Dynamic Content:** Use Playwright's selectors to target elements dynamically changing positions.
* **Shadow DOM:** Employ `page.querySelectorShadow()`, `page.queryAllSelectorShadow()` for elements within shadow DOM structures.
* **Page.waitForSelector:** Ensure elements are loaded before interacting with them.

## Practice Challenge

Modify the code to extract the employee's ID or any other relevant data after successful onboarding.


## Next Steps

* Explore Playwright's API for additional features like screenshots, video recording, and more.
* Automate more complex tasks within ADP's platform, such as payroll processing or client management.



