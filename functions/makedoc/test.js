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

console.log((await execute()));