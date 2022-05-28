const puppeteer = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";

const items = [];

const searchItem = (async (request, response) => {

  const { searchBy } = request.body;

  const args = puppeteer.defaultArgs().filter(arg => arg !== '--disable-site-isolation-trials');
  args.push("--disable-site-isolation-trials");
  const browser = await puppeteer.launch({  ignoreDefault: true, args });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector("#cb1-edit");

  await page.type("#cb1-edit", searchBy);

  await Promise.all(
    [
      page.waitForNavigation(),
      page.click(".nav-search-btn")
    ]
  );

  const links = await page.$$eval(".ui-search-result__image > a", (element) => element.map(link => link.href));

  for (const link of links) {
    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title");

    const title = await page.$eval(".ui-pdp-title", element => element.innerText);
    const value = await page.$eval(".andes-money-amount__fraction", element => element.innerText);

    const seller = await page.evaluate(() => {
      const element = document.querySelector(".ui-pdp-seller__link-trigger > a > span");

      if (!element) return "";
      return element.innerText;
    });

    const item = {
      title,
      seller,
      value,
      link
    };

    console.log(item);

    items.push(item);
  }

  await browser.close();

  response.status(200).json(items).send();

  items.length = 0;
});

module.exports = searchItem;