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


  async function waitAndCheckInnerHtml(page, selector, expectedValue, timeout = 10000) {
    try {
      await waitAndCheck(page, selector)
  
      // Retrieve and compare the innerHTML of the element
      const isMatching = await page.evaluate((sel, expected) => {
        const element = document.querySelector(sel);
        if (!element) return false; // Element not found
        return element.innerHTML.trim() === expected; // Compare innerHTML
      }, selector, expectedValue);
  
      if (isMatching) {
        console.log(`Element ${selector} innerHTML matches the ${expectedValue} value.`);
        return true;
      } else {
        console.log(`Element ${selector} innerHTML does not match the ${expectedValue} value.`);
        return false;
      }
    } catch (error) {
      console.error(`Error: Element ${selector} not found within ${timeout}ms or comparison failed.`, error);
      return false;
    }
  }
  
  
  module.exports = { waitAndType, waitAndClick, waitForNavigation, navigateToUrl, waitAndCheck, waitAndCheckInnerHtml};
  