// main.js
require('dotenv').config();
const { launchBrowser, login } = require('./oscarWork.js/login');
const { verifyUrl, interactWithElements } = require('./oscarWork.js/navigation');
const { findAppointment } = require('./oscarWork.js/oscarActions');

(async () => {
  const extensionPath = process.env.EXTENSION_PATH || './src/extensions/build';
  const head= process.env.HEADLESS || 'true';
  const credentials = {
    username: process.env.USERNAME1,
    password: process.env.PASSWORD,
    pin: process.env.PIN,
  };

  const browser = await launchBrowser(extensionPath,head);

  // Attach a global dialog handler for any new pages that open
  browser.on('targetcreated', async target => {
    const newPage = await target.page();
    if (newPage) {
      newPage.on('dialog', async dialog => {
        console.log(`Dialog detected: ${dialog.message()}`);
        if (dialog.message().includes("Do you wish to continue?")) {
          await dialog.accept();
          console.log("Dialog accepted.");
        } else {
          await dialog.dismiss();
          console.log("Dialog dismissed.");
        }
      });
    }
  });

  const page = await browser.newPage();

  try {
    await login(page, credentials);

    const targetDate = new Date(process.env.TARGET_DATE);
    const expectedUrl = `https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=${targetDate.getFullYear()}&month=${targetDate.getMonth() + 1}&day=${targetDate.getDate()}&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1`;

    await verifyUrl(page, expectedUrl);
    await interactWithElements(page);

    console.log("Extension is available");

    await findAppointment(page);
    console.log("All tests passed successfully!");
  } catch (error) {
    console.error("An error occurred during test execution:", error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
