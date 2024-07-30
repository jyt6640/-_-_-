import { createStore } from 'vuex';
import axios from 'axios';
import html2canvas from 'html2canvas';

export default createStore({
    state: {
        pages: ['books/1.jpg', 'books/2.jpg'],
        randomTxt: '',
    },
    mutations: {
        SET_RANDOM_TEXT(state, text) {
            state.randomTxt = text;
        },
        ADD_PAGE(state, page) {
            state.pages.push(page);
        },
    },
    actions: {
        async saveAsImage({ commit }, element) {
            try {
                const canvas = await html2canvas(element); // html2canvas가 해결될 때까지 기다립니다.
                const imageData = canvas.toDataURL('image/png');

                const response = await axios.post('http://localhost:3000/save-image', { imageData }); // axios 요청이 해결될 때까지 기다립니다.
                console.log('이미지 저장 성공:', response.data);
                console.log('페이지가 새로고침되지 않도록 합니다.');
            } catch (error) {
                console.error('에러 발생:', error); // html2canvas 또는 axios에서 에러가 발생하면 잡아냅니다.
            }
        },
        generateRandomText({ commit }) {
            const randomTexts = [
                '옛날 옛적에 토끼 선생님이 살고 있었어요.',
                '토끼 선생님은 매일 아침 일찍 일어나 산책을 하곤 했어요.',
                '산책을 하면서 토끼 선생님은 산과 들의 아름다운 풍경을 즐기곤 했어요.',
                '어느 날 토끼 선생님은 산책을 하다가 큰 나무 밑에 앉아 쉬고 있었어요.',
                '그때 토끼 선생님은 누군가가 뒤에서 소리를 지르는 것을 들었어요.',
                '토끼 선생님은 뒤를 돌아보았어요.',
                '그러자 거북이가 뒤에서 소리치며 달려오고 있었어요.',
            ];
            const randomIndex = Math.floor(Math.random() * randomTexts.length);
            commit('SET_RANDOM_TEXT', randomTexts[randomIndex]);
        },
        addSaveAsImage({ commit, state }) {
            const newPage3 = 'https://picsum.photos/480/640?id=' + Math.random();
            const newSaveAsPage = process.env.BASE_URL + 'books/pages.png';
            commit('ADD_PAGE', newPage3);
            commit('ADD_PAGE', newSaveAsPage);
            this.dispatch('generateRandomText');
        },
    },
});
