package com.cookandroid.pdfvoca;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class LibraryActivity extends AppCompatActivity {

    private ImageButton buttonBack;
    private RecyclerView recyclerView;
    private PdfAdapter pdfAdapter;
    private List<PdfItem> pdfList;
    private WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_library);

        buttonBack = findViewById(R.id.buttonBack);
        // RecyclerView 설정
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true); // JavaScript 사용 설정

        // URL 로드
        webView.loadUrl("http://10.0.2.2:3000/");

        // WebView 내에서 URL 로딩을 처리하기 위해 WebViewClient를 설정합니다.
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // WebView 내에서 새로운 URL을 로드하도록 합니다.
                view.loadUrl(url);
                return true;
            }
        });

        // PDF 리스트 생성 및 Adapter 설정
        pdfList = new ArrayList<>();
        pdfList.add(new PdfItem("3주차_안드로이드를 위한 자바문법","path1"));

        pdfList.add(new PdfItem("1주차_안드로이드의 이해","path1"));
        pdfList.add(new PdfItem("02장_안드로이드의 개요와 개발 환경 설치","path1"));
        pdfList.add(new PdfItem("04장_기본 위젯 익히기","path1"));
        pdfList.add(new PdfItem("05장_레이아웃 익히기","path1"));
        pdfList.add(new PdfItem("06장_고급 위젯 다루기","path1"));
        pdfList.add(new PdfItem("08장_파일 처리","path1"));
        pdfList.add(new PdfItem("10장_액티비티와 인텐트","path1"));
        pdfList.add(new PdfItem("11장_어댑터뷰","path1"));
        pdfList.add(new PdfItem("13장_그래픽과 이미지","path1"));
        pdfList.add(new PdfItem("14장_멀티미디어활용","path1"));

        // 원하는 만큼 PDF 모델을 추가할 수 있습니다.

        pdfAdapter = new PdfAdapter(pdfList);
        recyclerView.setAdapter(pdfAdapter);

        pdfAdapter.setOnItemClickListener(new PdfAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int position) {
                PdfItem clickedItem = pdfList.get(position);
                String itemText = clickedItem.getText();
                showToast("Clicked: " + itemText);

                String url = "http://10.0.2.2:3000/input.pdf";

                // WebView를 이용하여 URL 로드
                webView.loadUrl(url);
            }
        });

        buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 이전 액티비티로 돌아가기
                finish();
            }
        });
    }
    // 토스트 메시지를 출력하는 메서드
    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}

