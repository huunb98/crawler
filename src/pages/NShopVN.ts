import puppeteer, { Product } from "puppeteer";

import { setTimeout as delay } from "timers/promises";
import { FileIO } from "../utils/FileIO";

export default async function Crawler(url: string = 'https://nshopvn.com/') {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
  
    /**
     * For handle lazy loading
     */
    const bodyHandle = await page.$("body");
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    let viewportIncr = 0;
    console.log("Handling viewport...");
    const viewportHeight = page.viewport().height;
    while (viewportIncr + viewportHeight < height) {
      await page.evaluate((_viewportHeight) => {
        window.scrollBy(0, _viewportHeight);
      }, viewportHeight);
      await delay(150);
      viewportIncr = viewportIncr + viewportHeight;
    }
    console.log("Handling Scroll operations");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  
    /**
     * Extract data after loading
     */
  
    const products = await page.evaluate(() => {
      const textsToReturn = [];
  
      const elements = Array.from(
        document.querySelectorAll(
          "section > .product-list > ul > li > a"
        )
      );
  
      for (const el of elements) {
        //@ts-ignore
        textsToReturn.push({
          //@ts-ignore,
          title: el.querySelector(".product-title").innerText,
          //@ts-ignore,
          img: el.querySelector(".image > img").src,
          //@ts-ignore,
          price: el.querySelector(".price").innerText,
        });
      }
  
      // If I'm not mistaken, puppeteer doesn't allow to return complicated data structures, so we'll stringify
      return textsToReturn;
    });
  
    console.log(products);

    new FileIO('NShopProduct').writeCSV(products)
      await browser.close();
};