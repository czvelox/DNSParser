import { Browser, HTTPRequest } from "puppeteer";
import puppeteer from "puppeteer-extra";

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

import whitelist from "../assets/whitelist.json";

/** Класс, обрабатывающий парсинг с использованием Puppeteer. */
export class PuppeteerParser {
    /** Экземпляр браузера Puppeteer. */
    public static browser: Browser;

    /**
     * Конструктор объекта PuppeteerParser.
     * @param {string} url - URL для парсинга.
     */
    constructor(public url: string) {}

    /** Инициализация браузера Puppeteer. */
    public static async init() {
        this.browser = await puppeteer.launch({ headless: true });
    }

    /** Закрытие браузера Puppeteer. */
    public static close() {
        this.browser.close()
    }

    /**
     * Обработчик запросов страницы.
     * @param {HTTPRequest} req - HTTP запрос.
     * @private
     */
    private static onRequestPage(req: HTTPRequest) {
        const filename = req.url().split("/").pop();

        if(filename && whitelist.includes(filename)) return req.continue();
        else if(["image", "stylesheet", "media"].includes(req.resourceType())) return req.abort();
        
        req.continue();
    }

    /**
     * Загрузка страницы.
     * @param {string} url - URL для загрузки.
     * @returns {Promise<puppeteer.Page>}
     * @private
     */
    private async loadPage(url: string = this.url) {
        if (!PuppeteerParser.browser) throw new Error('Browser not initialized. Call initialize() first.');

        const page = await PuppeteerParser.browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", PuppeteerParser.onRequestPage);

        page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector('.catalog-product .product-buy__price');

        return page;
    }


    /**
     * Извлечение данных со страницы.
     * @returns {Promise<{ name: string, price: number }[]>} - Извлеченные продукты.
     */
    public async scrapeData() {
        let page = await this.loadPage();
        const pagesCounter = Number(await page.$eval(".pagination-widget__pages", (el) => el.children[el.children.length-1].getAttribute("data-page-number")));

        const url = page.url(), products = [];
        for(let i = 2; i < pagesCounter+1; i++) {
            products.push(...await page.evaluate(() => {
                const productList: { name: string, price: number }[] = [];
                const items = document.querySelectorAll('.catalog-product');
            
                items.forEach((item) => {
                    const name = item.querySelector(".catalog-product__name")?.textContent;
                    const price = Number(item.querySelector(".product-buy__price")?.textContent?.replace(/[^\d]/g, ""));
            
                    if (name && price)
                        productList.push({ name, price });
                });
        
                return productList;
            }));

            await page.close();
            page = await this.loadPage(url + `?p=${i}`);
        }
    
        page.close();
        return products;
    }
}