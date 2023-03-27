import { PdfGenerator } from 'hpdf';
import { encode} from 'base64-arraybuffer';


    const generator = new PdfGenerator({
        min: 3,
        max: 10,
    });

    const helloWorld = await generator.generatePDF('<html lang="html">Hello World!</html>');

    const b = encode(helloWorld)
    console.log(b)
    await generator.stop();
