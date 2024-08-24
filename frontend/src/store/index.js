import { createStore } from 'vuex';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { nextTick } from 'vue';

export default createStore({
    state: {
        선택한책고유번호: 999,
        현재페이지번호: 0,
        마지막페이지번호: 0,
        선택한책줄거리: [{ id: 0, 줄거리: null, 삽화: 'books/1.jpg', 캔버스: 'books/2.jpg', 다음선택지: [] }],
        pages: ['books/1.jpg', 'books/2.jpg'],
        버튼비활성화상태: false,
    },
    mutations: {
        버튼비활성화상태변경(state, status) {
            state.버튼비활성화상태 = status;
        },
        현재페이지번호증가(state) {
            state.현재페이지번호 += 1;
        },
        현재페이지번호감소(state) {
            state.현재페이지번호 -= 1;
        },
        다음페이지정보추가(state, 다음페이지) {
            state.선택한책줄거리.push(다음페이지);
            state.pages.push(다음페이지.삽화);
            state.pages.push(다음페이지.캔버스);
            state.마지막페이지번호 += 1;
            this.commit('현재페이지번호증가');
        },
    },
    actions: {
        async API테스트액션(context, { 선택한책고유번호, 새로운페이지번호 }) {
            try {
                const 다음페이지번호 = 새로운페이지번호;
                const 데이터 = {
                    prompt: 'A young girl, 10, with bright eyes and a determined expression, stands on the bustling, neon-lit platform of a futuristic space station. Her bright red overalls are adorned with patches, and she carries a backpack overflowing with strange gadgets. Behind her, towering structures reach for the vast, starry sky. In the background, sleek spaceships glide past, leaving trails of shimmering light. The atmosphere is vibrant and full of excitement, hinting at the adventures that await. Emphasize a sense of wonder and courage, capturing the energy of a child embarking on an extraordinary journey.**  **Style:** Highly detailed, cinematic, with a touch of anime influence.   **Keywords:** futuristic space station, neon lights, young girl, bright eyes, determined, red overalls, backpack, gadgets, spaceships, starry sky, vibrant, exciting, wonder, courage, adventure.  **Optional additions:**  *  **Include a friendly robot companion standing beside the girl.**  *  **Add a whimsical touch with floating, glowing orbs or other futuristic elements.** * **Adjust the lighting for a more dramatic or whimsical feel.**  This prompt will generate a visually appealing image that captures the essence of the story`s themes and setting.',
                };
                const 결과 = await axios.post('http://220.69.241.62:8083/generate_image/', 데이터, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // 이미지 데이터 추출
                const imageData = 결과.data.image_data;
                //console.log('API 테스트 결과:', imageData);

                // 백엔드 서버로 이미지 데이터 전송
                const 저장결과 = await axios.post(
                    'http://localhost:3000/save_image/',
                    {
                        선택한책고유번호, // 선택한 책 고유 번호
                        다음페이지번호, // 다음 페이지 번호
                        image_data: imageData, // 생성된 이미지 데이터
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('이미지 데이터가 백엔드 서버로 전송되었습니다.');

                if (저장결과 && 저장결과.data && 저장결과.data.filename) {
                    return 저장결과.data.filename;
                } else {
                    throw new Error('Filename is not returned from save_image API');
                }
            } catch (error) {
                console.error('API 테스트 오류:', error);
            }
        },
        async 다음줄거리요청액션(context, { 선택한책고유번호, 다음페이지번호 }) {
            try {
                // 첫 번째 요청: 다음 줄거리와 선택지 가져오기
                const 결과1 = await axios.post('http://localhost:3000/nextTxt', { 다음페이지번호 });
                const 다음줄거리 = 결과1.data.다음줄거리;
                const 다음선택지 = 결과1.data.다음선택지;
                const 새로운페이지번호 = 결과1.data.다음페이지번호;

                // 다음 줄거리를 페이지 캔버스에 업데이트
                const 페이지캔버스 = document.querySelector('.pageCanvas');
                페이지캔버스.innerHTML = 다음줄거리;

                // DOM 업데이트를 기다린 후에 작업 수행
                await nextTick();

                const canvas = await html2canvas(페이지캔버스);
                const imageData = canvas.toDataURL('image/png');
                // 두 번째 요청: 캔버스 이미지 저장
                const 결과2 = await axios.post('http://localhost:3000/save-canvas', { 선택한책고유번호, 새로운페이지번호, imageData });
                const 결과파일명 = 결과2.data.filename;
                const newSaveAsPage = process.env.BASE_URL + `books/${결과파일명}`;

                // 세 번째 요청: 가라삽화 저장
                const 결과파일명2 = await context.dispatch('API테스트액션', { 선택한책고유번호, 새로운페이지번호 });
                //const 결과3 = await axios.post('http://localhost:3000/nextImg', { 선택한책고유번호, 새로운페이지번호 });
                const newSaveAsPage2 = process.env.BASE_URL + `books/${결과파일명2}`;

                // 다음 페이지 정보 생성
                const 다음페이지 = {
                    id: 새로운페이지번호,
                    줄거리: 다음줄거리,
                    다음선택지: 다음선택지,
                    삽화: newSaveAsPage2,
                    캔버스: newSaveAsPage,
                };

                // 다음 페이지 정보를 상태에 추가
                context.commit('다음페이지정보추가', 다음페이지);
            } catch (error) {
                console.error('오류 발생:', error);
            }
        },
    },
});
