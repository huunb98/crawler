import fs from "fs";
const converter = require("json-2-csv");

export class FileIO {
  private readonly fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }
  private currentFolder: string = "./logs/";

  private enableWriteFile: boolean = true;

  writeFile(type: string, data: any) {
    if (!this.enableWriteFile) return;

    if (type != "csv") data = JSON.stringify(data);

    fs.writeFile(this.currentFolder + this.fileName  + "." + type, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }

  writeCSV(data: Object[]) {
    if (!this.enableWriteFile) return;
console.log('writing file csv')
    try {
      converter.json2csv(data, (err: any, result: any) => {
        if (err) throw err;
        fs.writeFile(this.currentFolder + `${this.fileName}.csv`, result, "utf8", function (err: any) {
          if (err) {
            console.log("Some error occured - file either not saved or corrupted file saved.");
          } else {
            console.log("Data is saved!");
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
