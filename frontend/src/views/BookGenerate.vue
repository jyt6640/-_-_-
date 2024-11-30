<template>
    <div v-if="다음줄거리로딩상태 == true" style="position: absolute; top: 50vh; left: 50vw; z-index: 3">
        <BookLoader />
    </div>
    <div class="row g-0 align-itmes-center justify-content-center" style="z-index: 1">
        <div class="col" style="position: absolute; left: -9999px">
            <div ref="pageCanvas" class="col-3 pageCanvas gaegu-bold" style="padding-top: 80px; padding-left: 30px; padding-right: 20px">
                <!-- @click="saveAsImage($event)" -->
                <!-- <img src="@/assets/logo.png" /> -->
                {{ 현재페이지줄거리 }}
            </div>
        </div>
        <div class="col">
            <div class="row g-0">
                <flipbook class="col flipbook" :pages="pages" v-slot="flipbook" :zooms="null" :flipDuration="2000" :centering="true" :dragToFlip="false" :singlePage="false">
                    <!-- <div v-for="(page, index) in pages" :key="index" class="page col">
                        <h1>{{ page.title }}</h1>
                        <p>{{ page.content }}</p>
                    </div> -->
                    <div class="flipbook-head" style="position: absolute; top: 10vh; z-index: 2">
                        <transition name="fade">
                            <Button이전 v-if="!버비활성화상태 && 현재페이지번호 != 1 && 이전버튼클릭잠금상태 == false" @click="이전(flipbook)" :disabled="버튼비활성화상태 == true" />
                        </transition>
                        <transition name="fade">
                            <Button다음 v-if="!버튼비활성화상태 && 현재페이지번호 != 마지막페이지번호 && 다음버튼클릭잠금상태 == false" @click="다음(flipbook)" :disabled="버튼비활성화상태 == true" />
                        </transition>
                    </div>
                    <div class="flipbook-head">튼
                        <transition name="fade">
                            <ButtonTwo v-if="!버튼비활성화상태 && 현재페이지번호 == 마지막페이지번호 && 현재페이지번호 != 5 && 선택지클릭잠금상태 == false" @click="선택지(flipbook, 0)" :선택지="선택한책줄거리[현재페이지번호 - 1].다음선택지[0]" :disabled="버튼비활성화상태 == true" />
                        </transition>
                        <transition name="fade">
                            <ButtonTwo
                                style="margin-top: 10vh"
                                v-if="!버튼비활성화상태 && 현재페이지번호 == 마지막페이지번호 && 현재페이지번호 != 5 && 선택지클릭잠금상태 == false"
                                @click="선택지(flipbook, 1)"
                                :선택지="선택한책줄거리[현재페이지번호 - 1].다음선택지[1]"
                                :disabled="버튼비활성화상태 == true"
                            />
                        </transition>
                    </div>
                </flipbook>
            </div>
        </div>
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
import Flipbook from 'flipbook-vue';
import BookLoader from '@/components/BookLoader.vue';
import ButtonTwo from '@/components/ButtonTwo.vue';
import Button이전 from '@/components/Button이전.vue';
import Button다음 from '@/components/Button다음.vue';

