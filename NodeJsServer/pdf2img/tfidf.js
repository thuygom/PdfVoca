const fs = require('fs');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// 파일에서 텍스트 읽어오기
const filePath = './resource/translate.txt';

async function extractKeywords() {
  try {
    // 파일을 비동기적으로 읽어옵니다.
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');

    // 전체 텍스트를 하나의 문서로 추가
    tfidf.addDocument(fileContent);

    const excludedKeywords =
      ["hansung", "university", "school", "2019", "20", "data", "int", "rlink",
        "gt", "lt", "quot", "easily", "saengneung", "linked", "written", "company",
        "publishing", "line", "21", "23", "25", "06", "www", "etc", "fa0", "figure",
        "168", "192", "pi", "usb", "operating", "card", "system", "connection",
        "li", "39", "null", "name", "kor", "eng", "void", "math", "s1", "student", "return",
        "s2", "class", "car", "speed", "10", "12", "color", "11", "number", "used",
        "example", 'java', 'new', 'type', 'println', 'one', 'conditional',
        'statement', 'move', '13', '14', '15']; // 제외할 키워드 추가
    const keywords = [];

    tfidf.listTerms(0).forEach((termInfo) => {
      if (!excludedKeywords.includes(termInfo.term.toLowerCase())) { // 대소문자 구분 없이 체크
        keywords.push({
          term: termInfo.term,
          tfidf: termInfo.tfidf
        });
      }
    });

    keywords.sort((a, b) => b.tfidf - a.tfidf); // TF-IDF 값 기준으로 정렬

    // 상위 10개 키워드 추출
    const topKeywords = keywords.slice(0, 10);
    console.log(topKeywords);
    // 탑 10개의 키워드를 담은 JSON 반환
    return JSON.stringify(topKeywords);
  } catch (error) {
    console.error('파일을 읽거나 쓰는 중 오류가 발생했습니다.', error);
    return null; // 오류 발생 시 null 반환
  }
}

// 함수와 데이터를 내보내기
module.exports = {
  extractKeywords,
};
