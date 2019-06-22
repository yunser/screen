<template>
    <my-page title="问题详情" :page="page">
        <div class="container">
            <div class="question-header" v-if="question">
                <div class="title">{{ question.title }}</div>
                <div class="content">{{ question.content }}</div>
                <div class="content"></div>
                <div class="meta">
                    <div class="user-name">{{ question.user.name }}</div>
                    <div class="time">{{ question.createTime | time }}</div>
                </div>
            </div>
            <div class="page-content">
                <div class="page-main">
                    <div class="header">
                        <div>{{ answers.length }} 个回答</div>
                    </div>
                    <ul class="card answer-list">
                        <li class="answer-item" v-for="answer in answers">
                            <img class="avatar" :src="answer.user.avatar">
                            <header>
                                <div class="meta">
                                    <div class="user-name">{{ answer.user.name }}</div>
                                    <div class="time">{{ answer.createTime | time }}</div>
                                </div>
                                <div>{{ answer.content }}</div>
                            </header>
                            <!-- <div>540 人赞同该回答</div> -->
                        </li>
                    </ul>
                </div>
                <div class="page-side">
                    <section class="card">
                        <header class="card-header">
                            <h2 class="title">关于作者</h2>
                        </header>
                        <div class="card-body">
                            <div class="about-user">
                                <img class="avatar" :src="question.user.avatar">
                                <div class="info">
                                    <div class="user-name">{{ question.user.name }}</div>
                                    <div class="desc">{{ question.user.description }}</div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section class="card">
                        <div class="recommend-box">
                            <a href="http://www.nicetool.net/" target="_blank">
                                <img class="recommend-image" src="/static/img/nicetool.png">
                            </a>
                            <a href="https://ad.yunser.com/" target="_blank" title="查看广告位">
                                <ui-badge class="tip" content="广告" />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <ui-float-button class="float-button" icon="add" secondary @click="add" />
    </my-page>
</template>

<script>
    import oss from '@/util/oss'
    const moment = window.moment

    export default {
        data () {
            return {
                question: null,
                answers: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'home',
                            to: '/',
                            title: '首页'
                        }
                        // {
                        //     type: 'icon',
                        //     icon: 'help',
                        //     to: '/help'
                        // }
                    ]
                }
            }
        },
        mounted() {
            let questionId = this.$route.params.id
            this.$http.get('/ask/questions/' + questionId).then(
                response => {
                    let data = response.data
                    console.log(data)
                    this.question = data
                },
                response => {
                    console.log(response)
                })
            this.$http.get('/ask/questions/' + questionId + '/answers').then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.answers = data
                    },
                    response => {
                        console.log(response)
                    })
        },
        methods: {
            add() {
                if (!this.$store.state.user) {
                    this.$message({
                        type: 'danger',
                        text: '请先登录'
                    })
                    this.login()
                    return
                }
                this.$router.push(`/answer/add?questionId=${this.$route.params.id}`)
            },
            login() {
                location.href = oss.getOauthUrl()
            },
        },
        filters: {
            time(value) {
                return moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    }
</script>

<style lang="scss" scoped>
.article-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
}
</style>
