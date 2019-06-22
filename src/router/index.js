import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
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
