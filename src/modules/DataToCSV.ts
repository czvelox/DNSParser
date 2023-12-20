import fs from "fs";

/** Класс для записи данных в CSV файл. */
export class DataToCSV {

    /**
     * Записывает данные в CSV файл.
     * @param {Array<{ name: string, price: number }>} data - Данные для записи.
     * @param {string} filename - Имя файла для записи (по умолчанию "result").
     */
    public static write(data: { name: string, price: number }[], filename: string = "result") {
        let writer = fs.createWriteStream(`${filename}.csv`)
        writer.write("name,price\n");

        for(const item of data) writer.write(`"${item.name}",${item.price}\n`);
        writer.close();
    }
}