import * as fs from "fs";

import { json2csvAsync } from "json-2-csv";

export class ParseCsv {
  private _nameDocument: string;

  constructor(nameDocument: string) {
    this._nameDocument = nameDocument;
  }

  public async do(document: any) {
    json2csvAsync(document, {
      emptyFieldValue: []
    })
      .then((csv: any) => fs.writeFileSync(`${this._nameDocument}.csv`, csv))
      .catch((err: any) => console.log("ERROR: " + err.message));
  }
}
