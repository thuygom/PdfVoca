let pdfJson;

document.getElementById('pdfButton').addEventListener('click', async (event) => {
    try {
        const pdfPath = '!/resources/input.pdf';
        const pdfSubject = '/Android';

        // Fetch 요청
        const response = await fetch('http://localhost:3000' + pdfSubject + pdfPath);

        // 응답이 성공적인 경우
        if (response.ok) {
            const responseText = await response.text(); // 텍스트 데이터 추출
            // p 태그 찾기
            const outputElement = document.getElementById('output');
            // 새로운 p 태그 생성
            const pTag = document.createElement('p');
            // 텍스트 설정
            pTag.textContent = responseText;
            // output에 p 태그 추가
            outputElement.appendChild(pTag);
        } else {
            throw new Error('An error occurred: ' + response.statusText);
        }
    } catch (error) {
        // 오류 처리
        console.error('An error occurred:', error);
        document.getElementById('output').textContent = 'An error occurred during chat execution.';
    }
});

document.getElementById('getPdfKeyword').addEventListener('click', async (event) => {
    try {
        console.log("before");
        // Fetch 요청
        const response = await fetch('http://localhost:3000/getPdfKeyword');
        console.log("after");
        // 응답이 성공적인 경우
        if (response.ok) {
            document.write("ok");
            const pdfJson = await response.text(); // 텍스트 데이터 추출
            // p 태그 찾기
            const outputElement = document.getElementById('output');
            // 새로운 p 태그 생성
            const pTag = document.createElement('p');
            // 텍스트 설정
            pTag.textContent = pdfJson;
            // output에 p 태그 추가
            outputElement.appendChild(pTag);
        } else {
            throw new Error('An error occurred: ' + response.statusText);
        }
    } catch (error) {
        document.write('An error occurred:', error);
        document.getElementById('output').textContent = 'An error occurred during chat execution.';
    }
});
