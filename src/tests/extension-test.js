const puppeteer = require('puppeteer');

require('dotenv').config();

(async () => {
  console.log("Launching browser...");

  // Define credentials (consider keeping these in environment variables for security)
  const username = process.env.USERNAME1 ;
  const password = process.env.PASSWORD ;
  const pin = process.env.PIN ;

  const extensionPath = process.env.EXTENSION_PATH || './src/extensions/build';

const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    timeout: 120000,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
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
      throw error; 
    }
  };

  // Fill in the login fields
  try {
    await fillInput('#username', username);
    await fillInput('#password2', password);
    await fillInput('#pin2', pin);

    // Click the submit button
    await page.waitForSelector("button[name='submit']", { timeout: 10000 });
    await page.click("button[name='submit']");
    console.log("Clicked the submit button.");

    // Wait for navigation to the next page after submitting the form
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Navigated after clicking submit.");
  } catch (error) {
    console.error("Error filling in the login fields or navigating:", error);
    await browser.close(); 
    process.exit(1); 
  }

  // Generate expected URL for today
  const currentDate = new Date();
  //const expectedUrl = `https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=${currentDate.getFullYear()}&month=${(currentDate.getMonth() + 1).toString().padStart(2, '0')}&day=${currentDate.getDate().toString().padStart(2, '0')}&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1`;
  const expectedUrl ='https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=2024&month=11&day=3&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1'

  try {
    const currentUrl = page.url();
    if (currentUrl === expectedUrl) {
      console.log("Successfully navigated to the expected URL:", currentUrl);
    } else {
      console.error("Failed to navigate to the expected URL. Current URL is:", currentUrl);
      await browser.close(); 
      process.exit(1); 
    }
  } catch (error) {
    console.error("Error retrieving the current URL.", error);
    await browser.close(); 
    process.exit(1); 
  }

  // Check for the presence of the #firstMenu element
  try {
    await page.waitForSelector('#firstMenu', { timeout: 10000 });
    console.log("#firstMenu is present on the page.");

    await page.waitForSelector("a[href='http://www.raceconnect.ca/race-app/']", { timeout: 10000 });
    console.log("a[href='http://www.raceconnect.ca/race-app/'] is present on the page.");

    // Find and click the #openReactApp button
    await page.waitForSelector("#openReactApp", { timeout: 50000 });
    await page.click("#openReactApp");
    console.log("Clicked the #openReactApp button.");

    await page.waitForSelector("svg[width='14']", { timeout: 10000 });
    console.log("svg[width='14'] is present on the page.");
  } catch (error) {
    console.error("#firstMenu or #openReactApp not found within the timeout period.", error);
    await browser.close(); 
    process.exit(1); 
  }

  // Close the browser after testing
  try {
    await browser.close();
    console.log("Browser closed.");
  } catch (error) {
    console.error("Error closing the browser.", error);
    process.exit(1);
  }

  

  console.log("All tests passed successfully!");
  process.exit(0); // Exit successfully if everything went well
})();

