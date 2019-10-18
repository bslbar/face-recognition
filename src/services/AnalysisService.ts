import { AzureImageAnalyzer, AzureStorageProcessor, GoogleImageAnalyzer, IStorageProcessorItem } from '../modules';


export class AnalysisService {

    constructor(
        private storageProcessor: AzureStorageProcessor,
        private azureImageAnalyzer: AzureImageAnalyzer,
        private googleImageAnalyzer: GoogleImageAnalyzer
    ) {

    }

    public async doWork(): Promise<any> {
        const output: any[] = [];
        const images: IStorageProcessorItem[] = await this.storageProcessor.getFileUrisAsync();

        for (var i = 0; i < images.length; i++) {
            output.push({
                image: images[i],
                azureResult: await this.azureImageAnalyzer.analyzeImage(images[i].publicUri),
                googleResult: await this.googleImageAnalyzer.analyzeImage(images[i].publicUri)
            });
        }

        return output;
    }
}