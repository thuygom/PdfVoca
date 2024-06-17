const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;

// API 키를 여기에 붙여넣습니다.
const translate = new Translate({ key: 'AIzaSyDW3zH1Dl-NcrvNrdQn7CsCDcBE41o24QM' });

async function translateText(text) {
  try {
    const [translation] = await translate.translate(text, 'en');
    return translation;
  } catch (error) {
    console.error('번역 중 오류 발생:', error);
    throw error; // 에러를 상위 레벨로 다시 던집니다.
  }
}

async function translateFile(inputFilePath, outputFilePath) {
  try {
    const data = await fs.promises.readFile(inputFilePath, 'utf8');
    const translatedText = await translateText(data);
    await fs.promises.writeFile(outputFilePath, translatedText, 'utf8');
    console.log(`번역이 완료되었습니다. 결과 파일: ${outputFilePath}`);
  } catch (error) {
    console.error('파일 처리 중 오류 발생:', error);
  }
}

module.exports = {
  translateFile, // export할 함수
};
