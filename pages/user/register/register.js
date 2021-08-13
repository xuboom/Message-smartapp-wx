// pages/user/register.js
const app = getApp()
const api = require('../../../lib/service/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: [{
        value: 0,
        name: '女'
      },
      {
        value: 1,
        name: '男'
      },
      {
        value: 2,
        name: '其他'
      },
    ],
    placehold: {
      'name': false,
      'age': false,
      'email': false,
      'phone': false,
      'address': false,
      'password': false,
      'pass': false,
    },
    date: 'YYYY-MM-DD',
    isCheck: false,
    isInput: false,
    password: '',
    isSame: true,
    now: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let d = new Date();
    let time = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString();
    this.setData({
      now:time,
    })
    console.log('ddd',this.data.now)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  blur(e) {
    console.log('eeee', e)
    if (e.detail.value === "") {
      this.setData({
        ['placehold.' + e.currentTarget.dataset.id]: true,
      })
    } else {
      this.setData({
        ['placehold.' + e.currentTarget.dataset.id]: false,
      })
      if (e.currentTarget.dataset.id === 'password') {
        this.setData({
          password: e.detail.value,
        })
      }
      if (e.currentTarget.dataset.id === 'pass') {
        if (e.detail.value === this.data.password) {
          this.setData({
            isSame: true,
          })
        } else {
          this.setData({
            isSame: false,
          })
        }
      }
    }
  },

  check() {
    if (this.data.isCheck) {
      this.setData({
        isCheck: false,
      })
    } else {
      this.setData({
        isCheck: true,
      })
    }
  },

  async formSubmit(e) {
    console.log('e', e.detail.value)
    let data = e.detail.value;
    if (this.data.isSame) {
      data.password = data.password_first;
    } else {
      return;
    }
    let isInput = data.name !== '' && data.age !== '' && data.sex !== '' &&
      data.address !== '' && data.phone !== '' && data.birthday !== '' && data.email !== '' && data.introduction !== ''& data.password !== '';
    let d = new Date();
    let time = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString() + " " + d.getHours().toString() + ":" + d.getMinutes().toString();
    data.register_date = time;
    data.image = "";
    if (this.data.isCheck) {
      if (isInput) {
        data.sex = parseInt(data.sex);
        const result = await app.http.post(
          api.API_REGISTER,
          data,
        );
        console.log('re',result)
        if (result.msg === 'success') {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            title: '注册失败，请稍候再试',
            icon: 'error'
          })
        }
      } else {
        wx.showToast({
          title: '请完善信息',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请确认最终解释权！',
        icon: 'none'
      })
    }
  }
})