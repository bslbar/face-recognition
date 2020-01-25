import * as request from "request-promise-native";

export interface IFaceAttributes {
    returnFaceId: boolean;
    returnFaceLandmarks: boolean;
    returnFaceAttributes: string;
    recognitionModel: string;
    returnRecognitionModel: boolean;
    detectionModel: string;
}

export interface IAzureImageAnalyzerSettings {
    subscriptionKey: string;
    endpoint: string;
    config: IFaceAttributes
}

export interface IAzureEmotions {
    anger: number;
    contempt: number;
    disgust: number;
    fear: number;
    happiness: number;
    neutral: number;
    sadness: number;
    surprise: number
}

export class AzureImageAnalyzer {

    private readonly _settings: IAzureImageAnalyzerSettings;
    private readonly _uriBase: string;

    constructor(settings: IAzureImageAnalyzerSettings) {
        this._settings = settings;
        this._uriBase = `${this._settings.endpoint}?returnFaceId=${this._settings.config.returnFaceId}&returnFaceLandmarks=${this._settings.config.returnFaceId}&returnFaceAttributes=${this._settings.config.returnFaceAttributes}&recognitionModel=${this._settings.config.recognitionModel}&returnRecognitionModel=${this._settings.config.returnRecognitionModel}&detectionModel=${this._settings.config.detectionModel}`;
    }

    public analyzeImage(imageUrl: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const options = {
                    body: `{ "url" : "${imageUrl}" }`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': this._settings.subscriptionKey
                        }
                };

                const response: any[] = JSON.parse(await request.post(this._uriBase, options));
                
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    }

}