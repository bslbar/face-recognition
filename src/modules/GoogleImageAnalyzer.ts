import vision from '@google-cloud/vision';

export class GoogleImageAnalyzer {

    readonly _client: any;
    
    constructor() {
        this._client = new vision.ImageAnnotatorClient();
    }

    analyzeImage(imageUrl: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {                
                const [result] = await this._client.faceDetection(imageUrl);
                resolve(result)
            } catch (error) {
                reject(error);
            }
        });
    }

    dispose():Promise<void> {
        return new Promise<void>(resolve => resolve());
    }
}