<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style>
#app {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    background-color: #c5c3c6;
    color: #cccccc;
}
.gaegu-bold {
    font-family: 'Gaegu', sans-serif;
    font-weight: 700;
    font-style: normal;
}

.gaegu-regular {
    font-family: 'Gaegu', sans-serif;
    font-weight: 400;
    font-style: normal;
}

.gaegu-light {
    font-family: 'Gaegu', sans-serif;
    font-weight: 300;
    font-style: normal;
}
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(1) {
    border-radius: 15px 0 0 15px;
}
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(2) {
    border-radius: 0 15px 15px 0;
}
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
    border-radius: 15px 15px 15px;
}
</style>
