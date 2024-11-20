// oscarActions.js
const { waitAndClick, navigateToUrl, waitForNavigation, waitAndCheck, findNearestApptLink } = require('../utils/utils');
const { checkEMR } = require('./enCounter');

async function findAppointment(page) {
  await waitAndCheck(page, '#mygroup_no');
  await page.select('#mygroup_no', '_grp_Knight'); // change the value if the clinic is different
  console.log("Clinic selected successfully");

  await waitForNavigation(page);

  const targetUrl = 'https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=2024&month=11&day=11&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1';
  await navigateToUrl(page, targetUrl);

  await handleActions(page);
}

async function handleActions(page) {
  const selectors = [
    { selector: "img[alt='Video Call Icon']", name: "Voice", action: voiceCallFunction },
    { selector: "img[src='../images/walkin.png']", name: "Walkin", action: walkinFunction },
    { selector: "img[src='https://oscaremr.quipohealth.com/oscar/images/videocall.png']", name: "Video", action: videoFunction }
  ];

   // Extract phone numbers and appointment links
   const result = await page.evaluate(() => {
    // Clean up function to trim and remove unwanted characters
    const cleanText = (text) => text?.replace(/\s*\|\s*$/, '').trim(); // Remove trailing pipe and trim spaces

    // Extract phone numbers
    const numbers = Array.from(document.querySelectorAll('a.walkinButton')).map(element => {
      return cleanText(element?.nextSibling?.textContent);
    }).filter(Boolean);

    // Extract appointment links
    const apptLinks = Array.from(document.querySelectorAll('.apptLink')).map(element => {
      return cleanText(element?.textContent) || null; // Use textContent or fallback to null
    });

    // Pair phone numbers with corresponding appointment links
    return numbers.map((number, index) => ({
      number,
      apptLink: apptLinks[index] || null, // Pair with apptLink or null if not available
    }));
    
  });

  console.log('Result:', result);

  for (const item of selectors) {
    const element = await page.$(item.selector);
    const visible = !!element;
    console.log(`${item.name} element is ${visible ? 'available' : 'not available'} on the page.`);
    if (visible) await item.action(page);
  }
}

async function voiceCallFunction(page, patientName) {
  console.log('Executing voice call action...');
  console.log(`${patientName} is selected for voice call`);
}

async function walkinFunction(page, patientName) {
  console.log('Executing walk-in action...');
  console.log(`${patientName} is selected for voice call`);
}

async function videoFunction(page, patientName) {
  console.log('Executing video call action...');
  console.log(`${patientName} is selected for voice call`);
}

module.exports = { findAppointment };
