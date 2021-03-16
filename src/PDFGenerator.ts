import { Helper } from "./Helper";
import { GeneratorFunction } from "./types/FunctionsTypes";
import {v4} from "uuid"

export class PDFGenerator {
  /**
   * This function returns the buffer for a generated PDF
   * @param {any} event - The object that comes for lambda which includes the http's attributes
   * @returns {Array<any>} array of Structure Instructions
   */
  static getPDF: GeneratorFunction = async (event, htmlInfo) => {
    try {   
      const options = {
        format: "A4",
        printBackground: true      
      };

      const pdf = await Helper.getPDFBuffer(htmlInfo.url, options);

      const fileUrl = await Helper.uploadToS3(pdf, v4());
      
      return {      
        statusCode: 201,
        body: JSON.stringify({
          fileUrl
        })
      };
    } 
    catch (error) {
      console.error("Error : ", error);
      let url = htmlInfo.url;
      return {
        statusCode: 500,
        body: JSON.stringify({
          error,
          url,
          message: "Cannot find the requested URL",
        }),
      };
    }
  };
}
