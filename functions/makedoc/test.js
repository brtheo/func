import { PdfGenerator } from 'hpdf';
import { jsPDF } from "jspdf/dist/jspdf.node.js";
import { encode } from 'base64-arraybuffer';
export default async function execute() {
    
    const generator = new PdfGenerator({
        min: 3,
        max: 10,
    });
    const helloWorld = await generator.generatePDF('<html lang="html">Hello World from html puppeteer!</html>');
    const rawdata = encode(helloWorld);
    await generator.stop();
    
    return rawdata;
}

// console.log((await execute()));

const t = {
    "vars": {
        "SLF_PAR_MADAT": "101J3433B",
        "SLF_PAR_BIRTHDATE": "05/09/1955",
        "SLF_PAR_BIRTHPLACE": "Paris XV",
        "SLF_PAR_ADDR": "1 rue de la paix",
        "SLF_PAR_MAIL": "test@email.com",
        "SLF_PAR_TEL": "06 43 34 54 45",
        "SLF_FUG_NAME": "Peugeot E208",
        "SLF_FUG_NUM": "1"
    }
  }

  console.log(JSON.stringify(t))