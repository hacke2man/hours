const pdfmake = require('pdfmake');
const fs = require('fs');
const parser = require('./src/parser.js');
const create_content = require('./src/create_content.js');
const path = require('path');

// Initialize fonts

const fonts = {
  Liberation: {
    normal: path.join(__dirname, 'data/LiberationSerif-Regular.ttf'),
    bold: path.join(__dirname, 'data/LiberationSerif-Bold.ttf'),
    italics: path.join(__dirname, 'data/LiberationSerif-Italic.ttf'),
    bolditalics: path.join(__dirname, 'data/LiberationSerif-BoldItalic.ttf')
  }
};

const printer = new pdfmake(fonts);

let args = process.argv;
if (typeof process.pkg === 'undefined') {
  args.shift();
  args.shift();
} else {
  args.shift();
}

let instructions = {
  inputFile: "",
  outputFile: "./hours.pdf",
  mode: "plain",
}

for (let i = 0; i < args.length; i++) {
  let arg = args[i];
  switch (arg) {
    case "pdf":
    instructions.mode = "pdf"
      break;
    case "plain":
    instructions.mode = "plain"
      break;
    case "-i":
      if (i + 1 < args.length) {
        i++;
        instructions.inputFile = args[i]
      }
      break;
    case "-o":
      if (i + 1 < args.length) {
        i++;
        instructions.outputFile = args[i]
      }
      break;
  }
}

if (instructions.outputFile === "") { return }
let test_file = fs.readFileSync(instructions.inputFile, "utf8");
let entries = parser.parse(test_file.toString())

switch (instructions.mode) {
  case "plain":
    create_content.plain_text(entries);
    break;
  case "pdf":
    let pdf = printer.createPdfKitDocument(create_content.pdf_content(entries),);

    const writeStream = fs.createWriteStream(instructions.outputFile, "utf8");
    pdf.pipe(writeStream);
    pdf.end();

    writeStream.on('finish', () => {
      console.log('PDF created successfully');
    });
    break;
}
