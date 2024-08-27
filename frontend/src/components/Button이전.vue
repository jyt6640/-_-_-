<template>
    <div>
        <div title="Button border purple" class="button btnFade btnPurple">◀</div>
        <div class="clear"></div>
    </div>
</template>
<script></script>
<style scoped>
body {
    color: #333;
    background: #ececec;
    overflow-y: scroll;
}

a,
a:visited {
    text-decoration: none;
    color: #00ae68;
}

div.button {
    font-size: 1vw;
    padding-top: 0.5vh;
    top: 2vh;
    display: block;
    position: absolute;
    left: 1.5vw;
    width: 2vw;
    height: 4.5vh;
    font-weight: 600;
    text-align: center;
    color: #fff;
    border-radius: 1vw;
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

.btnFloat:before {
    content: 'Float';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 30vw;
    height: 5vh;
    border-radius: 1vw;
    transition: all 0.2s;
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
/* FADE */
.btnFade.btnBlueGreen:hover {
    background: #21825b;
}

.btnFade.btnLightBlue:hover {
    background: #01939a;
}

.btnFade.btnOrange:hover {
    background: #ff8e00;
}

.btnFade.btnPurple:hover {
    background: #6d184b;
}
</style>
