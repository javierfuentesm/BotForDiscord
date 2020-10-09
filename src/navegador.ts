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

  const casos = [];
  for (let i = 1; i < 17; i++) {
    let caso = {};

    // @ts-ignore
    caso.nombre = await page.innerText(
      `//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[${i}]/div[1]/div[1]`
    );

    let statusesHtml = await page.innerHTML(
      `//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[${i}]/div[1]/span[2]`
    );

    let statuses = await (
      await page.innerText(
        `//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[${i}]/div[1]/span[2]`
      )
    ).split("");

    if (statuses.length > 2) {
      // @ts-ignore
      caso.error = await page.innerText(
        `//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[${i}]/div[1]/span[2]/span[1]`
      );
      // @ts-ignore
      caso.exito = await page.innerText(
        `//*[@id="content"]/div/div[2]/div/div[1]/div/div[3]/div/div/div[${i}]/div[1]/span[2]/span[2]`
      );
    } else {
      if (statusesHtml.includes("status_failed")) {
        // @ts-ignore
        caso.error = statuses[0];
      } else {
        // @ts-ignore
        caso.exito = statuses[0];
      }
    }

    casos.push(caso);
  }

  await page.close();
  await browser.close();
  return [casos, casosTotal];
};
