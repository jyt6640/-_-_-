<template>
    <div class="row">
        <div class="col"></div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: 'HomeView',
    components: {},
    computed: {
        ...mapState(['선택한책줄거리', '선택한책고유번호', '현재페이지번호', 'pages', '마지막페이지번호', '버튼비활성화상태']),
    },
    methods: {
        ...mapMutations(['현재페이지번호감소', '현재페이지번호증가']),
        ...mapActions(['다음줄거리요청액션', 'API테스트액션']),
    },
    mounted() {},
    created() {},
    destroyed() {},
};
</script>