const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // CORS 패키지 임포트

const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());

// JSON 및 URL-encoded 데이터 파싱을 위한 미들웨어 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// public 폴더를 정적 파일 제공 경로로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트 라우터
app.post('/save-image', (req, res) => {
    const { imageData } = req.body; // 요청 본문에서 이미지 데이터 추출
    const base64Data = imageData.replace(/^data:image\/png;base64,/, ''); // 이미지 데이터에서 base64 추출

    const dirPath = path.join(__dirname, 'public', 'books');
    const filePath = path.join(dirPath, 'pages.png'); // 파일 경로 설정

    // 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        // base64 데이터를 파일로 다시 변환하여 지정된 경로에 저장
        if (err) {
            console.error('이미지 저장 중 오류 발생:', err);
            return res.status(500).send('이미지 저장 실패');
        }
        // 응답 헤더 설정
        res.set('Cache-Control', 'no-store');
        res.send('이미지 저장 성공');
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
