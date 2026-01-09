
import * as pdfParseModule from "pdf-parse";

console.log("Module keys:", Object.keys(pdfParseModule));
console.log("Module default:", pdfParseModule.default);
console.log("Type of module default:", typeof pdfParseModule.default);

import("pdf-parse").then(m => {
    console.log("Dynamic import keys:", Object.keys(m));
    console.log("Dynamic import default:", m.default);
});
