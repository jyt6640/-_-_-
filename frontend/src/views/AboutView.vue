<template>
    <div class="row">
        <div class="col-3">
            <div ref="pageCanvas" class="col-3 pageCanvas gaegu-bold p-5">
                <!-- @click="saveAsImage($event)" -->
                <!-- <img src="@/assets/logo.png" /> -->
                <p class="pt-5 ps-2">{{ randomTxt }}</p>
            </div>
        </div>
        <div class="col-9">
            <flipbook class="flipbook" :pages="pages" v-slot="flipbook" :zooms="null" :flipDuration="2000" :centering="true" :dragToFlip="false" :singlePage="false">
                <div v-for="(page, index) in pages" :key="index" class="page col">
                    <h1>{{ page.title }}</h1>
                    <p>{{ page.content }}</p>
                </div>
                <div class="flipbook-head">
                    <button @click="flipbook.flipLeft">이전</button>
                    <button @click="flipbook.flipRight">다음</button>
                    <!-- <button @click="addPage">페이지 추가</button> -->
                    <button @click="다음줄거리요청()">다음페이지</button>
                </div>
            </flipbook>
        </div>
    </div>
    <div class="row" style="color: black">
        {{ pages }}
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Flipbook from 'flipbook-vue';

export default {
    components: {
        Flipbook,
    },
    name: 'App',
    computed: {
        ...mapState(['pages', 'randomTxt']),
    },
    created() {
        this.generateRandomText();
        // 키보드 이벤트 리스너 추가
        // window.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
        // 컴포넌트가 언마운트될 때 키보드 이벤트 리스너 제거
        // window.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
        ...mapActions(['saveAsImage', 'generateRandomText', '다음줄거리요청액션']),
        // handleKeyDown(event) {
        //     if (event.key === 's' || event.key === 'S') {
        //         // 's' 키를 눌렀을 때
        //         const element = this.$refs.pageCanvas;
        //         this.saveAsImage(element);
        //     }
        // },
        async 다음줄거리요청() {
            await this.다음줄거리요청액션(this.$refs.pageCanvas);
        },
    },
};
</script>

<style scoped>
.flipbook {
    width: 90vw;
    height: 90vh;
}
.flipbook-head {
    text-align: center;
}
.bounding-box {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.5);
}
.pageCanvas {
    font-size: 2rem;
    color: black;
    width: 480px;
    height: 640px;
    background-image: url('@/assets/paper.jpg'); /* 타일 PNG 이미지 경로 */
    background-size: contain; /* 타일 이미지를 원래 크기로 사용 */
    overflow: hidden; /* 넘치는 텍스트 숨김 */
    white-space: pre-wrap;
    line-break: loose; /* 한국어 문장의 자연스러운 줄바꿈 */
    word-break: keep-all; /* 어절 단위로 줄바꿈 */
    line-height: 2; /* 줄 간격을 1.5배로 설정 */
    letter-spacing: -0.1rem;
}
</style>
