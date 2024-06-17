const fs = require('fs');
const path = require('path'); // path 모듈 추가
const vision = require('@google-cloud/vision');

// API 키 파일 경로
const keyFilePath = 'myKey.json';

async function detectAndAppendText(imagePath, outputPath) {
  try {
    // API 키 파일을 사용하여 Google Cloud Vision API 클라이언트 생성
    const client = new vision.ImageAnnotatorClient({
      keyFilename: keyFilePath,
    });

    // 이미지 파일을 버퍼로 읽어옴
    const imageBuffer = fs.readFileSync(imagePath);

    // Vision API를 통해 이미지의 텍스트 인식 요청
    const [result] = await client.textDetection(imageBuffer);
    const texts = result.textAnnotations;

    // 텍스트 블록을 Y 좌표 값에 따라 정렬
    texts.sort((a, b) => {
      const yA = a.boundingPoly.vertices[0].y;
      const yB = b.boundingPoly.vertices[0].y;
      return yA - yB;
    });

    // 텍스트 인식 결과를 연결된 문자열로 생성
    let combinedText = '';
    for (const text of texts) {
      combinedText += `${text.description} `;
    }

    // 결과를 파일에 추가 저장 (이전 내용에 덮어쓰지 않음)
    fs.appendFileSync(outputPath, combinedText, 'utf-8');

    console.log(`Detected Texts from ${imagePath} appended to ${outputPath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processImagesSequentially() {
  const imageDir = './images';
  const outputPath = './resource/input_ocr.txt';

  try {
    // 이미지 디렉토리 읽기
    const imageFiles = fs.readdirSync(imageDir);

    // 이미지 파일들을 정렬하여 순서대로 처리
    const sortedImageFiles = imageFiles
      .filter(imageFile => imageFile.match(/^input-\d{2}\.jpg$/))
      .sort((a, b) => {
        const numA = Number(a.match(/\d{2}/)[0]);
        const numB = Number(b.match(/\d{2}/)[0]);
        return numA - numB;
      });

    // 최초 실행 시에만 파일의 기존 내용 삭제
    if (sortedImageFiles.length > 0) {
      fs.writeFileSync(outputPath, '', 'utf-8');
    }

    // 순차적으로 이미지에 대해서 OCR 수행 및 결과 추가
    for (const imageFile of sortedImageFiles) {
      const imagePath = path.join(imageDir, imageFile);
      await detectAndAppendText(imagePath, outputPath);
    }
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// 모듈로 내보냅니다.
module.exports = {
  processImagesSequentially,
};
