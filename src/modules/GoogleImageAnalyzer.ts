import { EmotionsLabelGoogleEnum } from "../enums";
import vision from "@google-cloud/vision";

export interface IGoogleEmotions {
  angerLikelihood: string;
  joyLikelihood: string;
  sorrowLikelihood: string;
  surpriseLikelihood: string;
}

export class GoogleImageAnalyzer {
  readonly _client: any;

  constructor() {
    this._client = new vision.ImageAnnotatorClient();
  }

  public analyzeImage(imageUrl: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const [response] = await this._client.faceDetection(imageUrl);
        resolve(response.faceAnnotations);
      } catch (error) {
        reject(error);
      }
    });
  }

  public transcodingEmotionsValue(emotion: string): string {
    switch (emotion) {
      case EmotionsLabelGoogleEnum.UNKNOWN:
        return null;
      case EmotionsLabelGoogleEnum.VERY_UNLIKELY:
        return "0.1";
      case EmotionsLabelGoogleEnum.UNLIKELY:
        return "0.25";
      case EmotionsLabelGoogleEnum.POSSIBLE:
        return "0.5";
      case EmotionsLabelGoogleEnum.LIKELY:
        return "0.75";
      case EmotionsLabelGoogleEnum.VERY_LIKELY:
        return "0.9";
      default:
        break;
    }
    return null;
  }
}
