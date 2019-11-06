import { AzureImageAnalyzer, AzureStorageProcessor, GoogleImageAnalyzer, IStorageProcessorItem } from '../modules';
import { Subject, from, interval } from 'rxjs';
import { throttleTime, take } from 'rxjs/operators';

export class AnalysisService {

    private itemToBeAnalyzed: Subject<IStorageProcessorItem> = new Subject<IStorageProcessorItem>()
    private itemAnalyzed: Subject<any> = new Subject<any>();

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

        return new Promise<any>(async (resolve, reject) => {

            const processedImages:Subject<any> = new Subject<any>();
            let isCompleted = false;

            const images = await this.loadImages();
            const output: any[] = [];

            processedImages.subscribe(x => {
                output.push(x);
            }, null, () => {
                resolve(output);
            });

            interval(3300).pipe(
                take(images.length)
            ).subscribe(async index => {
                let item = images[index];
                console.log(`Start analyze images ${item.name}...`);

                const faces = await this.azureImageAnalyzer.analyzeImage(item.publicUri);
                faces.forEach(face => {
                    processedImages.next({
                        image: item,
                        emotion: face.faceAttributes.emotion
                    });
                });

                if (isCompleted) {
                    processedImages.complete();
                }

                console.log(`analyze AZURE ${item.name}, processing ${((index + 1) / images.length).toFixed(2)}%`);
            }, null, () => {
                console.log('created result after AZURE analysis')
                isCompleted = true;
            });
        });
    }

    public async googleWork(): Promise<any> {
        const output: any[] = [];

        const images = await this.loadImages();

        for (let i = 0; i < images.length; i++) {
            console.log(`Start GOOGLE analyse ${images[i].name}...`);

            const faces = await this.googleImageAnalyzer.analyzeImage(images[i].publicUri);
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
            console.log(`analyzed GOOGLE ${images[i].name}, processed ${((i + 1) / images.length).toFixed(2)}%`);
        }
        console.log('created result after GOOGLE analysis')

        return output;
    }


}