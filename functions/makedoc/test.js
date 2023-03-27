import { jsPDF } from "jspdf";
import {encode} from 'base64-arraybuffer'

const doc = new jsPDF();

doc.text("Hello world!", 10, 10);

const b = doc.output('arraybuffer')
const base = encode(b)
console.log(base)