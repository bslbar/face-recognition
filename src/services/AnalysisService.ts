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
        console.log('Start downloading uri images...');
        const images: IStorageProcessorItem[] = await this.storageProcessor.getFileUrisAsync();

        console.log('Start analyze images...');
        for (let i = 0; i < images.length; i++) {
            output.push({
                image: images[i],
                azureResult: await this.azureImageAnalyzer.analyzeImage(images[i].publicUri),
                googleResult: await this.googleImageAnalyzer.analyzeImage(images[i].publicUri)
            });
            console.log(`analyzed image ${images[i].name}, processed ${((i+1) / images.length).toFixed(2)}%`);
        }
        console.log('created result after Google and Azure analzysis')

        return output;
    }
}