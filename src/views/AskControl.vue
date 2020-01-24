<template>
    <my-page title="提问控制端" :page="page">
        <div class="common-container container">
            <div :class="['text', isFullScreen ? 'full-screen' : '']" @click="clickText">{{ text }}</div>
            <ui-text-field v-model="formData.text" label="内容" multiLine :rows="3" :rowsMax="6"/>
            <br />
            <ui-raised-button primary @click="send">发送</ui-raised-button>
            <div class="qrcode">
                <img :src="qrcodeUrl">
            </div>
            <div>所有提问</div>
            <div class="" v-if="!questions.length">没有人提问</div>
            <div class="list">
                <div class="item" v-for="item in questions">
                    <div class="title">{{ item.title }}</div>
                    <ui-raised-button primary @click="use(item)">使用</ui-raised-button>
                </div>
            </div>
        </div>
        <div class="status">{{ status }}</div>
    </my-page>
</template>

<script>
    import oss from '@/util/oss'
    import config from '@/config'
    const moment = window.moment

    export default {
        data () {
            return {
                qrcodeUrl: '',
                isFullScreen: false,
                text: 'Hello',
                status: '未连接',
                formData: {
                    text: '123',
                },
                code: '',
                comments: [],
                questions: [
                    {
                        title: '这是什么'
                    },
                    {
                        title: '这是什么2'
                    },
                ],
                page: {
                    menu: [
                    ]
                }
            }
        },
        mounted() {
            let url = window.location.origin + `/screens/${this.code}/control`
            this.qrcodeUrl = `https://nodeapi.yunser.com/qrcode?content=${encodeURIComponent(url)}`
            //
            this.initWebSocket()
        },
        methods: {
            openUrl() {
                let url = `/screens/${this.code}`
                window.open(url, '_blank')
            },
            openControl() {
                let url = `/screens/${this.code}/control`
                window.open(url, '_blank')
            },
            clickText() {
                if (this.isFullScreen) {
                    this.isFullScreen = false
                }
            },
            fullScreen() {
                this.isFullScreen = true
            },
            initWebSocket() {
                let code = this.$route.params.id
                // let code = this.$storage.get('screenCode')
                // if (!code) {
                //     code = '' + new Date().getTime() + Math.ceil(Math.random() * 1000)
                //     this.$storage.set('screenCode', code)
                // }
                console.log('code', code)
                this.status = '正在链接'
                this.socket = window.io.connect(config.ws, {
                    transports: ['websocket', 'xhr-polling', 'jsonp-polling']
                })
                this.socket.on('connect', id => {
                    this.status = '连接成功，正在初始化'
                    this.socket.emit('code', code)
                    this.status = `code：${code}`
                    this.code = code
                    this.socket.on('text', text => {
                        console.log('on text', text)
                        let data = JSON.parse(text)
                        if (data.type === 'question') {
                            this.text = data.data
                        } else if (data.type === 'question2') {
                            this.questions.push({
                                title: data.data
                            })
                        }
                    })
                })
                this.socket.on('connect_failed', id => {
                    this.status = '连接失败'
                })
            },
            send() {
                if (!this.formData.text) {
                    this.$message({
                        type: 'danger',
                        text: '请输入内容'
                    })
                    return
                }
                this.submit(this.formData.text)
                // this.$router.push('/question/add')
            },
            use(item) {
                this.submit(item.title)
            },
            submit(text) {
                this.$http.get(`/screens/${this.code}?text=${JSON.stringify({
                    type: 'question',
                    data: text
                })}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        // this.content = ''
                        // this.loadData()
                    },
                    res => {
                        this.$message({
                            type: 'danger',
                            text: res.msg
                        })
                    })
            },
            like(comment) {
                this.$http.post(`/comments/${comment.id}/likes`, {
                    content: this.content,
                }).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.loadData()
                    },
                    res => {
                        console.log('错误了', res)
                        // this.loading = false
                        this.$message({
                            type: 'danger',
                            text: res.msg
                        })
                    })
            },
            login() {
                location.href = oss.getOauthUrl()
            },
            viewUser(user) {
                window.open(`https://home.yunser.com/users/${user.id}`)
            }
        },
        filters: {
            time(value) {
                return moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    }
</script>

<style lang="scss" scoped>
.list {
    .item {
        padding: 8px 0;
        border-bottom: 1px solid #000;
    }
}

.status {
    position: absolute;
    right: 16px;
    top: 80px;
    color: #999;
}
.text {
    font-size: 56px;
    padding: 120px 0;
    text-align: center;
    border: 1px solid #000;
    border-radius: 8px;
}
.container {
    max-width: 480px;
    // padding: 0 0 80px 0;
}
.full-screen {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10000000;
    background-color: #fff;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
</style>
