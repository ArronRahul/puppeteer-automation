const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
  console.log("Launching browser...");

  // Define credentials (consider keeping these in environment variables for security)
  const username = process.env.USERNAME1 || 'Support';
  const password = process.env.PASSWORD || 'Quip0he@lth2022';
  const pin = process.env.PIN || '9007';

  const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    timeout: 120000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions-except=./src/extensions/build', // Relative path for disabling extensions
      '--load-extension=./src/extensions/build' // Relative path for loading the extension
    ]
  });

  const page = await browser.newPage();
  console.log("Navigating to the login URL...");

  // Navigate to the login URL
  await page.goto('https://oscaremr.quipohealth.com/oscar/index.jsp', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log("Target URL loaded. Waiting for the input fields...");

  // Helper function to fill input fields
  const fillInput = async (selector, value) => {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      await page.type(selector, value);
      console.log(`Typed '${value}' into the field: ${selector}`);
    } catch (error) {
      console.error(`Field ${selector} not found within the timeout period.`, error);
    }
  };

  // Fill in the login fields
  await fillInput('#username', username);
  await fillInput('#password2', password);
  await fillInput('#pin2', pin);

  // Click the submit button
  try {
    await page.waitForSelector("button[name='submit']", { timeout: 10000 });
    await page.click("button[name='submit']");
    console.log("Clicked the submit button.");

    // Wait for navigation to the next page after submitting the form
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Navigated after clicking submit.");
  } catch (error) {
    console.error("Submit button not found or navigation failed within the timeout period.", error);
  }

  // Generate expected URL for today
  const currentDate = new Date();
  const expectedUrl = `https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=${currentDate.getFullYear()}&month=${(currentDate.getMonth() + 1).toString().padStart(2, '0')}&day=${currentDate.getDate().toString().padStart(2, '0')}&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1`;

  // Verify the current URL
  try {
    const currentUrl = page.url();
    if (currentUrl === expectedUrl) {
      console.log("Successfully navigated to the expected URL:", currentUrl);
    } else {
      console.error("Failed to navigate to the expected URL. Current URL is:", currentUrl);
    }
  } catch (error) {
    console.error("Error retrieving the current URL.", error);
  }

  // Check for the presence of the #firstMenu element
  try {
    await page.waitForSelector('#firstMenu', { timeout: 10000 });
    console.log("#firstMenu is present on the page.");

    await page.waitForSelector("a[href='http://www.raceconnect.ca/race-app/']", { timeout: 10000 });
    console.log("a[href='http://www.raceconnect.ca/race-app/'] is present on the page.");

    // Find and click the #openReactApp button
    await page.waitForSelector("#openReactApp1", { timeout: 50000 });
    await page.click("#openReactApp1");  // Fixed button ID
    console.log("Clicked the #openReactApp1 button.");

    await page.waitForSelector("svg[width='14']", { timeout: 10000 });
    console.log("svg[width='14'] is present on the page.");
  } catch (error) {
    console.error("#firstMenu or #openReactApp1 not found within the timeout period.", error);
  }

  // Close the browser after testing
  try {
    await browser.close();
    console.log("Browser closed.");
  } catch (error) {
    console.error("Error closing the browser.", error);
  }
})();
