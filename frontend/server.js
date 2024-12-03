const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors'); // CORS 패키지 임포트
const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// async function translateText(text) {
//     const client_id = 'g54c3scsoh';
//     const client_secret = '5JzPpQKJeVHSjj641LrwETgpFGr2Pwh7v5umh69z';
//     const url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
//     const data = `source=en&target=ko&text=${encodeURIComponent(text)}`;

//     const headers = {
//         'X-NCP-APIGW-API-KEY-ID': client_id,
//         'X-NCP-APIGW-API-KEY': client_secret,
//         'Content-Type': 'application/x-www-form-urlencoded',
//     };

//     try {
//         const response = await axios.post(url, data, { headers });
//         let translatedText = response.data.message.result.translatedText;

//         // 존댓말로 변환할 경우에만 처리
//         if (convertToPolite) {
//             translatedText = convertMultipleSentences(translatedText);
//         }

//         return translatedText;
//     } catch (error) {
//         console.error('Error translating text:', error);
//         return text; // 오류 발생 시 원문 반환
//     }
// }
// function processTranslation(text) {
//     // 반말 어미를 존댓말 어미로 변환하는 규칙들
//     const conversionRules = [
//         { end: '습니다.', polite: '어요.' },
//         { end: '었다.', polite: '었어요.' },
//         { end: '했다.', polite: '했어요.' },
//         { end: '였다.', polite: '였어요.' },
//         { end: '이었다.', polite: '이었어요.' },
//         { end: '됐다.', polite: '됐어요.' },
//         { end: '이다.', polite: '이에요.' },
//         { end: '야.', polite: '예요.' },
//         { end: '해.', polite: '해요.' },
//         { end: '지.', polite: '죠.' },
//         { end: '다.', polite: '어요.' }, // 다.로 끝나는 모든 문장 처리
//         // 추가적인 규칙은 필요에 따라 계속 추가 가능
//     ];

//     // 규칙에 따라 변환
//     for (const rule of conversionRules) {
//         if (text.endsWith(rule.end)) {
//             return text.replace(rule.end, rule.polite);
//         }
//     }

//     // 변환할 규칙이 없는 경우 원문 반환
//     return text;
// }
// function convertMultipleSentences(text) {
//     // 텍스트를 문장 단위로 분리 (마침표, 느낌표, 물음표를 기준)
//     const sentences = text.split(/(?<=[.!?])\s+/);

//     // 각 문장을 변환하여 다시 결합
//     const convertedSentences = sentences.map((sentence) => processTranslation(sentence));

//     // 변환된 문장을 다시 하나의 텍스트로 합침
//     return convertedSentences.join(' ');
// }

app.post('/save_image/', async (req, res) => {
    console.log(`
[이미지 저장 요청 수신]
선택한책고유번호: ${req.body.선택한책고유번호}
생성할페이지번호: ${req.body.생성할페이지번호}
이미지 데이터 존재 여부: ${!!req.body.image_data}
`);

    const { 선택한책고유번호, 생성할페이지번호, image_data } = req.body;

    if (!image_data) {
        return res.status(400).send('Image data is required');
    }

    try {
        const filename = `${선택한책고유번호}-${생성할페이지번호}-1.png`;
        const filePath = path.join(__dirname, 'public', 'books', filename);

        // base64 데이터를 버퍼로 변환
        const buffer = Buffer.from(image_data, 'base64');

        // 기존 파일이 있으면 삭제
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('기존 파일 삭제:', filePath);
        }

        console.log('파일 저장:', filePath);
        await fs.promises.writeFile(filePath, buffer);
        res.json({ message: '이미지 저장 성공', filename: filename });
    } catch (err) {
        console.error('이미지 저장 중 오류 발생:', err);
        res.status(500).send('이미지 저장 실패');
    }
});

