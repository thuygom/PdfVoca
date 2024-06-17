package com.cookandroid.pdfvoca;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.List;

public class ExplainStudyActivity extends AppCompatActivity {

    private List<WordItem> wordList;
    private int currentIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_eng);

        ImageButton buttonBack = findViewById(R.id.buttonBack);
        buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        initializeWordList();
        showNextWord();

        Button testButton = findViewById(R.id.test);
        testButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkAnswer();
            }
        });
    }

    private void initializeWordList() {
        wordList = new ArrayList<>();
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ______은 문자열을 나타내는 클래스입니다.", "String"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ______는 클래스의 동작을 정의하는 함수입니다.", "method"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ______이란 클래스의 정적 멤버를 정의하기 위한 키워드입니다.", "static"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ______이란 다른 클래스에서 접근할 수 있도록 하는 접근 제어자입니다.", "public"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ________란 추상 클래스를 정의하거나 메서드를 선언할 때 사용하는 키워드입니다.", "abstract"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 _____란 변수에 저장된 데이터 또는 상수의 값을 의미합니다.", "value"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 _____란 클래스나 객체의 멤버 변수를 의미합니다.", "field"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ________란 다양한 연산을 수행하기 위해 사용되는 기호나 키워드입니다.", "operator"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 _____란 같은 자료형의 데이터를 여러 개 저장할 수 있는 자료구조입니다.", "array"));
        wordList.add(new WordItem("안드로이드 프로그래밍에서 ____이란 메인 메소드를 가리키며, 애플리케이션의 진입점(entry point) 역할을 합니다.", "main"));
        // 추가적인 단어를 여기에 추가
    }

    private void showNextWord() {
        if (currentIndex < wordList.size()) {
            WordItem currentWord = wordList.get(currentIndex);
            TextView engTextView = findViewById(R.id.eng);
            engTextView.setText(currentWord.getEnglish());
        } else {
            showToast("모든 문제를 다 푸셨습니다!");
        }
    }

    private void checkAnswer() {
        EditText resultEditText = findViewById(R.id.result);
        String userAnswer = resultEditText.getText().toString().trim();

        WordItem currentWord = wordList.get(currentIndex);
        if (userAnswer.equalsIgnoreCase(currentWord.getKorean())) {
            showToast("정답입니다!");
            currentIndex++;
            showNextWord();
        } else {
            showToast("오답입니다. 다시 시도하세요.");
        }

        resultEditText.setText("");
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private static class WordItem {
        private final String english;
        private final String korean;

        WordItem(String english, String korean) {
            this.english = english;
            this.korean = korean;
        }

        public String getEnglish() {
            return english;
        }

        public String getKorean() {
            return korean;
        }
    }
}
