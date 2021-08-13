// pages/index/index.js
const app = getApp()
const api = require('../../lib/service/api');

Page({
    data: {
        isShow: false,
        isRemember: false,
        showtype: "password",
        isInput: false,
        ischeck:[0,0],
        username:'',
        password:'',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad() {
        let key = 'USER_PASS';
        wx.getStorage({
            key,
            success: res => {
                const data = res.data;
                if (data) {
                   // wx.navigateTo({url: '/pages/home/home'})
                   this.setData({
                       username: data.name,
                       password: data.password,
                       ischeck:[1,1],
                       isInput: true,
                       isRemember: true
                   })
                }
            },
            fail: err => {
                console.log('read storage failed', err);
            }
        });
    },
    getUserInfo(e) {
        if (e.detail.encryptedData) {
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
        }
        else {
            wx.showToast({
                title: '已成功授权',
                icon: 'none'
            })
        }

    },
    // 记住密码
    check() {
        let isRemember = this.data.isRemember;
        this.setData({ isRemember: !isRemember });
    },
    // 密码是否可见
    show() {
        if (this.data.isShow) {
            this.setData({
                isShow: false,
                showtype: "password"
            })
        } else {
            this.setData({
                isShow: true,
                showtype: "text"
            })
        }
    },
    // 判断是否输入
    bindKeyInput(e) {
        let name = e.target.id;
        let value = e.detail.value;
        let ischeck = this.data.ischeck;
        if (name === 'selfName'){
            if (value) {
                ischeck[0] = 1;
                this.setData({
                    ischeck: ischeck,
                });
            }
            else {
                ischeck[0] = 0;
                this.setData({
                    ischeck: ischeck,
                });
            }
        }
        else {
            if (value) {
                ischeck[1] = 1;
                this.setData({
                    ischeck: ischeck,
                });
            }
            else {
                ischeck[1] = 0;
                this.setData({
                    ischeck: ischeck,
                });
            }
        }
        if (this.data.ischeck.indexOf(0) === -1) {
            this.setData({
                isInput: true
            });
        }
        else {
            this.setData({
                isInput: false
            });
        }

    },
    async formSubmit(e) {
        // 判断表单完整性
        let personData = e.detail.value;
        let isInput = this.data.isInput;
        if (isInput) {
            const result = await app.http.get(
            api.API_LOGIN,
            {username: personData.selfName, password: personData.selfPassword},
            );
            let code = result.code;
            if (code === 999) {
                 wx.showToast({
                    title: '用户名密码错误',
                    icon: 'none',
                    mask: false,
                    fail: err => {
                        console.log('showToast fail', err);
                    }
                });
                return;
            }
            let data = result.data;
            let key = 'USER_ID';
            wx.setStorage({key,data:data.id,
                success: res => {
                    console.log('store success');
                },
                fail: err => {
                    console.log('store fail', err);
                }
            });
            if(this.data.isRemember) {
                key = 'USER_PASS';
                let user_pass = {
                    name: personData.selfName,
                    password: personData.selfPassword
                }
                wx.setStorage({key,data:user_pass,
                    success: res => {
                        console.log('store success');
                    },
                    fail: err => {
                        console.log('store fail', err);
                    }
                });
            }

            // const UserParams = '?userid=' + data.id;
            wx.switchTab({url: '/pages/user/home/home'})
        }else {
            wx.showToast({
                title: '请输入用户名密码',
                icon: 'none',
                mask: false,
                fail: err => {
                    console.log('showToast fail', err);
                }
            });
        }
    },
    register() {
        wx.navigateTo({
          url: '/pages/user/register/register',
        })
    }
})
