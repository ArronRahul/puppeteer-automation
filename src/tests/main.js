// main.js
require('dotenv').config();
const { launchBrowser, login } = require('./login');
const { verifyUrl, interactWithElements } = require('./navigation');
const { findAppointment } = require('./oscarActions');

(async () => {
  const extensionPath = process.env.EXTENSION_PATH || './src/extensions/build';
  const credentials = {
    username: process.env.USERNAME1,
    password: process.env.PASSWORD,
    pin: process.env.PIN,
  };

  const browser = await launchBrowser(extensionPath);
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
    console.error("An error occurred:", error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
