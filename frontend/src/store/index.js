import { createStore } from 'vuex';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { nextTick } from 'vue';

export default createStore({
    state: {
        선택한책고유번호: 999,
        현재페이지번호: 0,
        마지막페이지번호: 0,
        //선택한책줄거리: [{ id: 0, 줄거리: null, 삽화: 'books/1.jpg', 캔버스: 'books/2.jpg', 다음선택지: [] }],
        //pages: ['books/1.jpg', 'books/2.jpg'],
        선택한책줄거리: [],
        pages: [],
        버튼비활성화상태: false,
        formData: {},
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
        폼데이터업데이트(state, formData) {
            state.formData = formData;
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
        async 삽화생성요청(context, { 선택한책고유번호, 생성할페이지번호, stableText }) {
            try {
                const 데이터 = {
                    prompt: stableText,
                };
                const 결과 = await axios.post('http://220.69.241.62:8084/generate_image/', 데이터, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // 이미지 데이터 추출
                const imageData = 결과.data.base64_images[0];
                //console.log('API 테스트 결과:', imageData);

                // 백엔드 서버로 이미지 데이터 전송
                const 저장결과 = await axios.post(
                    'http://localhost:3000/save_image/',
                    {
                        선택한책고유번호, // 선택한 책 고유 번호
                        생성할페이지번호, // 다음 페이지 번호
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
        async 첫번째줄거리요청액션(context, { 선택한책고유번호, formData }) {
            try {
                // formData(사전설정값)을 Vuex store의 state에 저장하는 mutation
                // 각종 사전 설정값을 store에 저장해두고, 이후 페이지 생성 시에도 계속 참조
                context.commit('폼데이터업데이트', formData);

                // 첫 번째 요청: 다음 줄거리와 선택지 생성 요청하기
                const 결과1 = await axios.post('http://220.69.241.62:8083/generate_story_page/', formData);
                const 생성할페이지번호 = 1; // 첫 페이지는 항상 1
                const 다음줄거리 = 결과1.data.text;
                const 다음선택지 = 결과1.data.choices;
                const stableText = 결과1.data.stable;
                console.log(`[생성된 데이터]\n다음줄거리: ${다음줄거리}\n다음선택지: ${다음선택지}\nstableText: ${stableText}`);

                // 생성된 다음 줄거리를 페이지캔버스에 삽입하여 업데이트
                const 페이지캔버스 = document.querySelector('.pageCanvas');
                페이지캔버스.innerHTML = 다음줄거리;

                // DOM 업데이트를 기다린 후에 작업 수행
                // innerHTML 변경 후 실제 화면이 그려지기 전에 캡처하는 것을 방지
                await nextTick();

                // 생성된 줄거리로 캔버스 이미지(우측 책장) 캡처 및 생성
                const canvas = await html2canvas(페이지캔버스);
                const imageData = canvas.toDataURL('image/png');

                // 두 번째 요청: 캔버스 이미지 저장
                const 결과2 = await axios.post('http://localhost:3000/save-canvas', { 선택한책고유번호, 생성할페이지번호, imageData });
                const 결과파일명 = 결과2.data.filename;
                const newSaveAsPage = process.env.BASE_URL + `books/${결과파일명}`;

                // 세 번째 요청: 삽화(좌측 책장) 생성 요청후 저장
                const 결과파일명2 = await context.dispatch('삽화생성요청', { 선택한책고유번호, 생성할페이지번호, stableText });
                const newSaveAsPage2 = process.env.BASE_URL + `books/${결과파일명2}`;

                // 다음 페이지 정보 생성
                const 다음페이지 = {
                    id: 생성할페이지번호,
                    줄거리: 다음줄거리,
                    다음선택지: 다음선택지,
                    삽화: newSaveAsPage2,
                    캔버스: newSaveAsPage,
                };

                console.log('다음페이지 추가될 정보', 다음페이지);
                // 다음 페이지 정보를 상태에 추가
                await context.commit('다음페이지정보추가', 다음페이지);
                return;
            } catch (error) {
                console.error('오류 발생:', error);
            }
        },
        async 선택지에따른다음줄거리요청액션(context, { 선택한책고유번호, 다음페이지번호, 현재페이지줄거리, 선택한선택지 }) {
            try {
                console.log('선택한책선택지', 선택한선택지);
                const formData = context.state.formData;
                // 첫 번째 요청: 다음 줄거리와 선택지 가져오기
                const 결과1 = await axios.post('http://localhost:3000/nextTxt', { 다음페이지번호, 현재페이지줄거리, 선택한선택지, formData });
                const 다음줄거리 = 결과1.data.다음줄거리;
                const 다음선택지 = 결과1.data.다음선택지;
                const 새로운페이지번호 = 결과1.data.다음페이지번호;
                const stableText = 결과1.data.stableText;
                console.log(다음줄거리, 다음선택지, stableText);

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

                // 세 번째 요청: 삽화 생성 요청후 저장
                const 결과파일명2 = await context.dispatch('삽화생성요청', { 선택한책고유번호, 새로운페이지번호, stableText });
                const newSaveAsPage2 = process.env.BASE_URL + `books/${결과파일명2}`;

                // 다음 페이지 정보 생성
                const 다음페이지 = {
                    id: 새로운페이지번호,
                    줄거리: 다음줄거리,
                    다음선택지: 다음선택지,
                    삽화: newSaveAsPage2,
                    캔버스: newSaveAsPage,
                };

                console.log('다음페이지 추가될 정보', 다음페이지);
                // 다음 페이지 정보를 상태에 추가
                await context.commit('다음페이지정보추가', 다음페이지);
                return;
            } catch (error) {
                console.error('오류 발생:', error);
            }
        },
    },
});
