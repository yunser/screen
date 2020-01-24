<template>
    <my-page title="匿名提问" :page="page">
        <div class="common-container container">
            <div :class="['text', isFullScreen ? 'full-screen' : '']" @click="clickText">{{ text }}</div>
        </div>
        <div class="status">{{ status }}</div>
        <ui-raised-button @click="openUrl">打开链接</ui-raised-button>
        <ui-raised-button @click="openMine">我要提问</ui-raised-button>
        <ui-raised-button @click="openControl">打开控制界面</ui-raised-button>
        <div class="qrcode">
            <img :src="qrcodeUrl">
        </div>
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
                code: '',
                comments: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'fullscreen',
                            click: this.fullScreen,
                            title: '全屏'
                        },
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/c173ca902fc711ea9ea36110fb61a9f5',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            let url = window.location.origin + `/screens/${this.code}`
            this.qrcodeUrl = `https://nodeapi.yunser.com/qrcode?content=${encodeURIComponent(url)}`
            //
            this.initWebSocket()
        },
        methods: {
            openUrl() {
                let url = `/asks/${this.code}`
                window.open(url, '_blank')
            },
            openMine() {
                let url = `/asks/${this.code}/mine`
                window.open(url, '_blank')
            },
            openControl() {
                let url = `/asks/${this.code}/control`
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
                let code = this.$storage.get('screenCode')
                if (!code) {
                    code = '' + new Date().getTime() + Math.ceil(Math.random() * 1000)
                    this.$storage.set('screenCode', code)
                }
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
                        }
                    })
                })
                this.socket.on('connect_failed', id => {
                    this.status = '连接失败'
                })
            },
            commnet() {
                if (!this.$store.state.user) {
                    this.$message({
                        type: 'danger',
                        text: '请先登录'
                    })
                    return
                }
                if (!this.content) {
                    this.$message({
                        type: 'danger',
                        text: '请输入内容'
                    })
                    return
                }
                this.$http.post(`/types/test/comments`, {
                    content: this.content,
                }).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.content = ''
                        this.loadData()
                    },
                    res => {
                        this.$message({
                            type: 'danger',
                            text: res.msg
                        })
                    })
                // this.$router.push('/question/add')
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
.status {
    position: absolute;
    right: 16px;
    top: 80px;
    color: #999;
}
.text {
    font-size: 56px;
    padding: 240px 0;
    text-align: center;
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
