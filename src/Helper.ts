import * as chromium from "chrome-aws-lambda";

import * as AWS from 'aws-sdk';

import { GetPDFBuffer, UploadFile, putOnDynamoDb } from "./types/HelperTypes";


export class Helper {

  private static readonly BUCKET_NAME = 'kevincorsigon/documentos'; //process.env.BUCKET_NAME; 
  private static readonly SECRET_ACCESS_KEY = 'aUdn3l+I/Bf2ku19+sa5yI18NBH8UCDWCVzgrYjE'; // process.env.SECRET_ACCESS_KEY  
  private static readonly ACCESS_KEY_ID = 'AKIAJQLLNBWEE3Y2ANSQ'; // process.env.ACCESS_KEY_ID
  private static readonly BUCKET_REGION = 'sa-east-1'; // process.env.BUCKET_REGION

  static getPDFBuffer: GetPDFBuffer = async (url: string, options: any) => {
    let browser = null;
    try {
      const executablePath = process.env.IS_OFFLINE
        ? null
        : await chromium.executablePath;
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath,
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });      
      return await page.pdf(options);
    } catch (error) {
      return error;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
  };

  static uploadToS3: UploadFile = async (fileBuffer, fileName) => {
    const s3 = new AWS.S3({
      accessKeyId: Helper.ACCESS_KEY_ID,
      secretAccessKey: Helper.SECRET_ACCESS_KEY,
      region: Helper.BUCKET_REGION
    });

    const params = {
        Bucket: Helper.BUCKET_NAME,
        Key: `${fileName}.pdf`, 
        Body: fileBuffer,        
    };

    let uploadInfo = s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

    return (await uploadInfo.promise()).Location;   
};

static putOnDynamoDb: putOnDynamoDb = async(data) =>{

  const params = {
    TableName: "TABLE_NAME",
    Item: data
  };  

  AWS.config.update({region: Helper.BUCKET_REGION });
  var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      throw err;
    } else {
      console.log("Success", data);
    }
  });
};

}
