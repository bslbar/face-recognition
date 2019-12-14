import { AzureImageAnalyzer, AzureStorageProcessor, GoogleImageAnalyzer, IStorageProcessorItem, IAzureEmotions, IGoogleEmotions } from '../modules';
import { Subject, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ContainersNameAzureEnum } from '../enums';

interface IImage {
    name: string;
    url: string;
}

interface IAzureImageBlock extends IImage, IAzureEmotions { }
interface IGoogleImageBlock extends IImage, IGoogleEmotions { }

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

    private getPercentage(index: number, base: number): number {
        return Number(((Number(index + 1) / base) * 100).toFixed(2));
    }

    getContainerName(containerName: string): string {
        switch (containerName) {
            case ContainersNameAzureEnum.ABOUTME:
                return ContainersNameAzureEnum.ABOUTME;
            case ContainersNameAzureEnum.PERSON:
                return ContainersNameAzureEnum.PERSON;
            case ContainersNameAzureEnum.PEOPLE:
                return ContainersNameAzureEnum.PEOPLE;
            default:
                return '';
        }
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
                            name: item.name,
                            url: item.publicUri,
                            contempt: face.faceAttributes.emotion.comtept,
                            disgust: face.faceAttributes.emotion.disgust,
                            fear: face.faceAttributes.emotion.fear,
                            happiness: face.faceAttributes.emotion.happiness,
                            neutral: face.faceAttributes.emotion.neutral,
                            sadness: face.faceAttributes.emotion.sadness,
                            surprise: face.faceAttributes.emotion.surprise,
                            anger: face.faceAttributes.emotion.anger
                        });
                    });
                } else {
                    processedImages.next({
                        name: item.name,
                        url: item.publicUri,
                        contempt: null,
                        disgust: null,
                        fear: null,
                        happiness: null,
                        neutral: null,
                        sadness: null,
                        surprise: null,
                        anger: null
                    });
                }

                if (isCompleted) {
                    processedImages.complete();
                }

                console.log(`analyze AZURE ${item.name}, processed ${this.getPercentage(index, images.length)}%`);
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
                        name: images[i].name,
                        url: images[i].publicUri,
                        angerLikelihood: this.googleImageAnalyzer.transcodingEmotionsValue(face.angerLikelihood),
                        blurredLikelihood: this.googleImageAnalyzer.transcodingEmotionsValue(face.blurredLikelihood),
                        joyLikelihood: this.googleImageAnalyzer.transcodingEmotionsValue(face.joyLikelihood),
                        sorrowLikelihood: this.googleImageAnalyzer.transcodingEmotionsValue(face.sorrowLikelihood),
                        surpriseLikelihood: this.googleImageAnalyzer.transcodingEmotionsValue(face.surpriseLikelihood),
                    });
                });
            } else {
                output.push({
                    name: images[i].name,
                    url: images[i].publicUri,
                    angerLikelihood: null,
                    blurredLikelihood: null,
                    joyLikelihood: null,
                    sorrowLikelihood: null,
                    surpriseLikelihood: null
                })
            }

            console.log(`analyzed GOOGLE ${images[i].name}, processed ${this.getPercentage(i, images.length)}%`);
        }
        console.log('created result after GOOGLE analysis')

        return output;
    }


}