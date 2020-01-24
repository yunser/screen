import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const ScreenDetail = resolve => require(['@/views/ScreenDetail'], resolve)
const ScreenControl = resolve => require(['@/views/ScreenControl'], resolve)
//
const Ask = resolve => require(['@/views/Ask'], resolve)
const AskControl = resolve => require(['@/views/AskControl'], resolve)
const AskDetail = resolve => require(['@/views/AskDetail'], resolve)
const AskMine = resolve => require(['@/views/AskMine'], resolve)
//
const QuestionDetail = resolve => require(['@/views/QuestionDetail'], resolve)
const QuestionEdit = resolve => require(['@/views/QuestionEdit'], resolve)
const AnswerEdit = resolve => require(['@/views/AnswerEdit'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)
const OauthCallback = resolve => require(['@/views/oauth/Callback'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        // redirect: '/simple'
        component: Home
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/asks/:id/control',
        component: AskControl
    },
    {
        path: '/asks/:id/mine',
        component: AskMine
    },
    {
        path: '/asks/:id',
        component: AskDetail
    },
    {
        path: '/screens/:id',
        component: ScreenDetail
    },
    {
        path: '/screens/:id/control',
        component: ScreenControl
    },
    {
        path: '/ask',
        component: Ask
    },
    //
    {
        path: '/questions/:id',
        component: QuestionDetail,
    },
    {
        path: '/question/add',
        component: QuestionEdit,
    },
    {
        path: '/answer/add',
        component: AnswerEdit,
    },
    {
        path: '/oauth/callback',
        component: OauthCallback
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
