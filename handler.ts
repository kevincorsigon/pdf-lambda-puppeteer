import { APIGatewayProxyHandler } from "aws-lambda";
import { PDFGenerator } from "./src/PDFGenerator";

export const generatePDF: APIGatewayProxyHandler = async (event, _context) => {
  let payload = JSON.parse(event.body);
  const response = await PDFGenerator.getPDF(event,payload);
  return response;
};
