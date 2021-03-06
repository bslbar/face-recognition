import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential
} from "@azure/storage-blob";

export interface IAzureStorageProcessorSettings {
  account: string;
  accountKey: string;
  containerName: string;
}

export interface IStorageProcessorItem {
  name: string;
  location: string;
  publicUri: string;
}

export class AzureStorageProcessor {
  private readonly _settings: IAzureStorageProcessorSettings;
  private readonly _blobServiceClient: BlobServiceClient;
  private readonly _containerClient: ContainerClient;

  constructor(settings: IAzureStorageProcessorSettings) {
    this._settings = settings;
    const sharedKey = new StorageSharedKeyCredential(
      this._settings.account,
      this._settings.accountKey
    );
    this._blobServiceClient = new BlobServiceClient(
      `https://${this._settings.account}.blob.core.windows.net`,
      sharedKey
    );
    this._containerClient = this._blobServiceClient.getContainerClient(
      this._settings.containerName
    );
  }

  public getFileUrisAsync(): Promise<IStorageProcessorItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const blobs: IStorageProcessorItem[] = [];
        const iter = this._containerClient.listBlobsFlat();
        for await (const blob of iter) {
          blobs.push({
            name: blob.name,
            location: `${this._containerClient.url}/${blob.name}`,
            publicUri: `${this._containerClient.url}/${blob.name}`
          });
        }
        resolve(blobs);
      } catch (e) {
        reject(e);
      }
    });
  }
}
