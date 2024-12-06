let path = require('path');
const puppeteer = require('puppeteer');

describe('overlay-name', () => {
  let page, browser; 

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, "/template.html"))
  });

  afterAll(async (done) => {
    await browser.close();
    done();
  });

  test('should test for what the overlay does (add specific test scenario)', async () => {
    await page.waitFor(1 * 1000);
    const pageTitle = await page.evaluate(() => document.title)
    await expect(pageTitle).toBe("Amaze Test");
  });

})