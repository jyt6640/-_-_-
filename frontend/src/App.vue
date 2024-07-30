<template>
    <div id="app" class="row">
        <div ref="pagesContainer" class="col-3 pagesContainer" style="" @click="saveAsImage">
            <!-- <img src="@/assets/logo.png" /> -->
            {{ pages }}
            {{ randomTxt }}
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
                    <button @click="addPage">페이지 추가</button>
                    <button @click="addSaveAsImage">저장한 페이지 추가</button>
                </div>
            </flipbook>
        </div>
    </div>
</template>

<script>
import Flipbook from 'flipbook-vue';
import html2canvas from 'html2canvas';

export default {
    components: {
        Flipbook,
    },
    name: 'App',
    data: () => {
        return {
            pages: [
                'https://picsum.photos/480/640?id=1',
                'https://picsum.photos/480/640?id=2',
                /*'https://picsum.photos/200/300?id=3',
                'https://picsum.photos/200/300?id=4',
                'https://picsum.photos/200/300?id=5',
                'https://picsum.photos/200/300?id=6',
                'https://picsum.photos/200/300?id=7',
                'https://picsum.photos/200/300?id=8',*/
            ],
        };
    },
    methods: {
        addPage() {
            const newId1 = this.pages.length + 1;
            const newId2 = this.pages.length + 2;
            const newPage1 = 'https://picsum.photos/480/640?id=' + newId1;
            const newPage2 = 'https://picsum.photos/480/640?id=' + newId2;
            this.pages.push(newPage1, newPage2);
        },
        async saveAsImage() {
            const element = this.$refs.pagesContainer; // pagesContainer라는 ref 속성을 가진 HTML 요소를 가져옴
            const canvas = await html2canvas(element); // 비동기로 수행, 라이브러리 사용하여 가져온 HTML 요소를 캔버스화
            const dataURL = canvas.toDataURL('image/png'); // 변환된 캔버스를 PNG 이미지로 변환
            const link = document.createElement('a'); // a 태그 요소 생성
            link.href = dataURL; // a 태그의 href에 이미지 URL 삽입
            link.download = 'pages.png'; // a태그의 다운로드에 파일 이름 설정
            link.click(); // 클릭하여 다운로드
        },
        generateRandomText() {
            const randomTexts = ['Hello World!', 'Random Text 1', 'Lorem Ipsum', 'Sample Text', 'Vue.js is awesome!', 'Random String', 'Text Generator'];
            // Math.random() 0~1 사이의 생성
            const randomIndex = Math.floor(Math.random() * randomTexts.length); // 0~1 사이의 난수를 randomTexts의 길이 (7개 = 7)만큼 곱하여 Math.floor로 소수점 버림
            this.randomTxt = randomTexts[randomIndex];
        },
        addSaveAsImage() {
            this.generateRandomText();
            const newPage3 = 'https://picsum.photos/480/640?id=' + Math.random();
            const newSaveAsPage = require('@/assets/books/pages.png');
            this.pages.push(newPage3, newSaveAsPage);
        },
    },
};
</script>

<style>
#app {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    background-color: #c6c3c3;
    color: #ccc;
}
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
.pagesContainer {
    font-size: 1rem;
    color: black;
    width: 480px;
    height: 640px;
    border: red 1px solid;
    background-image: url('@/assets/paper.jpg'); /* 타일 PNG 이미지 경로 */
    background-size: contain; /* 타일 이미지를 원래 크기로 사용 */
}
</style>
