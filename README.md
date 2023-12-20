# Парсер DNS
Приложение, позволяющее получить товары категории по ссылке в формате CSV. После выполнения Вы получите файл result.csv, в котором будут спарсены все товары категории в формате ```name,price```

## Сборка проекта
Проект написан на TypeScript и для его сборки необходимо вызвать следующий скрипт:
```shell
npm run build
```
После выполнения у Вас будут скачены необходимые пакеты и собран проект.

## Использование в терминале 
Для использования парсера в терминале достаточно ввести следующее:
```shell
npm start <url>
```
По умолчанию указан URL категории с холодильниками, но вы можете указать свое.

## Использование в проекте
Чтобы воспользоваться парсером в своем проекте, Вам необходимо импортировать модуль PuppeteerParser
```typescript
import { PuppeteerParser } from ".";
PuppeteerParser.init();

new PuppeteerParser("URL").scrapeData().then(console.log);
```
При выполнении данного кода Вы получите результат в формате JSON в консоле, содержащий названия и цену товаров

### Модуль `DataToCSV`
Данный модуль предназначен для записи результатов из модуля `PuppeteerParser` в CSV-файл.
```typescript
import { PuppeteerParser, DataToCSV } from ".";
PuppeteerParser.init();

new PuppeteerParser("URL").scrapeData().then(data => DataToCSV.write(data, "filename"));
```