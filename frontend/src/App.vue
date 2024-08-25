<template>
    <router-view />
</template>

<style>
#app {
    width: 100%;
    height: 100%;
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

body > div > div,
#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
}

#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.left,
#app > div:nth-child(1) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.right,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.left,
#app > div:nth-child(2) > div.col-9 > div > div.viewport.drag-to-scroll > div > div.click-to-flip.right,
#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div.click-to-flip.left,
#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div.click-to-flip.right {
    display: none;
}

#app > div > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div:nth-child(2),
#app > div > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div:nth-child(3) {
    width: 100% !important;
    height: 100% !important;
}

#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
}

#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(1) {
    width: 50% !important;
    height: 100% !important;
    left: calc(100% - 100%) !important;
    top: 0% !important;
}

#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > img:nth-child(2) {
    width: 50% !important;
    height: 100% !important;
    left: calc(100% - 50%) !important;
    top: 0% !important;
}

#app > div.row.g-0.align-itmes-center.justify-content-center > div:nth-child(2) > div > div > div.viewport.drag-to-scroll > div > div:nth-child(3) > div.bounding-box {
    width: 100% !important;
    height: 100% !important;
    left: 0 !important;
    top: 0 !important;
}
</style>
