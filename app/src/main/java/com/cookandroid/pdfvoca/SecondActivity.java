package com.cookandroid.pdfvoca;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

public class SecondActivity extends AppCompatActivity {

    private ImageButton buttonLibrary;
    private ImageButton buttonStudy;
    private ImageButton buttonEng;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);

        buttonLibrary = findViewById(R.id.buttonLibrary);
        buttonStudy = findViewById(R.id.buttonStudy);
        buttonEng = findViewById(R.id.buttonEng);

        buttonLibrary.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SecondActivity.this, LibraryActivity.class);
                startActivity(intent);
            }
        });

        buttonStudy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SecondActivity.this, ExplainStudyActivity.class);
                startActivity(intent);
            }
        });

        buttonEng.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SecondActivity.this, EngStudyActivity.class);
                startActivity(intent);
            }
        });
    }
}
