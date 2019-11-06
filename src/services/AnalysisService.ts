import { AzureImageAnalyzer, AzureStorageProcessor, GoogleImageAnalyzer, IStorageProcessorItem, IAzureEmotions, IGoogleEmotions } from '../modules';
import { Subject, interval } from 'rxjs';
import { take } from 'rxjs/operators';

interface IAzureImageBlock  {
    image: IStorageProcessorItem;
    emotions: IAzureEmotions;
}

interface IGoogleImageBlock {
    image: IStorageProcessorItem;
    emotions: IGoogleEmotions;
}

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

        return new Promise<any>(async (resolve, reject) => {

            const processedImages: Subject<IAzureImageBlock> = new Subject<any>();
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
                if (faces.length > 0) {
                    faces.forEach(face => {
                        processedImages.next({
                            image: item,
                            emotions: {
                                contempt: face.faceAttributes.emotion.comtept,
                                disgust: face.faceAttributes.emotion.disgust,
                                fear: face.faceAttributes.emotion.fear,
                                happiness: face.faceAttributes.emotion.happiness,
                                neutral: face.faceAttributes.emotion.neutral,
                                sadness: face.faceAttributes.emotion.sadness,
                                surprise: face.faceAttributes.emotion.surprise,
                                anger: face.faceAttributes.emotion.anger
                            }
                        });
                    });
                } else {
                    processedImages.next({
                        image: item,
                        emotions: {
                            contempt: null,
                            disgust: null,
                            fear: null,
                            happiness: null,
                            neutral: null,
                            sadness: null,
                            surprise: null,
                            anger: null
                        }
                    });
                }

                if (isCompleted) {
                    processedImages.complete();
                }

                console.log(`analyze AZURE ${item.name}, processed ${(((index + 1) / images.length) * 100).toFixed(2)}%`);
            }, null, () => {
                console.log('created result after AZURE analysis')
                isCompleted = true;
            });
        });
    }

    public async googleWork(): Promise<any> {
        const output: IGoogleImageBlock[] = [];

        const images = await this.loadImages();

        for (let i = 0; i < images.length; i++) {
            console.log(`Start GOOGLE analyse ${images[i].name}...`);

            const faces = await this.googleImageAnalyzer.analyzeImage(images[i].publicUri);
            if (faces.length > 0) {
                faces.forEach(face => {
                    output.push({
                        image: images[i],
                        emotions: {
                            angerLikelihood: face.angerLikelihood,
                            blurredLikelihood: face.blurredLikelihood,
                            joyLikelihood: face.joyLikelihood,
                            sorrowLikelihood: face.sorrowLikelihood,
                            surpriseLikelihood: face.surpriseLikelihood,
                        }
                    });
                });
            } else {
                output.push({
                    image: images[i],
                    emotions: {
                        angerLikelihood: null,
                        blurredLikelihood: null,
                        joyLikelihood: null,
                        sorrowLikelihood: null,
                        surpriseLikelihood: null
                    }
                })
            }
            
            console.log(`analyzed GOOGLE ${images[i].name}, processed ${((i + 1) / images.length).toFixed(2)}%`);
        }
        console.log('created result after GOOGLE analysis')

        return output;
    }


}