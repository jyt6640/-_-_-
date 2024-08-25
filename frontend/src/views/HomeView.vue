<template>
    <div class="col">
        <div ref="pageCanvas" class="col-3 pageCanvas gaegu-bold" style="padding-top: 80px; padding-left: 30px; padding-right: 20px">
            <!-- @click="saveAsImage($event)" -->
            <!-- <img src="@/assets/logo.png" /> -->
            {{ 현재페이지줄거리 }}
        </div>
    </div>
    <div class="form-container">
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="protagonist_name">주인공 이름:</label>
                <input type="text" id="protagonist_name" v-model="formData.protagonist_name" required />
            </div>

            <div class="form-group">
                <label for="protagonist_characteristics">주인공 성격:</label>
                <input type="text" id="protagonist_characteristics" v-model="formData.protagonist_characteristics" required />
            </div>

            <div class="form-group">
                <label for="gender">Gender:</label>
                <select id="gender" v-model="formData.gender" required>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="age">Age:</label>
                <input type="number" id="age" v-model="formData.age" required />
            </div>

            <div class="form-group">
                <label for="era">시대:</label>
                <input type="text" id="era" v-model="formData.era" required />
            </div>

            <div class="form-group">
                <label for="genre">장르:</label>
                <input type="text" id="genre" v-model="formData.genre" required />
            </div>

            <div class="form-group">
                <label for="start_place">시작 장소</label>
                <input type="text" id="start_place" v-model="formData.start_place" required />
            </div>

            <div class="form-group">
                <label for="sentences_per_page">Sentences per Page:</label>
                <input type="number" id="sentences_per_page" v-model="formData.sentences_per_page" required />
            </div>

            <div class="form-group">
                <label for="choices_per_page">Choices per Page:</label>
                <input type="number" id="choices_per_page" v-model="formData.choices_per_page" required />
            </div>

            <div class="form-group">
                <label for="story_mood">Story Mood:</label>
                <input type="text" id="story_mood" v-model="formData.story_mood" required />
            </div>

            <div class="form-group">
                <label for="theme">Theme:</label>
                <input type="text" id="theme" v-model="formData.theme" required />
            </div>

            <div class="form-group">
                <label for="current_page">Current Page:</label>
                <input type="number" id="current_page" v-model="formData.current_page" required />
            </div>

            <div class="form-group">
                <label for="ending_page_count">Ending Page Count:</label>
                <input type="number" id="ending_page_count" v-model="formData.ending_page_count" required />
            </div>

            <div class="form-group">
                <label for="ending_style">엔딩 스타일</label>
                <input type="text" id="ending_style" v-model="formData.ending_style" required />
            </div>

            <button type="submit">Submit</button>
        </form>
    </div>
    <div class="row" style="color: black">
        {{ pages }}<br />
        선택한책고유번호 {{ 선택한책고유번호 }} 현재페이지번호 {{ 현재페이지번호 }} 마지막페이지번호 {{ 마지막페이지번호 }} 버튼비활성화상태 {{ 버튼비활성화상태 }}
        <br />
        이전버튼클릭잠금상태 {{ 이전버튼클릭잠금상태 }} 다음버튼클릭잠금상태 {{ 다음버튼클릭잠금상태 }} 선택지클릭잠금상태 {{ 선택지클릭잠금상태 }}
        <br />
        <p style="font-size: 12px">선택한책줄거리 {{ 선택한책줄거리 }}</p>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            formData: {
                protagonist_name: '안나',
                protagonist_characteristics: '활발',
                gender: 'female',
                age: 10,
                era: 'futuristic',
                genre: 'sci-fi adventure',
                start_place: 'a bustling space station',
                sentences_per_page: 5,
                choices_per_page: 2,
                story_mood: 'exciting',
                theme: 'friendship and courage',
                current_page: 1,
                ending_page_count: 4,
                ending_style: 'surprising',
            },
        };
    },
    computed: {
        ...mapState(['선택한책줄거리', '선택한책고유번호', '현재페이지번호', 'pages', '마지막페이지번호', '버튼비활성화상태']),
    },
    methods: {
        ...mapMutations(['현재페이지번호감소', '현재페이지번호증가']),
        ...mapActions(['다음줄거리요청액션', 'API테스트액션']),
        async handleSubmit() {
            try {
                // 폼 데이터를 콘솔에 출력
                console.log(this.formData);
                // 첫 번째 페이지에 대한 줄거리 및 삽화 요청
                const 선택한책고유번호 = this.선택한책고유번호;

                // 다음 줄거리와 삽화 생성 요청
                await this.다음줄거리요청액션({
                    선택한책고유번호,
                    다음페이지번호: 1,
                    formData: this.formData,
                });

                // Book 라우터로 이동
                this.$router.push({ name: 'BookGenerate' });
            } catch (error) {
                console.error('첫 번째 페이지 생성 중 오류 발생:', error);
            }
        },
    },
};
</script>

<style scoped>
.form-container {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input,
select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
.pageCanvas {
    font-size: 1.5vw;
    color: black;
    width: 480px;
    height: 640px;
    background-image: url('@/assets/paper.jpg'); /* 타일 PNG 이미지 경로 */
    background-size: contain; /* 타일 이미지를 원래 크기로 사용 */
    overflow: hidden; /* 넘치는 텍스트 숨김 */
    white-space: pre-wrap;
    line-break: loose; /* 한국어 문장의 자연스러운 줄바꿈 */
    word-break: keep-all; /* 어절 단위로 줄바꿈 */
    line-height: 1.5; /* 줄 간격을 1.5배로 설정 */
    letter-spacing: -0.1rem;
}
</style>
