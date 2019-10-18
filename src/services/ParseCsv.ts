import * as fs from 'fs';
import { json2csvAsync } from 'json-2-csv';

export class ParseCsv {

    private _nameDocument: string;

    constructor(private nameDocument: string) {
        this._nameDocument = nameDocument;
    }

    async do(document: any) {
        json2csvAsync(document)
            .then((csv: any) => fs.writeFileSync(`${this._nameDocument}.csv`, csv))
            .catch((err: any) => console.log('ERROR: ' + err.message));
    }
    
}
