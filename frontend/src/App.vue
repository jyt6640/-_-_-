<template>
    <div id="app">
        <flipbook class="flipbook" :pages="pages" v-slot="flipbook" :zooms="null" :flipDuration="2000" :centering="true" :dragToFlip="false" :singlePage="false">
            <div v-for="(page, index) in pages" :key="index" class="page">
                <h1>{{ page.title }}</h1>
                <p>{{ page.content }}</p>
            </div>
            <div style="font-size: 1rem">
                {{ pages }}
            </div>
            <div class="flipbook-head">
                <button @click="flipbook.flipLeft">이전</button>
                <button @click="flipbook.flipRight">다음</button>
                <button @click="addPage">페이지 추가</button>
            </div>
        </flipbook>
    </div>
</template>

<script>
import Flipbook from 'flipbook-vue';

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
</style>
