const http = require('http');
const pdf2keyword = require('./index');
const mysql = require('mysql2/promise');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트 주소
};

const startServer = async () => {
  // MySQL 연결 설정
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pdfVoca'
  });

  const server = http.createServer(async (req, res) => {
    // CORS 미들웨어 사용
    cors(corsOptions)(req, res, async () => {
      if (req.method === 'OPTIONS') {
        // OPTIONS 메서드 요청에 대한 응답을 보냅니다.
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.method === 'GET') {
        console.log(req.url);
      }
      let pdfKeyword = '';

      if (req.method === 'GET' && req.url.includes('.pdf')) {
        const pdfKeyword = await pdf2keyword();
        res.writeHead(200, { 'Content-Type': 'text/plain' }); // 헤더 변경
        res.end(pdfKeyword.toString()); // 텍스트로 응답 전송
      }

      //make
      if (req.method === 'GET' && req.url === '/getPdfKeyword') {
        try {
          // MySQL 데이터베이스에서 데이터 가져오기
          const [rows, fields] = await connection.execute('SELECT * FROM test');
          const pdfKeyword = rows;
          console.log(pdfKeyword);

          // JSON 형식으로 데이터 응답
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(pdfKeyword));
        } catch (error) {
          console.error('Error fetching data from MySQL:', error);
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      }
    });
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
