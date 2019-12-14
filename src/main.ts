import * as fs from 'fs';

import { AzureStorageProcessor, AzureImageAnalyzer, GoogleImageAnalyzer } from './modules';
import { AnalysisService, ParseCsv } from './services';

process.env.GOOGLE_APPLICATION_CREDENTIALS = '.local/google-credentials.json';

const settings = JSON.parse(fs.readFileSync('.local/settings.json').toString());

const azureStorageProcessor: AzureStorageProcessor = new AzureStorageProcessor(settings.azure_storage);
const azureImageAnalyzer: AzureImageAnalyzer = new AzureImageAnalyzer(settings.azure_vision);
const googleImageAnalyzer: GoogleImageAnalyzer = new GoogleImageAnalyzer();

const service = new AnalysisService(azureStorageProcessor, azureImageAnalyzer, googleImageAnalyzer);

const AZURE_FILE =  `${service.getContainerName(settings.azure_storage.containerName)}_azure`
const GOOGLE_FILE =  `${service.getContainerName(settings.azure_storage.containerName)}_google`

service.azureWork().then(document => {
    console.log('Finished creation Azure document!');
    const parse = new ParseCsv(AZURE_FILE);
    parse.do(document).then(() => {
        console.info('Transformed to AZURE-CSV!');
    });
});

// service.googleWork().then(document => {
//     console.log('Finished creation Google document!');
//     const parse = new ParseCsv(GOOGLE_FILE);
//     parse.do(document).then(() => {
//         console.info('Transformed to GOOGLE-CSV!');
//     });
// });