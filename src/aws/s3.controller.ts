import { Injectable, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Buffer } from 'buffer';

@Injectable()
export class S3Service {
  private _configService: ConfigService;
  private s3Service: AWS.S3;
  constructor() {
    this.initialize();
  }

  private initialize() {
    this.s3Service = new AWS.S3({
      accessKeyId: 'AKIATOB6LXCIEQXBNQ7C',
      secretAccessKey: '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',
      region: 'us-east-1',
    });
  }

  /*
   *
   * Renders an entire login page with email and password fields
   * using {@link Renderer}.
   * @public
   * @abstract Show AWS Data env Data
   * @param  {string}  base64 Data
   * @return {string}  Image url
   *
   */

  async S3Upload(base64: string, fileIdentifier: string) {
    let k: string = base64.replace(/^data:image\/\w+;base64,/, '');
    const base64Data = Buffer.from(k, 'base64');
    const type = base64.split(';')[0].split('/')[1];

    const params = {
      Bucket: 'dealer-images-bucket',
      Key: fileIdentifier,
      Body: base64Data,
      ContentType: type,
    };

    try {
      let s3Response = await this.s3Service.upload(params).promise();
      return s3Response.Location.toString();
    } catch (e) {
      console.log(e);
    }
  }

  async S3GetAllFiles() {
    try {
      let dataImages: string[] = [];
      let S3Response = await this.s3Service
        .listObjects({ Bucket: 'dealer-images-bucket' })
        .promise();

      S3Response.Contents.forEach((item) => {
        dataImages.push(
          `https://dealer-images-bucket.s3.amazonaws.com/${item.Key}`,
        );
      });
      return dataImages;
    } catch (error) {
      console.log(error);
    }
  }
}
