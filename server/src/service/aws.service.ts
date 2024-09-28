import AWS from "aws-sdk";

class AWS_Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = this.initializeS3();
  }

  private initializeS3() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    return new AWS.S3();
  }

  async uploadFile(file: any, bucketName: string) {
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
    };

    return await this.s3.upload(params).promise();
  }
}

export default new AWS_Service();
