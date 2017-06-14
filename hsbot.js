module.exports = {

    showWelcomeText: function (event, userProfile) {
        event.reply({ type: 'text', text: '哈囉，' + userProfile.displayName + ' 歡迎使用HOMESEEN-失智活動小幫手，每週替您收集適合您的活動！\n\n\n請問您在新北市的哪一區呢？請用文字回答，例：板橋' })
    },

    askLocation: function (event) {
        event.reply({ type: 'text', text: '請問您在新北市的哪一區呢？請用文字回答，例：板橋' });
    },

    showComingSoonText: function (event, userProfile) {
        event.reply({ type: 'text', text: '哎呀' + userProfile.displayName + ' 很抱歉，我們目前尚未開放您的區域，我們會立即將您的所在地列入下一個搜尋目標，有消息馬上推播給您，敬請期待 :) ' })
    },

    showApplyInfo: function (event, applyText) {
        event.reply({ type: 'text', text: '請聯絡：' + applyText })
    },

    getActivitiesWithButtons: function (event, userProfile, zone, activities) {
        var username = userProfile.displayName
        event.reply({
            type: 'template',
            altText: '哈囉, ' + userProfile.displayName,
            template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://image.ibb.co/k9OVLk/HOMESEEN_sticker_300.png',
                title: '親愛的' + userProfile.displayName + '，這是本月在' + zone + '開的課程：',
                text: '請選擇您想報名的課程',
                actions: [{
                    type: 'postback',
                    label: activities[0].name,
                    data: 'subsidy'
                }, {
                    type: 'postback',
                    label: activities[1].name,
                    data: 'tools'
                }, {
                    type: 'postback',
                    label: activities[2].name,
                    data: 'care_method'
                }]
            }
        })
    },

    getActivityColumns: function (activities) {
        return
    },

    showActivitiesInCarousel: function (event, userProfile, zone, activities) {
        var username = userProfile.displayName

        console.log('(Carousel) ' + username)

        if (!activities) {
            console.log('(Carousel) ' + activities[0].name + " / " + activities[0].content)
        }

        // for (var activity of activities) {
        //     console.log(activity.name + '/' + activity.content)
        // }

        event.reply({
            type: 'template',
            altText: '親愛的' + userProfile.displayName + '，這是本月在' + zone + '開的課程：',
            template: {
                type: 'carousel',
                columns: [
                    {
                        thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
                        title: activities[0].name,
                        text: activities[0].content,
                        actions: [{
                            type: 'uri',
                            label: '詳細資料',
                            uri: 'https://goo.gl/MAhiuo'
                        }, {
                            type: 'postback',
                            label: '我要報名',
                            data: activities[0].apply.toString()
                        }]
                    }, {
                        thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
                        title: activities[1].name,
                        text: activities[1].content,
                        actions: [{
                            type: 'uri',
                            label: '詳細資料',
                            uri: 'https://goo.gl/MAhiuo'
                        }, {
                            type: 'postback',
                            label: '我要報名',
                            data: activities[1].apply.toString()
                        }]
                    }
                ]
            }
        })
    },



    chooseFeature: function (bot, event) {
        if (event.message.type = 'text') {
            var msg = event.message.text
            event.reply(msg).then(function (data) {
                // success 
                console.log(msg)
            }).catch(function (error) {
                // error 
                console.log('error')
            })
        }
    }
}