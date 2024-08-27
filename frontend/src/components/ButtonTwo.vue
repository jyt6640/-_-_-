<template>
    <div title="Button border purple" class="button btnFloat btnPurple gaegu-light" style="left: 3.3vw" :data-content="buttonContent"></div>
</template>
<script>
export default {
    props: {
        선택지: {
            type: String,
            required: true,
        },
    },
    computed: {
        buttonContent() {
            return this.선택지;
        },
    },
};
</script>
<style scoped>
body {
    font-size: 10px;
    line-height: 24px;
    color: #333;
    background: #ececec;
    overflow-y: scroll;
}

.btnFloat:before {
    content: attr(data-content);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 25vw;
    height: 8vh;
    border-radius: 5px;
    transition: all 0.2s;
    font-size: 1.3vw;
    line-height: 3.4vh; /* 라인 높이 조정 */
    letter-spacing: -0.07em; /* 글자 간격 조정 */
    padding-top: 1vh;
    padding-left: 1vw;
    padding-right: 1vw;
    line-break: loose; /* 한국어 문장의 자연스러운 줄바꿈 */
    word-break: keep-all; /* 어절 단위로 줄바꿈 */
}

p {
    margin-bottom: 0.5em;
}

a,
a:visited {
    text-decoration: none;
    color: #00ae68;
}

.clear {
    clear: both;
}

.pageTitle {
    font-size: 2em;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1em;
    color: #00ae68;
}

.pageSubTitle {
    margin-bottom: 0.5em;
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1em;
    color: #222;
}

.articleTitle {
    font-size: 1.15em;
    font-weight: 700;
    line-height: 1em;
    color: #222;
}

.wrapper {
    width: 600px;
    margin: 20px auto;
}
div.button {
    display: block;
    position: relative;
    float: left;
    width: 100vw !important;
    padding: 0;
    margin: 10px 20px 10px 0;
    font-weight: 600;
    text-align: center;
    line-height: 50px;
    color: #fff;
    border-radius: 5px;
    transition: all 0.2s;
}

.btnBlueGreen {
    background: #00ae68;
}

.btnLightBlue {
    background: #5dc8cd;
}

.btnOrange {
    background: #ffaa40;
}

.btnPurple {
    background: #bb00ff;
}
/* FLOAT */
.btnFloat {
    background: none;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5);
}

.btnBlueGreen.btnFloat:before {
    background: #00ae68;
}

.btnLightBlue.btnFloat:before {
    background: #5dc8cd;
}

.btnOrange.btnFloat:before {
    background: #ffaa40;
}

.btnPurple.btnFloat:before {
    background: #bb00ff;
}

.btnFloat:before {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.4);
}

.btnFloat:hover:before {
}

.btnFloat:hover:before {
    margin-top: -2px;
    margin-left: 0px;
    transform: scale(1.1, 1.1);
    -ms-transform: scale(1.1, 1.1);
    -webkit-transform: scale(1.1, 1.1);
    box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
}
</style>
