<template>
    <router-view />
</template>

<style>
#app {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    background-color: #ffffff;
    user-select: none; /* 사용자가 텍스트를 선택할 수 없게 합니다 */
    contenteditable: false; /* 텍스트를 편집할 수 없게 합니다 */
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
    font-weight: 100;
    font-style: normal;
}

#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
    border-radius: 15px 15px 15px;
}

#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.left,
#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.right,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.left,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.right {
    display: none;
}

#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(1),
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(1) {
    border-radius: 15px 0 0 15px;
}

#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(2),
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(2) {
    border-radius: 0 15px 15px 0;
}
</style>
