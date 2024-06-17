##PDFVoca

Pdf 자료를 분석한 단어 테스트 어플리케이션

1971092 김정훈



### 1.프로젝트 수행목적

#### 1.1 프로젝트 정의

- pdf자료 분석을 통한 단어 테스트 어플리케이션

#### 1.2 프로젝트 배경

- 코로나 이후 블렌디드 수업이 늘어나면서, pdf강의자료 및 영상자료를 활용하여 공부하는 강의가 한성대학교 내에서는 자주 보인다.

  이러한 공부를 할 때,  중요한 단어의 뜻을 잘 모르는 경우가 발생하는데 이런 학생들을 위해 pdf에서 중요한 단어를 추출해 학습을 도와줄 목적으로 만들었다.

#### 1.3 프로젝트 목표

- pdf분석
  - pdf-poppler라이브러리를 통해 pdf를 이미지로 변환한다.
  - 변환한 pdf이미지를 google OCR을 통해 text로 변환한다.
  - 추출한 text를 영어로 번역하여 TF-IDF를 사용할 수 있도록 전처리한다.
  - TF-IDF방식의 단어 토큰화를 통해 해당 pdf에서 중요 단어를 추출한다.
  - 추출한 단어들을 Chat gpt API를 통해서 "과목(ex)안드로이드 프로그래밍) + 단어(String)은 어떤 의미를 가지는가?" 등의 prompt를 생성해 단어에 걸맞는 해석을 만든다.

- mysql연결
  - mySql 데이터 베이스에 단어, 영어 단어, TFIDF수치(단어 중요도), 해석 을 업로드한다.
  - android Studio에서 nodejs서버에 pdf분석을 요청하고, 요청결과 데이터베이스에 결과값이 업로드 되면 업로드 된 결과값을 기반으로 단어테스트를 본다.

- 단어 TEST
  - 데이터 베이스에 있는 값들을 기반으로 test를 본다.

### 2. 프로젝트 개요

#### 2.1 프로젝트 설명

- pdf리스트에서 pdf item을 선택하면, node JS webserver에 요청을 보낸다. 
  - pdf-poppler로 pdf->image변환
  - google OCR로 image->text변환
  - google translation으로 text 영어로 번역
  - TF-IDF방식을 통해 영어 text에서 단어의 빈도를 통한 주요 단어 추출
  - chat gpt api를 통해 "과목(ex)안드로이드 프로그래밍) + 단어(String)은 어떤 의미를 가지는가?" 등의 prompt를 생성해 단어에 걸맞는 해석을 수집
  - 수집한 단어, 영단어, 해석, tf-idf수치를 mysql Database에 업로드

- android 어플리케이션에서 database에서 값을 받아와 단어 test를 본다.

#### 2.2 프로젝트 구조

![image-20240617174109014](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174109014.png)

![image-20240617174130666](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174130666.png)

### 2.3 결과물

- Login

  ![image-20240617174458847](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174458847.png)

- Main

  ![image-20240617174526579](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174526579.png)

- 단어 등록

  ![image-20240617174548626](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174548626.png)

  ![image-20240617174705134](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174705134.png)

  

- 단어 맞추기

  ![image-20240617174722296](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174722296.png)

- 영단어 공부

  ![image-20240617174745455](C:\Users\repli\AppData\Roaming\Typora\typora-user-images\image-20240617174745455.png)

### 2.4 기대효과

- pdf강의자료에서 중요한 단어를 공부할 수 있다.

### 2.5 관련기술

| 구분                      |                                                         설명 |
| :------------------------ | -----------------------------------------------------------: |
| pdf-poppler               | pdf를 이미지로 변환해주는 라이브러리이다. pdf정보만 추출하는 것도 가능하며, 나는 pdf를 이미지로 변환하는데 사용하였다. |
| google video intelligence | 구글 API를 통한 이미지에서 text를 감지하여 추출하는것이다. nodeJS서버를 통해 파일시스템 txt파일로 추출하였다. |
| google translation        | 구글 번역 API이다. 원하는 언어로 번역이 가능하다. natural의 TFIDF를 통한 주요 단어추출을 위해선 한글보다 영어가 더욱 정확한 결과를 추출하기에 사전에 영어로 번역하여 전처리를 진행하였다. |
| TF-IDF                    | natural라이브러리에 있는  메소드이며 단어를 토큰화하여 전체 text에서  사용빈도수를 기반으로  rank를 매겨 주요 단어를 추출한다. |
| Chat gpt api              | chat gpt  api를 사용해서 챗봇을 만들고, 과목명과 단어를 기반으로 prompt를 생성해서 단어의 해석을 얻는데 사용하였다. |
| mysql DB                  |    mysqlDB를 통해서 android와  nodejs서버간 통신을 연결했다. |

### 2.6 개발도구

| 구분           |
| -------------- |
| android studio |
| nodejs         |
| mysql          |

### 2.7 발표영상

