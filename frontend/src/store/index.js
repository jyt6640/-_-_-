import { createStore } from 'vuex';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { nextTick } from 'vue';

export default createStore({
    state: {
        선택한책고유번호: 999,
        현재페이지번호: 0,
        선택한책줄거리: [{ id: 0, 줄거리: null, 삽화: 'books/1.jpg', 캔버스: 'books/2.jpg', 다음선택지: [] }],
        pages: ['books/1.jpg', 'books/2.jpg'],
    },
    mutations: {
        현재페이지번호증가(state) {
            state.현재페이지번호 += 1;
        },
        다음페이지정보추가(state, 다음페이지) {
            state.선택한책줄거리.push(다음페이지);
            this.commit('업데이트_배열');
            this.commit('현재페이지번호증가');
            console.log('선택한책줄거리', state.선택한책줄거리);
        },
        업데이트_배열(state) {
            const 마지막페이지 = state.선택한책줄거리[state.선택한책줄거리.length - 1];

            if (마지막페이지) {
                state.pages.push(마지막페이지.삽화);
                state.pages.push(마지막페이지.캔버스);

                const 다음페이지번호 = 마지막페이지.id + 1;
                const 다음페이지 = state.선택한책줄거리.find((page) => page.id === 다음페이지번호);

                if (다음페이지) {
                    state.pages.push(다음페이지.삽화);
                    state.pages.push(다음페이지.캔버스);
                }
            }
        },
    },
    actions: {
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

                // DOM 업데이트를 기다립니다.
                await nextTick();

                const canvas = await html2canvas(페이지캔버스);
                const imageData = canvas.toDataURL('image/png');
                // 두 번째 요청: 캔버스 이미지 저장
                const 결과2 = await axios.post('http://localhost:3000/save-canvas', { 선택한책고유번호, 새로운페이지번호, imageData });
                const 결과파일명 = 결과2.data.filename;
                const newSaveAsPage = process.env.BASE_URL + `books/${결과파일명}`;

                // 세 번째 요청: 가라삽화 저장
                const 결과3 = await axios.post('http://localhost:3000/nextImg', { 선택한책고유번호, 새로운페이지번호 });
                const 결과파일명2 = 결과3.data.filename;
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
