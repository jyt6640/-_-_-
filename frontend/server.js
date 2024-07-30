const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트 라우터
app.post('/save-image', (req, res) => {
    const { imageData } = req.body; // 요청 본문에서 이미지 데이터 추출
    const base64Data = imageData.replace(/^data:image\/png;base64,/, ''); // 이미지 데이터에서 base64 추출
    console.log('추출 성공', base64Data);
    const filePath = path.join(__dirname, 'books', 'pages.png'); // 파일 경로 설정

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        // base64 데이터를 파일로 다시 변환하여 지정된 경로에 저장
        if (err) {
            // 실패한 경우
            console.error('이미지 저장 중 오류 발생:', err);
            return res.status(500).send('이미지 저장 실패');
        }
        res.send('이미지 저장 성공');
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});