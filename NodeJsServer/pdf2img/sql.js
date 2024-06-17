const mysql = require('mysql2');
const { Translate } = require('@google-cloud/translate').v2;

// MySQL 데이터베이스 연결 정보 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pdfVoca' // 연결할 데이터베이스 이름
});

// Google Cloud Translate API를 사용하기 위한 인증 정보 설정
const translate = new Translate({ key: 'AIzaSyDW3zH1Dl-NcrvNrdQn7CsCDcBE41o24QM' });

// 텍스트를 번역하는 함수
async function translateText(text) {
    try {
        const [translation] = await translate.translate(text, 'ko'); // 한국어로 번역
        return translation;
    } catch (error) {
        console.error('번역 중 오류 발생:', error);
        throw error;
    }
}

// 결과를 데이터베이스에 업로드하는 함수
async function uploadKeywordsToDatabase(keywords) {
    try {
        // 각 키워드를 순회하면서 데이터베이스에 삽입
        const termRegex = /"term":"([^"]*)"/g;
        const tfidfRegex = /"tfidf":([0-9.]+)/g;
        let matchTerm, matchTfidf;
        while ((matchTerm = termRegex.exec(keywords)) !== null && (matchTfidf = tfidfRegex.exec(keywords)) !== null) {
            const term = matchTerm[1]; // "term" 값 추출
            const tfidf = parseFloat(matchTfidf[1]); // "tfidf" 값 추출하여 실수형으로 변환
            // 한글로 번역
            const korTerm = await translateText(term);
            // 삽입 쿼리 생성
            const query = `INSERT INTO test (eng, kor, tfidf) VALUES (?, ?, ?)`;
            // 삽입 쿼리 실행
            await connection.promise().execute(query, [term, korTerm, tfidf]);
        }
        console.log('Keywords uploaded to database successfully!');
    } catch (error) {
        console.error('데이터베이스에 키워드 업로드 중 오류 발생:', error);
    } finally {
        // 데이터베이스 연결 종료
        connection.end();
    }
}

// 모듈로 내보내기
module.exports = {
    uploadKeywordsToDatabase
};
