<template>
    <div id="app">
        <flipbook class="flipbook" :pages="pages" v-slot="flipbook" :zooms="null" :flipDuration="2000" :centering="true" :dragToFlip="false" :singlePage="false">
            <div v-for="(page, index) in pages" :key="index" class="page">
                <h1>{{ page.title }}</h1>
                <p>{{ page.content }}</p>
            </div>
            <div class="flipbook-head">
                <button @click="flipbook.flipLeft">이전</button>
                <button @click="flipbook.flipRight">다음</button>
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
                'https://picsum.photos/300/500?id=1',
                'https://picsum.photos/300/300?id=2',
                'https://picsum.photos/200/300?id=3',
                'https://picsum.photos/200/300?id=4',
                'https://picsum.photos/200/300?id=5',
                'https://picsum.photos/200/300?id=6',
                'https://picsum.photos/200/300?id=7',
                'https://picsum.photos/200/300?id=8',
            ],
        };
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
    background-color: #333;
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
