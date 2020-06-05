<template>
    <div :class="['box', sizeClass]">
        <div class="controlBar">
            <div class="controlBox">
                <div class="cellRow">
                    <div class="ceil row2 col2"></div>
                    <div class="ceil row2 col2 iconBtn">
                        <i class="material-icons icon" @click="gotoMusic">music_note</i>
                    </div>
                </div>
                <div class="cellRow mb">
                    <div class="row2 col2 mr">
                        <div class="cellRow">
                            <div class="ceil"></div>
                            <div class="ceil white darkBtn">
                                <i class="material-icons icon">brightness2</i>
                            </div>
                        </div>
                        <div class="cellRow emptyCell">
                            <div class="ceil row2 battery">
                                <div class="content2" :style="{width: battery + '%'}"></div>
                                <i class="material-icons icon fixedBtnRow" v-if="charging">battery_charging_full</i>
                                <i class="material-icons icon fixedBtnRow" v-else>battery_std</i>
                            </div>
                        </div>
                    </div>
                    <div class="row2 col2">
                        <div class="cellRow emptyCell">
                            <div class="ceil col2 battery">
                                <div class="content" style="height: 40%"></div>
                                <i class="material-icons icon fixedBtn">flare</i>
                            </div>
                            <div class="ceil col2 battery">
                                <div class="content" style="height: 80%"></div>
                                <i class="material-icons icon fixedBtn">volume_mute</i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cellRow">
                    <div class="ceil iconBtn" @click="gotoHelp">
                        <i class="material-icons icon">help</i>
                    </div>
                    <div class="ceil iconBtn" @click="gotoSearch">
                        <i class="material-icons icon">search</i>
                    </div>
                    <div class="ceil iconBtn" @click="gotoHome">
                        <i class="material-icons icon">home</i>
                    </div>
                    <div class="ceil iconBtn" @click="gotoApp">
                        <i class="material-icons icon">apps</i>
                    </div>
                </div>
                <div class="cellRow">
                    <div class="ceil"></div>
                    <div class="ceil"></div>
                    <div class="ceil"></div>
                </div>
            </div>
        </div>
        <div class="widgetList">
            <div class="widget iframeBox" v-for="plugin in plugins">
                <iframe class="iframe" :src="plugin.url" frameborder="0"></iframe>
            </div>
            <!-- <div class="widget todoBox">
                <h2 class="widgetTitle">代办</h2>
                <ul class="list">
                    <li class="item">事项1</li>
                    <li class="item">事项2</li>
                    <li class="item">事项3</li>
                </ul>
            </div> -->
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import oss from '@/util/oss'
    import config from '@/config'
    const moment = window.moment

    export default {
        data () {
            return {
                plugins: [
                    {
                        id: '1',
                        url: 'https://time.yunser.com/time/plugin',
                    },
                    {
                        id: '2',
                        url: 'https://time.yunser.com/stopWatchSm',
                    },
                    {
                        id: '3',
                        url: 'https://time.yunser.com/goOffWork',
                    },
                    {
                        id: '4',
                        url: 'https://chinese.yunser.com/saying/plugin',
                    },
                ],
                time: null,
                charging: false,
                battery: 0,
                qrcodeUrl: '',
                isFullScreen: false,
                text: '',
                status: '未连接',
                code: '',
                comments: [],
                sizeClass: '',
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
                            icon: 'apps',
                            href: 'https://app.yunser.com/',
                            target: '_blank',
                            title: '应用'
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

            navigator.getBattery().then(battery => {
                // 是否正在充电，yes-充电
                console.log("Battery charging? " + (battery.charging ? "yes" : "no"));
                this.battery = battery.level * 100
                this.charging = battery.charging
        
                battery.addEventListener('chargingchange', () => {
                    this.charging = battery.charging
                })
        
                battery.addEventListener('levelchange', () => {
                    this.battery = battery.level * 100
                })
            })

            // true为连接成功
            console.log("网络状态："+window.navigator.onLine)
            window.addEventListener("offline", function(e) {
                console.log("offline")
            });
        
            window.addEventListener("online", function(e) {
                console.log("online")
            })

            this.updateTime()
            this.timer = setInterval(() => {
                this.updateTime()
            })

            this.text = this.$storage.get('saying', '') || '<点击编辑文字>'
            this.initSize()
            window.addEventListener('resize', this.initSize)

            document.title = '小屏幕'
        },
        destroyed() {
            this.timer && clearInterval(this.timer)
            window.removeEventListener('resize', this.initSize)
        },
        methods: {
            initSize() {
                if (document.body.clientWidth < 400 || document.body.clientHeight < 400) {
                    this.sizeClass = 'smallBox'
                } else {
                    this.sizeClass = 'largeBox'
                }
            },
            updateTime() {
                function offset(zone) {
                    let num = parseInt(zone.replace('+', ''))
                    return num - 8
                }
                this.time = {
                    time: moment().format('HH:mm'),
                    week: ['日', '一', '二', '三', '四', '五', '六'][moment().day()],
                    date: moment().format('M 月 D 日'),
                }
            },
            editSaying() {
                let ret = prompt('输入修改内容')
                if (!ret) {
                    return
                }
                this.text = ret
                this.$storage.set('saying', this.text)
            },
            gotoHelp() {
                window.open('https://project.yunser.com/products/041ec330655211eab00fdfae25c3a48b', '_blank')
            },
            gotoSearch() {
                window.open('https://search.yunser.com', '_blank')
            },
            gotoHome() {
                window.open('https://www.yunser.com', '_blank')
            },
            gotoApp() {
                window.open('https://app.yunser.com', '_blank')
            },
            gotoMusic() {
                window.open('https://music.163.com', '_blank')
            },
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
                        this.text = text
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
.iframeBox {
    padding: 0 !important;
    .iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
}
.saying {
    font-size: 48px;
    cursor: pointer;
}
.smallBox {
    .saying {
        font-size: 24px;
        cursor: pointer;
    }
}
.controlBar {
    position: fixed;
    top: 16px;
    right: 16px;
    width: 48px;
    height: 16px;
    background: rgba(255, 255, 255, .6);
    border-radius: 8px;
    &:hover {
        .controlBox {
            display: block;
        }
    }
}
.controlBox {
    display: none;
    position: fixed;
    top: 16px;
    right: 16px;
    width: 336px;
    // height: 600px;
    background: rgba(200, 200, 200, .8);
    border-radius: 8px;
    padding: 16px 0 0 16px;
    z-index: 100000000;
    .cellRow {
        display: flex;
        // justify-content: space-between;
    }
    .ceil {
        position: relative;
        width: 64px;
        height: 64px;
        flex-shrink: 0;
        margin-right: 16px;
        margin-bottom: 16px;
        background: rgba(0, 0, 0, .86);
        border-radius: 8px;
    }
    .emptyCell {
        flex-shrink: 0;
        // margin-right: 16px;
        // margin-bottom: 16px;
    }
    .row2 {
        width: 144px;
    }
    .col2 {
        height: 144px;
    }
    .mr {
        margin-right: 16px;
    }
    .mb {
        margin-bottom: 16px;
    }
    .white {
        background: #fff;
    }
}
.fixedBtn {
    position: absolute;
    bottom: 8px;
    left: 0;
    text-align: center;
    width: 100%;
    color: #ccc;
    font-size: 32px;
}
.fixedBtnRow {
    position: absolute;
    left: 8px;
    top: 50%;
    margin-top: -16px;
    text-align: center;
    // width: 100%;
    color: #ccc;
    font-size: 32px;
}
.battery {
    // height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .content {
        height: 50%;
        background: #fff;
        color: #666;
    }
    .content2 {
        // height: 50%;
        height: 100%;
        background: #fff;
        color: #666;
    }
}
.iconBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon {
        font-size: 32px;
    }
}
.box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // height: 100%;
    background: #000;
    color: #fff;
    .help {
        position: absolute;
        top: 16px;
        right: 16px;
    }
}
.darkBtn {
    .icon {
    width: 100%;
        color: #000;
    }
}
.widgetList {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    .widget {
        min-width: 300px;
        width: 50%;
        height: 50%;
        border-right: 1px solid #333;
        border-bottom: 1px solid #333;
        padding: 32px;
    }
    .widgetTitle {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
    }
}
.smallBox {
    // padding-bottom: ;
    .widgetTitle {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
    }
}

.largeBox {
    .timeBox {
        padding-top: 32px;
        padding-left: 32px;
        .day {
            font-size: 32px;
        }
        .time {
            font-size: 96px;
        }
    }
}
.smallBox {
    .timeBox {
        padding-top: 24px;
        padding-left: 24px;
        .day {
            font-size: 24px;
        }
        .time {
            font-size: 56px;
        }
    }
}
.todoBox {
    .list {
        padding-left: 16px;
    }
    .item {
        list-style: disc;
        font-size: 20px;
        margin-bottom: 8px;
    }
}
.smallBox {
    .todoBox {
        padding: 24px;
    }
    .list {
        padding-left: 16px;
        .item {
            list-style: disc;
            font-size: 16px;
            margin-bottom: 4px;
        }
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
