## Lesson: Automating ADP Onboarding with Playwright

**Learning Objective:** Master the fundamentals of using Playwright to automate tasks within ADP's Onboarding flow.

**Real-World Scenario:**

Imagine you're automating the onboarding process for a new employee. Your script needs to:

1. Navigate to ADP Onboarding, log in with the employee's credentials.
2. Fill out the personal information section, extracting data from a CSV file containing employee details.
3. Select the appropriate employment benefits.
4. Review and submit the completed onboarding form.

**Code Implementation:**

```javascript
const { chromium } = require('playwright');
const fs = require('fs');

async function automateOnboarding(userData) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to ADP Onboarding
  await page.goto('https://www.adp.com/onboarding'); 

  // Login with credentials
  await page.type('#username', userData.username);
  await page.type('#password', userData.password);
  await page.click('#loginButton');

  // Access and fill Personal Information section
  await page.waitForSelector('h2:contains("Personal Information")');
  const personalInfoForm = page.locator('form[data-testid="personal-info-form"]');
  await personalInfoForm.locator('input[name="firstName"]').fill(userData.firstName);
  await personalInfoForm.locator('input[name="lastName"]').fill(userData.lastName);
  // ... Fill other fields similarly

  // Select Benefits
  const benefitSection = await page.waitForXPath('//div[contains(@class, "benefits")]');
  await benefitSection.click('button:contains("Life Insurance")'); // Example benefit selection

  // Review and submit
  await page.waitForSelector('button:contains("Submit")');
  await page.click('button:contains("Submit")');

  await browser.close();
}

// Example usage with data from a CSV file
const userData = JSON.parse(fs.readFileSync('employee_data.json')); // Adjust file reading as needed
automateOnboarding(userData);
```


**Step-by-Step Execution:**

1. **Install Playwright:** `npm install playwright`
2. **Replace placeholders:** Update `userData`, URLs, and element locators with your specific ADP Onboarding environment.
3. **Run the script:** `node automateOnboarding.js`

**Pro Tips:**

* **Shadow DOM Handling:** ADP, like many modern web applications, utilizes Shadow DOM.  Use the `page.waitForSelector` method with specific CSS selectors within the Shadow DOM to target elements accurately. 
* **Dynamic Element Locators:** Identify elements using data attributes, class names, and other unique identifiers that are less prone to changes when the application UI updates.  
* **Error Handling:** Implement robust error handling mechanisms to ensure your script gracefully handles unexpected situations, such as login failures or form validation errors.  

**Practice Challenge:**

Automate the process of changing an employee's work address within ADP Onboarding. This will require:

* Identifying the specific section for editing address information.
* Locating the input fields for various address components.
* Handling any potential validation rules or confirmation steps.

**Next Steps:**

*  Explore Playwright's advanced API functionalities like element interactions, multiple browser window handling, and network monitoring.
*  Integrate your automation script into a continuous integration/delivery (CI/CD) pipeline to ensure automated testing and deployment.


