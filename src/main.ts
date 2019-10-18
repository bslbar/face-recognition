import * as fs from 'fs';
import { AzureStorageProcessor, AzureImageAnalyzer, GoogleImageAnalyzer } from './modules';
import { AnalysisService } from './services';


const settings = JSON.parse(fs.readFileSync('.local/settings.json').toString());

const azureStorageProcessor: AzureStorageProcessor = new AzureStorageProcessor(settings.azure_storage);
const azureImageAnalyzer: AzureImageAnalyzer = new AzureImageAnalyzer(settings.azure_vision);
const googleImageAnalyzer: GoogleImageAnalyzer = new GoogleImageAnalyzer();

const service = new AnalysisService(azureStorageProcessor, azureImageAnalyzer, googleImageAnalyzer);
service.doWork().then(output => {
    console.info(output);
    console.log("FINITO!");
});