app.post('/nextTxt', async (req, res) => {
    const { formData, 현재페이지줄거리, 선택한선택지 } = req.body;

    if (!formData) {
        return res.status(400).send('Form data is missing');
    }

    // 숫자로 변환 가능한 키를 찾음
    const 숫자키 = Object.keys(req.body).find((key) => !isNaN(Number(req.body[key])));
    // 추출한 숫자키를 숫자로 변환
    const 다음페이지번호 = Number(req.body[숫자키]);

    let response; // response 변수를 함수 스코프에서 선언

    try {
        if (다음페이지번호 === 1) {
            // 외부 API에 요청을 보내기 위한 데이터 구성
            const 요청데이터 = {
                protagonist_name: formData.protagonist_name,
                protagonist_characteristics: formData.protagonist_characteristics,
                gender: formData.gender,
                age: formData.age,
                era: formData.era,
                genre: formData.genre,
                start_place: formData.start_place,
                sentences_per_page: formData.sentences_per_page,
                choices_per_page: formData.choices_per_page,
                story_mood: formData.story_mood,
                theme: formData.theme,
                current_page: 다음페이지번호, // 현재 페이지 번호를 반영
                ending_page_count: formData.ending_page_count,
                ending_style: formData.ending_style,
            };

            response = await axios.post('http://220.69.241.62:8000/generate_story_page/', 요청데이터);
        } else if (다음페이지번호 > 1) {
            const 요청데이터 = {
                previous_text: 현재페이지줄거리 || '',
                previous_choice_text: 선택한선택지 || '',
                current_page: 다음페이지번호,
                protagonist_name: formData.protagonist_name,
                protagonist_characteristics: formData.protagonist_characteristics,
                gender: formData.gender,
                age: formData.age,
                era: formData.era,
                genre: formData.genre,
                start_place: formData.start_place,
                sentences_per_page: formData.sentences_per_page,
                choices_per_page: formData.choices_per_page,
                story_mood: formData.story_mood,
                theme: formData.theme,
                ending_page_count: formData.ending_page_count,
                ending_style: formData.ending_style,
            };
            console.log('요청 데이터:', JSON.stringify(요청데이터, null, 2));
            response = await axios.post('http://220.69.241.62:8000/generate_next_page/', 요청데이터);
        }

        const 다음선택지 = Object.values(response.data.choices); // 선택지를 배열로 변환
        // stable 텍스트 내용을 순회하여 작은따옴표를 백틱으로 변환
        let stableText = response.data.stable.replace(/'/g, '`');
        // 줄거리에서 마침표를 기준으로 <br> 삽입
        const 다음줄거리 = response.data.text.replace(/\.\s*/g, '.<br>');

        console.log('요청된 다음줄거리 결과:', response.data.text);
        console.log('요청된 다음선택지 결과:', response.data.choices);
        console.log('요청된 stable 결과:', stableText);

        res.send({ 다음줄거리, 다음페이지번호, 다음선택지, stableText });
    } catch (error) {
        console.error('Error during API request:', error);
        res.status(500).send('Error during story page generation');
    }
});

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트 라우터
app.post('/save-canvas', async (req, res) => {
    console.log('수신된 요청 데이터:', {
        선택한책고유번호: req.body.선택한책고유번호,
        생성할페이지번호: req.body.생성할페이지번호,
    });
    const 선택한책고유번호 = req.body.선택한책고유번호;
    const 생성할페이지번호 = req.body.생성할페이지번호;
    const 이미지데이터 = req.body.imageData;

    const base64Data = 이미지데이터.replace(/^data:image\/png;base64,/, '');
    const dirPath = path.join(__dirname, 'public', 'books');
    const uniqueFilename = `${선택한책고유번호}-${생성할페이지번호}-2.png`;
    const filePath = path.join(dirPath, uniqueFilename);

    try {
        // 기존 파일이 있으면 삭제
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('기존 파일 삭제:', filePath);
        }

        console.log('캔버스 저장:', filePath);

        // base64 데이터를 파일로 변환하여 지정된 경로에 저장
        await fs.promises.writeFile(filePath, base64Data, 'base64');
        res.json({ message: '이미지 저장 성공', filename: uniqueFilename });
        // 응답 헤더 설정
    } catch (err) {
        console.error('이미지 저장 중 오류 발생:', err);
        res.status(500).send('이미지 저장 실패');
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
