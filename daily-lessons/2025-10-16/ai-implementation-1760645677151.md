##  Automating ADP RUN Onboarding with Playwright

### Learning Objective

Today, we'll learn how to use Playwright to automate the onboarding process within ADP RUN, focusing specifically on repetitive tasks like completing employee information forms. 

### Real-World Scenario

Imagine you have a new hire in ADP RUN.  Instead of manually inputting their information, you want to automate it.  

This could involve:

* Gathering information from a spreadsheet.
* Navigating the ADP RUN onboarding portal.
* Filling in fields like employee name, address, emergency contact, etc.
* Submitting the form.

### Code Implementation

This example focuses on navigating to a sample onboarding page (replace with your actual ADP RUN URL) and filling in a few fields:

```javascript
const {chromium} = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://www.adp.com/onboarding'); // Replace with your actual URL

  const firstNameInput = await page.locator('input[name="firstName"]');
  await firstNameInput.type('John');

  const lastNameInput = await page.locator('input[name="lastName"]');
  await lastNameInput.type('Doe');

  // ... fill other fields similarly

  const submitButton = await page.locator('button[type="submit"]');
  await submitButton.click();

  await browser.close();
}

run();
```

**Explanation**

* **Import Playwright:** We start by importing the required functions from the Playwright library.
* **Launch Browser:** We launch a Chromium browser instance.
* **Navigate to Page:** We use `page.goto()` to navigate to the ADP RUN onboarding page. Remember to replace the placeholder URL with the actual one you are automating.

* **Locate Elements:**  We use Playwright's selector API (`page.locator()`) to find elements on the page.  

* **Interact with Elements:**
    * `firstNameInput.type('John')`: Simulates typing "John" into the FirstName input field.
    * `submitButton.click()`: Simulates a click on the submit button.

* **Close Browser:** We close the browser instance after completing the automation.

### Step-by-Step Execution

1. **Set up Playwright:** Install it globally using `npm install -g playwright`.
2. **Download Playwright Browsers:** Run `npx playwright install`.

3. **Run the Code:** Execute the script using `node automation.js` (replace `automation.js` with your file name).

### 

**Pro Tips**

* **Element Locators:** Employ robust locators, particularly for dynamically generated content.

* **Handle Shadow DOM:**  ADP RUN may use Shadow DOM.  

    ```javascript
    const shadowRoot = await page.locator('[id="shadow-element"]').shadowRoot();
    const inputField = await shadowRoot.locator('input[name="email"]');
    ```



* **Wait for Elements:** Use `await page.waitForSelector()` to ensure elements are loaded before interacting with them.

* **Error Handling:** Implement robust error handling to gracefully handle unexpected scenarios.

### Practice Challenge

1. Modify the code to read information from a CSV file containing new employee details and automate the form filling process.
2. Implement error handling to handle situations where a field is missing or invalid.

### Next Steps

Tomorrow, we'll explore advanced automation techniques within ADP RUN, including:

* **Dealing with Interactive Elements:** Handling dropdowns, checkboxes, and radio buttons.
* **Data Extraction:** Extracting information from ADP RUN pages for reporting.
* **Integrating with APIs:** Combining Playwright with ADP RUN APIs for more powerful automation.



