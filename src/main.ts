import * as fs from 'fs';


import { AzureStorageProcessor, AzureImageAnalyzer, GoogleImageAnalyzer } from './modules';
import { AnalysisService, ParseCsv } from './services';

process.env.GOOGLE_APPLICATION_CREDENTIALS = '.local/google-credentials.json';


const settings = JSON.parse(fs.readFileSync('.local/settings.json').toString());

const azureStorageProcessor: AzureStorageProcessor = new AzureStorageProcessor(settings.azure_storage);
const azureImageAnalyzer: AzureImageAnalyzer = new AzureImageAnalyzer(settings.azure_vision);
const googleImageAnalyzer: GoogleImageAnalyzer = new GoogleImageAnalyzer();

const service = new AnalysisService(azureStorageProcessor, azureImageAnalyzer, googleImageAnalyzer);
service.doWork().then(document => {
    console.log('Finished creation document!');

    const parse = new ParseCsv('output');
    parse.do(document).then(() => {
        console.info('Transformed to CSV!');
    });
});