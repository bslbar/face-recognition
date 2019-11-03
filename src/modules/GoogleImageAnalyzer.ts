import vision from '@google-cloud/vision';

export class GoogleImageAnalyzer {

    readonly _client: any;
    
    constructor() {
        this._client = new vision.ImageAnnotatorClient();
    }

    analyzeImage(imageUrl: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {                
                const [response] = await this._client.faceDetection(imageUrl);
                resolve(response.faceAnnotations)
            } catch (error) {
                reject(error);
            }
        });
    }

}