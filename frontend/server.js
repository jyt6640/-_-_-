const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트
app.post('/save-image', (req, res) => {
    const { imageData } = req.body;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    const filePath = path.join(__dirname, 'images', 'pages.png');

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('이미지 저장 중 오류 발생:', err);
            return res.status(500).send('이미지 저장 실패');
        }
        res.send('이미지 저장 성공');
    });
});

// 이미지 저장을 위한 디렉토리 생성
if (!fs.existsSync(path.join(__dirname, 'images'))) {
    fs.mkdirSync(path.join(__dirname, 'images'));
}

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});