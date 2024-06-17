const axios = require('axios');
const fs = require('fs/promises');
const natural = require('natural'); // 자연어 처리 라이브러리
const { Translate } = require('@google-cloud/translate').v2;

const jsonFilePath = './resources/questions.json';
// OpenAI API 키를 입력하세요.
const apiKey = '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';

// OpenAI API 엔드포인트 URL
const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

// 비동기 대기 함수
function wait(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

// 질문과 OpenAI API 호출 함수
async function askQuestion(question) {
  try {
    const response = await axios.post(apiUrl, {
      prompt: question,
      max_tokens: 1000, // 응답에서 생성할 최대 토큰 수
      n: 1, // 생성할 응답 수
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Error 429: Too Many Requests. Retrying after 10 seconds...');
      await wait(10000); // 10초 대기
      return await askQuestion(question); // 다시 요청
    } else {
      console.error('Error:', error.message);
      return 'Error occurred while fetching the answer.';
    }
  }
}
// 결과를 파일에 저장하는 함수
async function saveToFile(content) {
  try {
    await fs.writeFile('./resources/QNA.txt', content);
    console.log('Results saved to QNA.txt');
  } catch (error) {
    console.error('Error saving file:', error.message);
  }
}

const translate = new Translate({ key: 'AIzaSyDeYuxSTM8cw0vviVfkjM78XoD7hXklv-4' });

async function createNewJSONFile(questionData) {
  try {
    // JSON 파일에서 이전 데이터를 읽어옵니다.
    let existingData = [];
    try {
      const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
      existingData = JSON.parse(jsonData).questions;
    } catch (error) {
      // 파일이 없거나 오류가 발생한 경우, 빈 배열로 시작합니다.
    }

    // 새로운 질문 데이터를 배열에 추가합니다.
    existingData.push(questionData);

    // 새로운 데이터를 JSON 파일에 씁니다.
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify({ questions: existingData }, null, 2),
      'utf8'
    );

    console.log('JSON 파일이 성공적으로 업데이트되었습니다.');
  } catch (error) {
    console.error('JSON 파일을 생성하는 중 오류 발생:', error);
  }
}

async function translateText_2en(text) {
  try {
    const [translation] = await translate.translate(text, 'en');
    return translation;
  } catch (error) {
    console.error('번역 중 오류 발생:', error);
    throw error; // 에러를 상위 레벨로 다시 던집니다.
  }
}

async function translateText_2ko(text) {
  try {
    const [translation] = await translate.translate(text, 'ko');
    return translation;
  } catch (error) {
    console.error('번역 중 오류 발생:', error);
    throw error; // 에러를 상위 레벨로 다시 던집니다.
  }
}

async function generateHint(correctAnswer, additionalKeyword, temp) {
  const tokenizer = new natural.WordTokenizer();
  const tfidf = new natural.TfIdf();

  const translatedText = await translateText_2en(correctAnswer);
  tfidf.addDocument(translatedText);

  const importantKeywords = [];
  const excludedKeywords = ['used', 'concept', 'structures', 'data', 'refers', 'logical', 'structure']; // 필터링할 키워드 목록을 하드 코딩합니다.

  if (temp) {
    const terms = tfidf.listTerms(0);
    const termSet = new Set(); // 중복 검사를 위한 Set을 사용합니다.

    for (const item of terms) {
      const term = item.term;
      if (
        termSet.size < 2 &&
        !termSet.has(term) &&
        term !== additionalKeyword &&
        !excludedKeywords.includes(term) // 필터링할 키워드가 포함되지 않은 경우에만 추가합니다.
      ) {
        termSet.add(term);
        importantKeywords.push(term);
      }
    }
  }

  importantKeywords.push(additionalKeyword);

  let hint = translatedText;
  importantKeywords.forEach(keyword => {
    hint = hint.replace(new RegExp(keyword, 'gi'), '_');
  });
  hint = await translateText_2ko(hint);
  return [hint, importantKeywords]; // hint와 importantKeywords를 배열로 묶어서 반환합니다.
}

function removeEmptyLines(text) {
  // 줄 바꿈 문자를 기준으로 텍스트를 나눕니다.
  const lines = text.split('\n');

  // 가공된 데이터를 저장할 배열
  const processedLines = [];

  // 정규 표현식을 사용하여 아무런 문자가 없는 줄을 필터링합니다.
  const emptyLine = /^\s*$/;

  // 각 줄을 가공합니다.
  for (const line of lines) {
    if (!emptyLine.test(line)) {
      // 아무런 문자가 없는 줄이 아니라면 저장
      processedLines.push(line);
    }
  }

  // 가공된 데이터를 문자열로 변환하여 반환합니다.
  return processedLines.join('\n');
}

function shortTrim(answer) {
  try {
    const [questionPart, answerPart] = answer.split('\n');
    const question = questionPart.slice(2).trim(); // "Q: " 제거
    const answerText = answerPart.length >= 2 ? answerPart.slice(2).trim() : answerPart.trim(); // "A: " 제거
    return { question, answerText };
  } catch (error) {
    console.error('Error in shortTrim function:', error.message);
    // 오류 처리 방법을 추가하거나 빈 객체를 반환할 수 있습니다.
    return -1;
  }
}

function selectionTrim(questionString) {
  try {
    const parts = questionString.split('\n');

    // 첫 번째 줄에서 질문 추출
    const question = parts[0].slice(2).trim(); // "Q. " 제거

    // 나머지 줄에서 선택지 추출
    const choices = [];
    for (let i = 1; i <= 4; i++) {
      // 문자열 길이 확인 후 slice
      const choice = parts[i].length >= 3 ? parts[i].slice(3) : parts[i];
      choices.push(choice.trim()); // "1. "부터 "4. "까지 제거
    }

    // 마지막 줄에서 정답 추출
    const answer = parts[5].length >= 2 ? parts[5].slice(2).trim() : parts[5].trim(); // "A. " 제거

    return { question, choices, answer };
  } catch (error) {
    console.error(questionString, '\nError in selectionTrim function:', error.message);
    // 오류 처리 방법을 추가하거나 빈 객체를 반환할 수 있습니다.
    return { question: '', choices: [], answer: '' };
  }
}

function blankTrim(answer) {
  try {
    const [questionPart, answerPart] = answer.split('\n');
    const question = questionPart.slice(2).trim(); // "Q: " 제거
    const answerText = answerPart.length >= 2 ? answerPart.slice(2).trim() : answerPart.trim(); // "A: " 제거
    return { question, answerText };
  } catch (error) {
    console.error('Error in blankTrim function:', error.message);
    // 오류 처리 방법을 추가하거나 빈 객체를 반환할 수 있습니다.
    return { question: '', answerText: '' };
  }
}

async function startChat(webKeyword) {

  await fs.truncate(jsonFilePath);
  console.log('Type "exit" to end the conversation.');

  try {
    // 파일에서 과목명과 키워드 읽기
    let fileContent;
    try {
      webKeyword = webKeyword.substring(1);
      fileContent = webKeyword;
      console.log(fileContent);
    } catch (readError) {
      console.error('Error reading file:', readError.message);
      return; // 파일 읽기 실패 시 함수 종료
    }
    const lines = fileContent.trim().split('$');
    const subject = lines[0];
    const keywords = lines.slice(1);

    let results = '';

    for (let i = 0; i < keywords.length; i++) {
      // 확률에 따라 문제 형식 선택
      let randomType;
      const randomValue = Math.random() * 100; // 0에서 100 사이의 랜덤한 값 생성
      //randomValue = 69;
      if (randomValue < -1) {
        randomType = 1; // 10% 확률로 1번 형식 선택
      } else if (randomValue < 30) {
        randomType = 2; // 30% 확률로 2번 형식 선택
      } else if (randomValue < 70) {
        randomType = 3; // 40% 확률로 3번 형식 선택
      } else {
        randomType = 4; // 30% 확률로 4번 형식 선택
      }

      let prompt;
      switch (randomType) {
        case 1:
          prompt = `한국어로 ${subject}에서 ${keywords[i]}에 정의를 물어봐라.(문제에는 Q를 붙이고 답에는 A를 앞에 붙인다.)`;
          const answer1 = await askQuestion(prompt);
          console.log("[빈칸많이]" + answer1);
          results += `${answer1}\n`;
          console.log(keywords[i] + " quiz saved");
          break;
        case 2:
          prompt = `한국어로 ${subject}에서 ${keywords[i]}에 관한 간단한 퀴즈를 1개 출제하라(정답은 단답형(한 단어)으로 나오도록 하라. 문제에는 Q를 붙이고 답에는 A를 앞에 붙인다.)`;
          const answer2 = await askQuestion(prompt);
          const rEA2 = await removeEmptyLines(answer2);
          const trimmedQuestion2 = shortTrim(rEA2);

          console.log("[단답형] 질문:", trimmedQuestion2.question);
          console.log("[단답형] 답변:", trimmedQuestion2.answerText);

          const case2Json = {
            Question: trimmedQuestion2.question,
            Answer: trimmedQuestion2.answerText,
          };
          createNewJSONFile(case2Json);

          results += `${answer2}\n`;
          console.log(keywords[i] + " quiz saved");
          break;
        case 3:
          while (true) {
            prompt = `한국어로 ${subject}에서 ${keywords[i]}에 관한 간단한 퀴즈를 1개 출제하라(4개의 선택지를 꼭 가진 객관식으로 무조건 출제하라(1번 2번 3번 4번 4개의 선택지는 각각 개행문자로 분리되어야한다.). 4개의 선택지를 텍스트로 반드시 출력하고 선택지들간의 분리는 개행문자로 통일한다. 답변으로는 몇번이 답인지 숫자로 표시한다.  문제에는 Q:를 붙이고 선택지에는 1부터 4까지를 붙이고 개행문자로 분리한다. 답에는 A:를 앞에 무조건 붙인다.)`;
            const answer3 = await askQuestion(prompt);
            const rEA3 = await removeEmptyLines(answer3);
            const trimmedQuestion3 = selectionTrim(rEA3);
            if (trimmedQuestion3.question == '') {
              continue;
            }

            console.log('질문:', trimmedQuestion3.question);
            console.log('선택지:', trimmedQuestion3.choices);
            console.log('정답:', trimmedQuestion3.answer.charAt(0));
            const case3Json = {
              Question: trimmedQuestion3.question,
              Answer: trimmedQuestion3.answer,
              Selection: trimmedQuestion3.choices,
            };
            createNewJSONFile(case3Json);
            results += `${answer3}\n`;
            console.log(keywords[i] + " quiz saved");
            if (trimmedQuestion3.question != '') {
              break;
            }
          }
          break;
        case 4:
          prompt = `한국어로 ${subject}에서 ${keywords[i]}(이 키워드만 영어로 쓸것)에 정의를 물어봐라.(문제는 Q를 붙이고 답에는 A를 앞에 붙인다.)`;
          const answer4 = await askQuestion(prompt);
          const rEA4 = await removeEmptyLines(answer4);
          const trimmedQuestion4 = blankTrim(rEA4);

          console.log("[빈칸] 답변:" + trimmedQuestion4.answerText);

          const [blankQuestion, blankKeywords] = await generateHint(trimmedQuestion4.answerText, keywords[i], false);

          console.log('문제:', blankQuestion);
          console.log('힌트:', blankKeywords);

          const case4Json = {
            Question: blankQuestion,
            Answer: trimmedQuestion4.answerText,
            Hint: blankKeywords,
          };
          createNewJSONFile(case4Json);

          results += `${answer4}\n`;
          console.log(keywords[i] + " quiz saved");

          break;
        default:
          break;
      }

      if (i < (keywords.length - 1)) {
        // 다음 반복을 시작하기 전에 잠깐의 텀(예: 2초)을 둡니다.
        console.log('Waiting for 2 seconds before the next question...');
        await wait(2000); // 2초 대기
      }
    }

    await saveToFile(results);
  } catch (error) {
    console.error('Error:', error.message);
  }
  console.log("generating finished");
}

module.exports = async function runChat(webKeyword) { // 문자열을 인자로 받도록 수정
  try {
    await startChat(webKeyword);

    // JSON 파일에서 데이터 읽어오기
    const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
    const questionsData = JSON.parse(jsonData);

    return questionsData;
  } catch (error) {
    console.error('Error in runChat:', error.message);
    return null; // 오류 발생 시 null 반환 또는 오류 처리 방법을 선택하세요.
  }
};
