// index.js

const convertPdfToImages = require('./pdf2Img');
const { processImagesSequentially } = require('./ocr');
const { translateFile } = require('./translate');
const { extractKeywords } = require('./tfidf'); // tfidf 모듈 추가
const { uploadKeywordsToDatabase } = require('./sql'); // 데이터베이스 모듈 불러오기

const filePdf = './resource/input.pdf';
const translatedFilePath = './resource/input_translated.txt';
const keywordFilePath = './resource/keyword_ocr.txt'; // 키워드 결과 파일 경로

async function main() {
    try {
        // PDF를 이미지로 변환
        //await convertPdfToImages(filePdf);

        // 변환된 이미지에 대해 OCR 수행
        //await processImagesSequentially();

        // OCR을 통해 생성된 텍스트 파일 번역
        //await translateFile('./resource/input_ocr.txt', translatedFilePath);

        // 추출된 키워드 가져오기
        const topKeywords = await extractKeywords();

        //console.log('Top Keywords:', topKeywords);

        await uploadKeywordsToDatabase(topKeywords);

        return topKeywords;
    } catch (error) {
        console.error('Error in the main process:', error);
    }
}

module.exports = main; // index.js 파일을 export
