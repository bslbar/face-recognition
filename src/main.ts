import * as fs from 'fs';


import { AzureStorageProcessor, AzureImageAnalyzer, GoogleImageAnalyzer } from './modules';
import { AnalysisService, ParseCsv } from './services';

process.env.GOOGLE_APPLICATION_CREDENTIALS = '.local/google-credentials.json';


const settings = JSON.parse(fs.readFileSync('.local/settings.json').toString());

const azureStorageProcessor: AzureStorageProcessor = new AzureStorageProcessor(settings.azure_storage);
const azureImageAnalyzer: AzureImageAnalyzer = new AzureImageAnalyzer(settings.azure_vision);
const googleImageAnalyzer: GoogleImageAnalyzer = new GoogleImageAnalyzer();

const service = new AnalysisService(azureStorageProcessor, azureImageAnalyzer, googleImageAnalyzer);

service.azureWork().then(document => {
    console.log('Finished creation Azure document!');
    const parse = new ParseCsv('azure-output');
    parse.do(document).then(() => {
        console.info('Transformed to CSV!');
    });
});

service.googleWork().then(document => {
    console.log('Finished creation Google document!');
    const parse = new ParseCsv('google-output');
    parse.do(document).then(() => {
        console.info('Transformed to CSV!');
    });
});