<template>
    <div class="form-container">
        <form @submit.prevent="첫번째페이지생성;" class="h-100">
            <div class="form-grid h-100 mt-4">
                <div class="form-group">
                    <label for="protagonist_name" class="form-label">주인공 이름</label>
                    <div class="input-container">
                        <input type="text" id="protagonist_name" v-model="formData.protagonist_name" placeholder="비워둬도 괜찮아요!" required />
                        <button type="button" class="random-button" @click="randomize('protagonist_name')">랜덤!</button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="protagonist_characteristics" class="form-label">주인공 유형</label>
                    <div class="input-container">
                        <input type="text" id="protagonist_characteristics" v-model="formData.protagonist_characteristics" required />
                        <button type="button" class="random-button" @click="randomize('protagonist_characteristics')">랜덤!</button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="start_place" class="form-label">시작 장소</label>
                    <div class="input-container">
                        <input type="text" id="start_place" v-model="formData.start_place" required />
                        <button type="button" class="random-button" @click="randomize('start_place')">랜덤!</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="gender" class="form-label">성별</label>
                    <div class="gender-options">
                        <button type="button" class="option-button" :class="{ selected: formData.gender === 'none' }" @click="formData.gender = 'none'">상관 없어요!</button><br />
                        <button type="button" class="option-button" :class="{ selected: formData.gender === 'male' }" @click="formData.gender = 'male'">남</button>
                        <button type="button" class="option-button" :class="{ selected: formData.gender === 'female' }" @click="formData.gender = 'female'">여</button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="era" class="form-label">시대</label>
                    <div class="era-options">
                        <button type="button" class="option-button" :class="{ selected: formData.era === 'none' }" @click="formData.era = 'none'">상관 없어요!</button><br />
                        <button type="button" class="option-button" :class="{ selected: formData.era === '고전' }" @click="formData.era = '고전'">고대</button>
                        <button type="button" class="option-button" :class="{ selected: formData.era === '중세' }" @click="formData.era = '중세'">중세</button>
                        <button type="button" class="option-button" :class="{ selected: formData.era === '현대' }" @click="formData.era = '현대'">현대</button><br />
                        <button type="button" class="option-button" :class="{ selected: formData.era === '4' }" @click="formData.era = '4'">미래</button>
                        <button type="button" class="option-button" :class="{ selected: formData.era === '5' }" @click="formData.era = '5'">원시</button>
                        <button type="button" class="option-button" :class="{ selected: formData.era === '6' }" @click="formData.era = '6'">신화</button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="genre" class="form-label">장르</label>
                    <div class="genre-options">
                        <button type="button" class="option-button" :class="{ selected: formData.genre === 'none' }" @click="formData.genre = 'none'">상관 없어요!</button><br />
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '일본풍' }" @click="formData.genre = '일본풍'">판타지</button>
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '한국풍' }" @click="formData.genre = '한국풍'">마법</button>
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '중국풍' }" @click="formData.genre = '중국풍'">우화</button><br />
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '1' }" @click="formData.genre = '1'">미스터리</button>
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '2' }" @click="formData.genre = '2'">고전</button>
                        <button type="button" class="option-button" :class="{ selected: formData.genre === '3' }" @click="formData.genre = '3'">자연</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="ending_page_count" class="form-label">엔딩 페이지 수</label>
                    <input type="number" id="ending_page_count" v-model="formData.ending_page_count" required />
                </div>
                <div class="form-group">
                    <div class="submit-button-container">
                        <button type="submit" class="submit-button">시작해볼까요?</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            formData: {
                protagonist_name: '',
                protagonist_characteristics: '인간',
                gender: 'none',
                age: '',
                era: 'none',
                genre: 'none',
                start_place: '집 안',
                theme: '사랑과 전쟁',
                sentences_per_page: 5,
                choices_per_page: 2,
                story_mood: 'exciting',
                current_page: 1,
                ending_page_count: 10,
                ending_style: 'bad',
            },
            randomOptions: {
                protagonist_name: ['', '용태', '명길', '지우'],
                protagonist_characteristics: ['사람', '동물', '요정', '물건'],
                start_place: ['숲속', '마을', '성'],
            },
        };
    },
    computed: {
        ...mapState(['선택한책줄거리', '선택한책고유번호', '현재페이지번호', 'pages', '마지막페이지번호', '버튼비활성화상태']),
    },
    methods: {
        ...mapMutations(['현재페이지번호감소', '현재페이지번호증가']),
        ...mapActions(['다음줄거리요청액션', 'API테스트액션']),
        randomize(field) {
            const options = this.randomOptions[field];
            if (options) {
                this.formData[field] = options[Math.floor(Math.random() * options.length)];
            }
        },
        async 첫번째페이지생성() {
            try {
                console.log(this.formData);
                const 선택한책고유번호 = this.선택한책고유번호;
                await this.다음줄거리요청액션({
                    선택한책고유번호,
                    다음페이지번호: 1,
                    formData: this.formData,
                });
                this.$router.push({ name: 'BookGenerate' });
            } catch (error) {
                console.error('첫 번째 페이지 생성 중 오류 발생:', error);
            }
        },
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');

body {
    font-family: 'Gowun Dodum', sans-serif !important;
}

.form-container {
    max-width: 50rem; /* 800px */
    margin: 0 auto;
    border-radius: 0.9375rem; /* 15px */
    padding: 1.25rem; /* 20px */
    height: auto;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.875rem 2.5rem; /* 30px 40px */
    justify-content: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.form-label {
    font-size: 1.5rem; /* 24px */
    font-weight: bold;
}

.input-container {
    display: flex;
    align-items: center;
    gap: 0.625rem; /* 10px */
    margin-top: 0.625rem; /* 10px */
}

input[type='text'],
input[type='number'] {
    padding: 0.625rem; /* 10px */
    border-radius: 0.9375rem; /* 15px */
    border: 0.0625rem solid #ccc; /* 1px */
    outline: none;
    transition: border-color 0.2s;
}

input[type='text']:focus,
input[type='number']:focus {
    border-color: #9b59b6;
}

button {
    padding: 0;
    border-radius: 1.25rem; /* 20px */
    transition: transform 0.2s, background-color 0.2s;
}

button:hover {
    transform: scale(1.1);
    background-color: #7d3c98;
}

.random-button {
    padding: 0.625rem 0.9375rem; /* 10px 15px */
    font-size: 0.875rem; /* 14px */
    background: linear-gradient(135deg, #8e44ad, #9b59b6);
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 1.25rem; /* 20px */
}

.submit-button-container {
    display: flex;
    justify-content: center;
    margin-top: 1.25rem; /* 20px */
}

.submit-button {
    padding: 0.9375rem 1.875rem; /* 15px 30px */
    font-size: 1.25rem; /* 20px */
    background: linear-gradient(135deg, #fcdbd8, #ff00e1);
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 1.875rem; /* 30px */
}

.option-button {
    padding: 0.625rem 1.25rem; /* 10px 20px */
    font-size: 1rem; /* 16px */
    cursor: pointer;
    border: 0.0625rem solid #ccc; /* 1px */
    background: linear-gradient(135deg, #cdc0d3, #9b59b6);
    color: white;
    border-radius: 1.25rem; /* 20px */
    transition: transform 0.2s, background-color 0.2s;
}

.option-button:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #221d3d, #9b59b6);
    color: white;
}

.option-button.selected {
    background: linear-gradient(135deg, #8e44ad, #6a1b9a);
    color: white;
    border-color: #8e44ad;
}
</style>