export default {
    components: {
        Flipbook,
        BookLoader,
        ButtonTwo,
        Button이전,
        Button다음,
    },
    name: 'App',
    computed: {
        ...mapState(['formData', '선택한책줄거리', '선택한책고유번호', '현재페이지번호', 'pages', '마지막페이지번호', '버튼비활성화상태']),
        현재페이지줄거리() {
            if (this.현재페이지번호 > 0) {
                const 현재페이지 = this.선택한책줄거리.find((page) => page.id === this.현재페이지번호);
                return 현재페이지 ? 현재페이지.줄거리 : '';
            }
            return '';
        },
    },
    data() {
        return {
            다음줄거리로딩상태: false,
            이전버튼클릭잠금상태: false,
            다음버튼클릭잠금상태: false,
            선택지클릭잠금상태: false,
        };
    },
    created() {
        // Vuex 상태에 이미 존재하는 첫 번째 페이지를 가져와 렌더링
        if (this.현재페이지번호 > 0 && this.선택한책줄거리.length > 0) {
            const 현재페이지 = this.선택한책줄거리.find((page) => page.id === this.현재페이지번호);
            if (현재페이지) {
                this.$nextTick(() => {
                    const 페이지캔버스 = this.$refs.pageCanvas;
                    페이지캔버스.innerHTML = 현재페이지.줄거리;
                });
            }
        }
    },
    beforeUnmount() {},
    methods: {
        ...mapMutations(['현재페이지번호감소', '현재페이지번호증가']),
        ...mapActions(['다음줄거리요청액션', 'API테스트액션', '선택지에따른다음줄거리요청액션']),
        async API테스트() {
            this.API테스트액션({
                선택한책고유번호: this.선택한책고유번호, // 파라미터로 액션에 전달
                다음페이지번호: this.현재페이지번호 + 1, // 파라미터로 액션에 전달
            });
        },

        async 이전(flipbook) {
            if (this.현재페이지번호 == 0 || this.이전버튼클릭잠금상태) {
                return;
            } else {
                this.이전버튼클릭잠금상태 = true; // 잠금 상태 활성화
                this.다음버튼클릭잠금상태 = true; // 잠금 상태 활성화
                this.현재페이지번호감소();
                await new Promise((resolve) => setTimeout(resolve, 500));

                this.$store.commit('버튼비활성화상태변경', true);
                flipbook.flipLeft();
                await new Promise((resolve) => setTimeout(resolve, 2500));

                this.$store.commit('버튼비활성화상태변경', false);
                await new Promise((resolve) => setTimeout(resolve, 500)); // 추가적인 딜레이
                this.이전버튼클릭잠금상태 = false; // 잠금 상태 해제
                this.다음버튼클릭잠금상태 = false; // 잠금 상태 해제
            }
        },

        async 다음(flipbook) {
            if (this.다음버튼클릭잠금상태) {
                return; // 버튼이 잠금 상태일 때는 아무 작업도 하지 않음
            } else {
                this.다음버튼클릭잠금상태 = true; // 잠금 상태 활성화
                this.이전버튼클릭잠금상태 = true; // 잠금 상태 활성화
                this.선택지클릭잠금상태 = true; // 잠금 상태 활성화
                // 만약 현재 페이지가 마지막 페이지가 아닐경우, 다른 액션 없이 다음 페이지로만 이동
                this.현재페이지번호증가();
                await new Promise((resolve) => setTimeout(resolve, 500));

                this.$store.commit('버튼비활성화상태변경', true);
                flipbook.flipRight();
                await new Promise((resolve) => setTimeout(resolve, 2500)); // 두번째 await - 2.5초 기다림

                this.$store.commit('버튼비활성화상태변경', false);
                await new Promise((resolve) => setTimeout(resolve, 500)); // 추가적인 딜레이
                this.다음버튼클릭잠금상태 = false; // 잠금 상태 해제
                this.이전버튼클릭잠금상태 = false; // 잠금 상태 해제
                this.선택지클릭잠금상태 = false; // 잠금 상태 해제
            }
        },

        async 선택지(flipbook, 선택한것) {
            if (this.다음버튼클릭잠금상태) {
                return; // 버튼이 잠금 상태일 때는 아무 작업도 하지 않음
            }
            this.다음버튼클릭잠금상태 = true; // 잠금 상태 활성화
            this.이전버튼클릭잠금상태 = true; // 잠금 상태 활성화
            this.$store.commit('버튼비활성화상태변경', true);
            const 선택한선택지 = this.선택한책줄거리[this.현재페이지번호 - 1].다음선택지[선택한것];
            console.log(선택한선택지);

            if (this.현재페이지번호 === this.마지막페이지번호) {
                // 만약 현재 페이지가 마지막 페이지일경우, 다음 줄거리 + 삽화 새로 요청
                this.다음줄거리로딩상태 = true;
                await this.선택지에따른다음줄거리요청액션({
                    // 첫번째 await - 다음줄거리요청액션이 이행될때까지 기다림
                    선택한책고유번호: this.선택한책고유번호, // 파라미터로 액션에 전달
                    다음페이지번호: this.현재페이지번호 + 1, // 파라미터로 액션에 전달
                    현재페이지줄거리: this.선택한책줄거리[this.현재페이지번호 - 1].줄거리,
                    선택한선택지: 선택한선택지,
                });
                this.다음줄거리로딩상태 = false;
            } else {
                // 만약 현재 페이지가 마지막 페이지가 아닐경우, 다른 액션 없이 다음 페이지로만 이동
                this.현재페이지번호증가();
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            flipbook.flipRight();
            await new Promise((resolve) => setTimeout(resolve, 2500)); // 두번째 await - 2.5초 기다림

            this.$store.commit('버튼비활성화상태변경', false);
            this.다음버튼클릭잠금상태 = false; // 잠금 상태 해제
            this.이전버튼클릭잠금상태 = false; // 잠금 상태 해제
        },
    },
};
</script>

<style scoped>
.flipbook {
    width: 68vw;
    height: 80vh;
}
.flipbook-head {
    position: absolute;
    top: 66%;
    left: 50%;
    z-index: 2;
    text-align: center;
    width: 32vw;
}

.pageCanvas {
    font-size: 1.3vw;
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
/* 하단부터 설정 X */
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-active {
    transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-leave-to {
    opacity: 0;
}
.loader {
    font-size: 10px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    -webkit-animation: load5 1.1s infinite ease;
    animation: load5 1.1s infinite ease;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
}
@-webkit-keyframes load5 {
    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
    }
    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
    }
    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff,
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
            -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
    }
}
@keyframes load5 {
    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
    }
    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
    }
    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff,
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
            -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
    }
}
</style>
