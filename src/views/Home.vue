<template>
    <my-page title="评论" :page="page">
        <div class="common-container container">
            <ul class="comments-list">
                <li class="item" v-for="comment in comments">
                    <div class="wrap">
                        <img class="avatar" :src="comment.user.avatar" @click="viewUser(comment.user)">
                        <div class="info">
                            <div class="name">{{ comment.user.name }}</div>
                            <div class="content">{{ comment.content }}</div>

                            <div class="meta">
                                <div class="time">{{ comment.createTime | time }}</div>
                                <div class="like" @click="like(comment)">赞{{ comment.likeCount ? `(${comment.likeCount})` : '' }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-content"></div>
                    </div>
                </li>
            </ul>
            <div v-if="!this.$store.state.user">
                请<a href="#" @click.prevent="login">登录</a>后评论
            </div>
            <textarea class="form-control" v-model="content" cols="30" rows="4" :disabled="!this.$store.state.user" 
                :placeholder="this.$store.state.user ? '有何高见，发表一下' : '请登录后评论'"></textarea>
            <br>
            <ui-raised-button primary label="评论" @click="commnet" />
        </div>
        <!-- <ui-float-button class="float-button" icon="add" secondary @click="add" /> -->
    </my-page>
</template>

<script>
    import oss from '@/util/oss'
    const moment = window.moment

    export default {
        data () {
            return {
                content: '',
                comments: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com/',
                            target: '_blank',
                            title: '应用'
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
            this.loadData()
        },
        methods: {
            loadData() {
                this.$http.get('/types/test/comments').then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.comments = data
                    },
                    response => {
                        console.log(response)
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
.slogan {
    font-size: 32px;
    margin-bottom: 16px;
}
.container {
    max-width: 480px;
    // padding: 0 0 80px 0;
}
.comments-list {
    margin-bottom: 24px;
    .item {
        &:last-child {
            .line-content {
                display: none;
            }
        }
    }
    .wrap {
        display: flex;
        // align-items: center;
        // height: 56px;
        // margin-bottom: 8px;
        padding: 16px 0;
    }
    .info {
        flex-grow: 1;
    }
    .line {
        padding-left: 64px;
        // border-bottom: 1px solid rgba(0, 0, 0, .12);
        .line-content {
            background-color: rgba(0, 0, 0, .12);
            height: 1px;
        }
    }
    .name {
        color: #333;
        font-weight: bold;
        margin-bottom: 4px;
        // font-size: 16px;
    }
    .avatar {
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        margin-right: 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    .content {
        margin-bottom: 8px;
        color: #666;
    }
    .meta {
        display: flex;
        align-items: center;
        font-size: 12px;;
        color: #999;
    }
    .time {
        margin-right: 16px;
    }
    .like {
        cursor: pointer;
    }
}
textarea.form-control {
    height: auto;
}
.form-control {
    display: block;
    width: 100%;
    max-width: 400px;
    height: 33px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42;
    color: #55595c;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
}
</style>
