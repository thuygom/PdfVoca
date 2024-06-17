const path = require('path');
const fs = require('fs');
const pdf = require('pdf-poppler');

async function convertPdfToImages(filePdf) {
    const outputDir = path.join(__dirname, 'images');
    const outputPrefix = path.basename(filePdf, path.extname(filePdf));

    // 이미지 디렉토리가 없으면 생성
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    try {
        const pdfInfo = await pdf.info(filePdf);
        console.log(pdfInfo);

        await pdf.convert(filePdf, {
            format: 'jpg',
            out_dir: outputDir,
            out_prefix: outputPrefix,
        });

        console.log('Conversion successful!');
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

module.exports = convertPdfToImages;
