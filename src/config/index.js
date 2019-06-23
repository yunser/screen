let debug = process.env.NODE_ENV !== 'production'

let imgDomain
let apiDomain
let ws
if (process.env.NODE_ENV === 'production') {
    imgDomain = 'http://120.79.29.47'
    apiDomain = 'https://nodeapi.yunser.com'
    ws = 'wss://nodeapi.yunser.com/screen'
} else {
    imgDomain = 'http://120.79.29.47'
    // apiDomain = 'http://localhost:1026'
    // ws = 'ws://localhost:1026/screen'

    apiDomain = 'https://nodeapi.yunser.com'
    ws = 'wss://nodeapi.yunser.com/screen'
}

module.exports = {
    imgDomain,
    apiDomain,
    debug,
    ws
}
