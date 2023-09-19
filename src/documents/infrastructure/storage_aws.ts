import AWS = require("aws-sdk");
import { IStorageService } from "../domain/interfaces/storage_service.interface";
import * as fs from "fs";
import { GenericException } from "../../shared";
import { logger } from "../../index";
import { v4 } from "uuid";

export class StorageAWS implements IStorageService {
  private static _instance: StorageAWS;
  private s3: AWS.S3;

  constructor(private readonly bucketName: string) {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      apiVersion: "latest",
    });
  }

  static instance(bucketName: string): StorageAWS {
    if (!StorageAWS._instance) {
      StorageAWS._instance = new StorageAWS(bucketName);
    }
    return StorageAWS._instance;
  }

  async downloadFile(fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 3600, // Tiempo en segundos que el enlace será válido (1 hora en este ejemplo)
    };

    return this.s3.getSignedUrl("getObject", params);
  }

  private generateNameFIle(file: any): string {
    const currencyDate: Date = new Date();
    const year: number = currencyDate.getFullYear();
    const month: number = currencyDate.getMonth() + 1;

    const extension = file.name.split(".").pop();
    const newFileName = `${v4()}.${extension}`;

    return `${year}/${month}/${newFileName}`;
  }

  async uploadFile(file: any): Promise<string> {
    const key: string = this.generateNameFIle(file);

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: fs.createReadStream(file.tempFilePath),
    };
    try {
      const data = await this.s3.upload(params).promise();
      fs.unlink(file.tempFilePath, (unlinkErr) => {
        if (unlinkErr) {
          logger.info("Error al eliminar el archivo temporal:", unlinkErr);
        } else {
          logger.info("Archivo temporal eliminado");
        }
      });
      return key;
    } catch (e) {
      console.error("Error al subir el archivo a S3:", e);
      throw new GenericException("Error al subir el archivo a S3:");
    }
  }
}
