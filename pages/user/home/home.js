// pages/user/home/home.js
const api = require('../../../lib/service/api');
const app = getApp();

Page({
    data: {
        userid: '',
        userinfo: {},
        daily: '',
        comment: '../../../images/Chat.png',
        like: '../../../images/Heart.png',
        delete: '../../../images/Trash_bin.png',
        mood: [
            '../../../images/Big-Smile.png',
            '../../../images/Smile.png',
            '../../../images/Strait.png',
            '../../../images/Layer-2.png',
            '../../../images/Cry-Hard.png',
            '../../../images/Yelling.png'
        ],
        weather: [
            '../../../images/ios-sunny-outline.png',
            '../../../images/ios-partlysunny-outline.png',
            '../../../images/ios-cloud-outline.png',
            '../../../images/ios-rainy-outline.png',
            '../../../images/ios-bolt-outline.png',
            '../../../images/ios-snowy.png'
        ]
    },
    onLoad: function () {
        // wx.showTabBar({
        //     // animation 为 true 时，建议在真机上看效果，工具暂不支持
        //     animation: true,
        //     success: res => {
        //         console.log('showTabBar success');
        //     },
        //     fail: err => {
        //         console.log('showTabBar fail', err);
        //     }
        // })
        // 监听页面初始化的生命周期函数
        {
            let key = 'USER_ID';
            wx.getStorage({
                key,
                success: res => {
                    const data = res.data;
                    if (data) {
                        this.setData({
                            userid: data,
                        })
                    }
                    this.getInfo();
                    this.getDaily();
                },
                fail: err => {
                    console.log('read storage failed', err);
                }
            });

        }
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        this.showinit();
        this.getDaily();
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    onError: function () {
        // 错误监听函数
    },
    scrollBottom: function () {
        this.renderDailyList();
        console.log('loading');
    },
    // 分页
    async renderDailyList() {
        let list = this.dailyList.splice(0, 10);
        if (list.length < 10) {
            // todo 到底了
        }
        let dailylist = this.data.daily.concat(list);
        await this.setData({
            daily: dailylist
        });
    },
    async showinit() {
        await this.setData({
            daily: [],
        })
    },
    async getInfo() {
        const result = await app.http.get(
            api.API_GETINFO, {
                userid: this.data.userid
            },
        );
        this.setData({
            userinfo: result.data,
        })
    },
    async getDaily() {
        let userid = this.data.userid;
        const daily = await app.http.get(
            api.API_GETDAILY, {
                userid: userid
            }
        );
        let list = daily.data;
        for (let i = 0; i < daily.data.length; i++) {
            list[i].description = list[i].description.split('&hh').join('\n');
        }
        this.dailyList = list;
        this.renderDailyList();
    },
    async delete(e) {
        // todo delete
        let id = e.currentTarget.id;
        const result = await app.http.get(
            api.API_DELETEDAILY, {
                id: id
            },
        );
        if (result.msg === "success") {
            wx.showToast({
                title: '删除成功',
                icon: 'none',
                mask: false,
                fail: err => {
                    console.log('showToast fail', err);
                }
            });
        }
        this.showinit();
        this.getDaily();
    },
    logout() {
        wx.removeStorage({
            key: 'USER_ID',
            success: res => {
                console.log('logout success')
            }
        });
        wx.removeStorage({
            key: 'USER_PASS',
            success: res => {
                console.log('logout success')
            }
        });
        wx.reLaunch({
            url: '../../index/index'
        });
    }
});