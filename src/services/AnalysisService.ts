import { AzureImageAnalyzer, AzureStorageProcessor, GoogleImageAnalyzer, IStorageProcessorItem } from '../modules';


export class AnalysisService {

    constructor(
        private storageProcessor: AzureStorageProcessor,
        private azureImageAnalyzer: AzureImageAnalyzer,
        private googleImageAnalyzer: GoogleImageAnalyzer
    ) {

    }

    private async loadImages(): Promise<IStorageProcessorItem[]> {
        console.log('Start downloading uri images...');
        return this.storageProcessor.getFileUrisAsync();
    }

    public async azureWork(): Promise<any> {
        const output: any[] = [];
    
        const images = await this.loadImages();

        for (let i = 0; i < images.length; i++) {
            console.log(`Start analyze images ${images[i].name}...`);
            
            const faces = await this.azureImageAnalyzer.analyzeImage(images[i].publicUri);
            faces.forEach(face => {
                output.push({
                    image: images[i],
                    emotion: face.faceAttributes.emotion
                });
            });
            console.log(`analyzed image ${images[i].name}, processed ${((i+1) / images.length).toFixed(2)}%`);
        }
        console.log('created result after Azure analzysis')

        return output;
    }

    public async googleWork(): Promise<any> {
        const output: any[] = [];
    
        const images = await this.loadImages();

        for (let i = 0; i < images.length; i++) {
            console.log(`Start analyze images ${images[i].name}...`);

            const faces =  await this.googleImageAnalyzer.analyzeImage(images[i].publicUri);
            faces.forEach(face => {
                output.push({
                    image: images[i],
                    emotion: {
                        angerLikelihood: face.angerLikelihood,
                        blurredLikelihood: face.blurredLikelihood,
                        joyLikelihood: face.joyLikelihood,
                        sorrowLikelihood: face.sorrowLikelihood,
                        surpriseLikelihood: face.surpriseLikelihood,
                    }
                });
            });
            console.log(`analyzed image ${images[i].name}, processed ${((i+1) / images.length).toFixed(2)}%`);
        }
        console.log('created result after Azure analzysis')

        return output;
    }


}