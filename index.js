var linebot = require('linebot')
var express = require('express')
var hsBOT = require("./hsbot.js")
var hsDataHelper = require("./dataHelper.js")
var pg = require('pg')
var pgClient

const TPE_ZONE_ARRAY = ["中正", "中正區", "大同", "大同區", "中山", "中山區", "松山", "松山區", "大安", "大安區", "萬華", "萬華區", "信義", "信義區", "士林", "士林區", "北投", "北投區",
    "內湖", "內湖區", "南港", "南港區", "文山", "文山區"]

const NEWTPE_ZONE_ARRAY = ["萬里區", "萬里", "金山", "金山區", "板橋", "板橋區", "汐止區", "汐止", "深坑區", "深坑", "石碇區", "石碇", "瑞芳區", "瑞芳",
    "平溪區", "平溪", "雙溪區", "雙溪", "貢寮區", "貢寮", "新店區", "新店", "坪林區", "坪林", "烏來區", "烏來", "永和區", "永和", "中和區", "中和", "土城區", "土城", "三峽區", "三峽",
    "樹林區", "樹林", "鶯歌區", "鶯歌", "三重區", "三重", "新莊區", "新莊", "泰山區", "泰山", "林口區", "林口", "蘆洲區", "蘆洲", "五股區", "五股", "八里區", "八里", "淡水區", "淡水",
    "三芝區", "三芝", "石門區", "石門區"]


pg.defaults.ssl = true
pg.connect(process.env.DATABASE_URL, function (err, client) {
    if (err) throw err
    console.log('Connected to postgres! Getting schemas...')

    pgClient = client
    // pgClient.query('SELECT * FROM activity')
    //     .on('row', function (row) {
    //         console.log(JSON.stringify(row));
    //     });
})

var bot = linebot({
    channelId: CHANNEL_ID,
    channelSecret: CHANNEL_SECRET,
    channelAccessToken: CHANNEL_ACCESS_TOKEN
})


bot.on('follow', function (event) {
    console.log('(on follow) ', event)
    event.source.profile().then(function (profile) {
        userProfile = profile
        hsDataHelper.checkIfUserExist(pgClient, userProfile, function (isExist) {
            if (isExist === false) {
                hsDataHelper.saveUser(pgClient, userProfile)
                hsBOT.showWelcomeText(event, userProfile)
            }
        })
    })
})


bot.on('message', function (event) {
    var userProfile
    event.source.profile().then(function (profile) {
        userProfile = profile
        hsDataHelper.checkIfUserExist(pgClient, userProfile, function (isExist) {
            console.log('(on message) isExist', isExist)

            if (isExist === false) {
                hsDataHelper.saveUser(pgClient, userProfile)
                hsBOT.showWelcomeText(event, userProfile)
            } else {
                var zone = event.message.text
                var containZone = checkZone(zone)
                console.log('(on message) ' + zone + 'containLocation ' + containZone)

                if (containZone === true) {
                    // query activities with location
                    hsDataHelper.findActivities(pgClient, zone, function (activities) {
                        // reply carousel to user
                        hsBOT.showActivitiesInCarousel(event, userProfile, zone, JSON.parse(activities))
                    })

                } else {
                    hsBOT.showComingSoonText(event, userProfile)
                }
            }
        })
    })
})

function getIndex(str) {
    return str.split('=')[1];
}

function checkZone(zone) {
    return (TPE_ZONE_ARRAY.includes(zone) || NEWTPE_ZONE_ARRAY.includes(zone))
}

bot.on('postback', function (event) {
    console.log('(postback) ', event)
    hsBOT.showApplyInfo(event, event.postback.data)

})

bot.on('unfollow', function (event) {
    console.log('unfollow! ', event)
})

bot.on('leave', function (event) {
    console.log('leave! ', event)
})

const app = express()
const linebotParser = bot.parser()
app.post('/', linebotParser)

// chagnge default port from express (3000) to heroku(8080)
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port
    console.log("App now running on port", port)
})