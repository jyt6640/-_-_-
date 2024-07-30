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

const getLastSavedFileNumber = (dir, baseName, ext) => {
    const files = fs.readdirSync(dir).filter((file) => file.startsWith(baseName) && file.endsWith(ext));
    const numbers = files.map((file) => parseInt(file.match(/\d+/))).filter((num) => !isNaN(num));
    return numbers.length > 0 ? Math.max(...numbers) : 0;
};

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트 라우터
app.post('/save-image', async (req, res) => {
    const { imageData } = req.body;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const dirPath = path.join(__dirname, 'public', 'books');
    const baseName = 'pages';
    const ext = 'png';

    try {
        // 디렉토리가 존재하지 않으면 생성
        if (!fs.existsSync(dirPath)) {
            console.log('Directory does not exist, creating:', dirPath);
            await fs.promises.mkdir(dirPath, { recursive: true });
        }

        // 최근 저장된 파일 번호를 가져와 다음 파일 이름 생성
        const lastFileNumber = getLastSavedFileNumber(dirPath, baseName, ext);
        const nextFileNumber = lastFileNumber + 1;
        const uniqueFilename = `${baseName}${nextFileNumber}.${ext}`;
        const filePath = path.join(dirPath, uniqueFilename);
        console.log('Saving file to:', filePath);

        // base64 데이터를 파일로 변환하여 지정된 경로에 저장
        await fs.promises.writeFile(filePath, base64Data, 'base64');

        // 응답 헤더 설정
        res.set('Cache-Control', 'no-store');
        res.send(`이미지 저장 성공: ${uniqueFilename}`);
    } catch (err) {
        console.error('이미지 저장 중 오류 발생:', err);
        res.status(500).send('이미지 저장 실패');
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
