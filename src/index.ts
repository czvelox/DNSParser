import { PuppeteerParser, DataToCSV } from "./modules/";
PuppeteerParser.init().then(async () => {
    const data = await new PuppeteerParser(process.argv[2] || "https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/").scrapeData()
    PuppeteerParser.close();

    DataToCSV.write(data);
});