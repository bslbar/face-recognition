import * as fs from 'fs';
import * as path from 'path';

import { AzureStorageProcessor, AzureImageAnalyzer, GoogleImageAnalyzer } from './modules';
import { AnalysisService, ParseCsv } from './services';

process.env.GOOGLE_APPLICATION_CREDENTIALS = '.local/google-credentials.json';
const AZURE_FILE = 'azure-output.csv';
const GOOGLE_FILE = 'google-output.csv';

const settings = JSON.parse(fs.readFileSync('.local/settings.json').toString());

const azureStorageProcessor: AzureStorageProcessor = new AzureStorageProcessor(settings.azure_storage);
const azureImageAnalyzer: AzureImageAnalyzer = new AzureImageAnalyzer(settings.azure_vision);
const googleImageAnalyzer: GoogleImageAnalyzer = new GoogleImageAnalyzer();

const service = new AnalysisService(azureStorageProcessor, azureImageAnalyzer, googleImageAnalyzer);

fs.renameSync(`${path.join(__dirname, GOOGLE_FILE)}`,`${FOLDER_OUPUT}/${GOOGLE_FILE}`);

service.azureWork().then(document => {
    console.log('Finished creation Azure document!');
    const parse = new ParseCsv(AZURE_FILE);
    parse.do(document).then(() => {
        console.info('Transformed to AZURE-CSV!');
    });
});

service.googleWork().then(document => {
    console.log('Finished creation Google document!');
    const parse = new ParseCsv(GOOGLE_FILE);
    parse.do(document).then(() => {
        console.info('Transformed to GOOGLE-CSV!');
    });
});