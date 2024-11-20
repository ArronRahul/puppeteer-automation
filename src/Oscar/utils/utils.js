// utils.js

async function waitAndType(page, selector, text, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
    await page.type(selector, text);
    console.log(`Typed '${text}' into ${selector}`);
  }

  async function waitAndCheck(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
    console.log(`Element ${selector} is Present `);
  }
  
  async function waitAndClick(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    console.log(`Clicked element: ${selector}`);
  }
  
  async function waitForNavigation(page, options = { waitUntil: 'networkidle2', timeout: 60000 }) {
    await page.waitForNavigation(options);
    console.log("Navigation completed.");
  }
  
  async function navigateToUrl(page, url, options = { waitUntil: 'load', timeout: 60000 }) {
    await page.goto(url, options);
    console.log(`Navigated to URL: ${url}`);
  }

  async function findNearestApptLink(page, selector) {
    return await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found nearest app link for ${selector}`);
        const nearestApptLink = element.closest('.apptLink');
        return nearestApptLink ? nearestApptLink.innerHTML : null;
      }
      return null; 
    }, selector);
  }
  
  module.exports = { waitAndType, waitAndClick, waitForNavigation, navigateToUrl, waitAndCheck,  findNearestApptLink};
  