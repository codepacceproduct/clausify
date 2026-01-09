
import { PDFParse } from "pdf-parse";

console.log("Prototype keys:", Object.getOwnPropertyNames(PDFParse.prototype));
console.log("Static keys:", Object.getOwnPropertyNames(PDFParse));
