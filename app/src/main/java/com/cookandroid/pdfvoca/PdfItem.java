package com.cookandroid.pdfvoca;

public class PdfItem {
    private String text;
    private String path;

    public PdfItem(String text,String path) {
        this.text = text;
        this.path = path;
    }

    public String getText() {
        return text;
    }

    public String getPath(){
        return path;
    }
}
