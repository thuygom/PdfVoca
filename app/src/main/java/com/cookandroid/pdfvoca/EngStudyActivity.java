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

public class EngStudyActivity extends AppCompatActivity {

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
        wordList.add(new WordItem("String", "문자열"));
        wordList.add(new WordItem("method", "메소드"));
        wordList.add(new WordItem("static", "정적"));
        wordList.add(new WordItem("public", "공개"));
        wordList.add(new WordItem("abstract", "추상"));
        wordList.add(new WordItem("value", "값"));
        wordList.add(new WordItem("field", "필드"));
        wordList.add(new WordItem("operator", "연산자"));
        wordList.add(new WordItem("array", "배열"));
        wordList.add(new WordItem("main", "메인"));
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
