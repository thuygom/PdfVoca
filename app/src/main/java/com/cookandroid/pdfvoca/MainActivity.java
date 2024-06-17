package com.cookandroid.pdfvoca;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private EditText editTextID, editTextPW;
    private Button buttonLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editTextID = findViewById(R.id.editTextID);
        editTextPW = findViewById(R.id.editTextPW);
        buttonLogin = findViewById(R.id.buttonLogin);

        buttonLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String id = editTextID.getText().toString();
                String password = editTextPW.getText().toString();

                if (id.equals("bandlagom") && password.equals("0927")) {
                    // 로그인 성공
                    Intent intent = new Intent(MainActivity.this, SecondActivity.class);
                    Toast.makeText(MainActivity.this, id+"님 환영합니다!!", Toast.LENGTH_SHORT).show();
                    startActivity(intent);
                } else {
                    // 로그인 실패
                    Toast.makeText(MainActivity.this, "Invalid ID or Password", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
