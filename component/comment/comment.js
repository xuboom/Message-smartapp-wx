const api = require('../../lib/service/api');
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '标题'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //弹窗显示控制
    showModalStatus: false,
    comments: [],
    isFocus: false,
    isInput: true,
    indx: '',
    userid: '',
    daily_id: '',
    sub_id: 0,
    parent_id: 0,
    defaultText: '添加一条评论吧~',
    comment: '../../images/Chat.png',
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    ready: function () {
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
        },
        fail: err => {
          console.log('read storage failed', err);
        }
      });
    }
  },
  methods: {
    //点击显示底部弹出
    changeRange: function (params) {
      this.showModal();
      this.getComment(params.dailyid);
      this.setData({
        indx: params.indx,
      })
    },

    //底部弹出框
    showModal: function () {
      // 背景遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      //this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },

    //点击背景面任意一处时，弹出框隐藏
    hideModal: function () {
      //弹出框消失动画
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      //this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },

    async getComment(daily_id) {
      const res = await app.http.get(
        api.API_GETCOMMENT, {
          dailyid: daily_id
        }
      );
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].children) {
          let child = this.transArr(res.data[i].children);
          res.data[i].children = child;
        }
      }
      // let comments=this.transArr(res.data)
      this.setData({
        daily_id: daily_id,
        comments: res.data
      })
    },
    transArr(node) {
      let queue = node;
      let data = [] //返回的数组结构
      while (queue.length !== 0) { //当队列为空时就跳出循环
        let item = queue.shift() //取出队列中第一个元素
        data.push({
          comment_id: item.comment_id,
          daily_id: item.daily_id,
          user_id: item.user_id,
          sub_id: item.sub_id,
          content: item.content,
          time: item.time,
          parent_id: item.parent_id,
          author_name: item.author_name,
          userinfo: item.userinfo
        })
        let children = item.children // 取出该节点的孩子
        if (children) {
          for (let i = 0; i < children.length; i++) {
            queue.push(children[i]) //将子节点加入到队列尾部
          }
        }
      }
      return data
    },
    comment(e) {
      let sub = e.currentTarget.dataset.sub===0 
      ? e.currentTarget.dataset.parent
      : e.currentTarget.dataset.sub;
      this.setData({
        parent_id: e.currentTarget.dataset.parent,
        sub_id: sub,
        isFocus: true,
        defaultText: '回复他点什么'
      })
    },
    blur(e) {
      if (e.detail.value===""){
        this.setData({
        parent_id: 0,
        sub_id: 0,
        isFocus: false,
        defaultText: '添加一条评论吧~'
      })
      }
    },
    input(e) {
      if (e.detail.value!==""){
        this.setData({
          isInput: false,
        })
      }else {
        this.setData({
          isInput: true,
        })
      }
    },
    async submit(e) {
      let d = new Date();
      let time = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString() + " " + d.getHours().toString() + ":" + d.getMinutes().toString();
      const result = await app.http.post(
        api.API_ADDCOMMENT, {
          user_id: this.data.userid,
          daily_id: this.data.daily_id,
          content: e.detail.value.content,
          parent_id: this.data.parent_id,
          sub_id: this.data.sub_id,
          time: time,
        },
      );
      let commentRefreshDetail = {
        dailyid: this.data.daily_id,
        indx: this.data.indx
      }
      this.triggerEvent('commentRefresh', commentRefreshDetail);
    }
  },
})