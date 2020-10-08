let page: import("playwright").Page;
let browser: any;
import { chromium } from "playwright";
export const informe = async () => {
  browser = await chromium.launch();
  page = await browser.newPage();

  await page
    .goto("https://claropaymovil.vercel.app", {
      waitUntil: "networkidle",
    })
    // tslint:disable-next-line:no-empty
    .catch(() => {});
  const casosTotal = await page.textContent(
    "#content > div > div.app__content > div > div:nth-child(1) > div:nth-child(1) > div.widget__body > div > div > div:nth-child(1) > div > div.splash__title"
  );
  await page.click(
    "#content > div > div.app__content > div > div:nth-child(1) > div:nth-child(2) > div.widget__body > div > div > a:nth-child(11) > div"
  );
  await page.waitForSelector(
    "#content > div > div.app__content > div > div.side-by-side__left > div > div.tree__content > div > div"
  );
  const suites = await page.innerText(
    "#content > div > div.app__content > div > div.side-by-side__left > div > div.tree__content > div > div"
  );
  ('//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[1]');
  ('//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[2]');
  console.log(casosTotal);
  console.log(suites);
  await page.close();
  await browser.close();
};
informe();
