/**
 * 此文件是Requests的子模块，负责管理用户信息相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"
import UserStorages from "@/js/Utilities/UserStorages"


/**
 * @TODO 后端要将接口改为GET方式
 * @function getUserBalance
 * @description 获取账户余额
 * */
export const getUserBalance = async () => {
  const reqUrl = `${store.getters.getApiServer}/user/selectAccount`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @TODO 后端要将接口改为GET方式
 * @function getUserCredit
 * @description 获取账户积分
 * */
export const getUserCredit = async () => {
  const reqUrl = `${store.getters.getApiServer}/user/selectScore`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function getUserCoupon
 * @description 获取账户积分
 * */
export const getUserCoupon = async () => {
  const reqUrl = `${store.getters.getApiServer}/coupon/list`
  const res = await Network.fetchGet(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function getUserSignIn
 * @description 用户签到
 * */
export const getUserSignIn = async () => {
  const reqUrl = `${store.getters.getApiServer}/user/attend`
  const res = await Network.fetchGet(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200 || res.status === 500) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function postUserRecharge
 * @description 用户充值
 * @param {String} data 充值金额，双精度转字符串
 * */
export const postUserRecharge = async (data = 'money=0') => {
  const reqUrl = `${store.getters.getApiServer}/user/recharge`

  if (data === 'money=0') {
    return Promise.reject({
      status: 400,
      statusText: '充值金额不能为0'
    })
  }

  const res = await Network.fetchPostString(`${reqUrl}?money=${data}`, { token: UserStorages.getToken() });
  if (res.status === 200 || res.status === 500) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function getExchangeCoupons
 * @description 列出可以使用积分兑换的优惠券
 * */
export const getExchangeableCoupons = async () => {
  const reqUrl = `${store.getters.getApiServer}/coupon/listTemplate`

  const res = await Network.fetchGet(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.json();
  } else {
    res.text()
      .then(text => {
        if (text !== undefined) {
          text = text.toString()
          return Promise.reject(new Error(text));
        }
      })
  }
}

/**
 * @function getNoticeList
 * @description 获取公告列表
 * @param {Number} pageNum 页码
 * @param {Number} pageSize 每页数量
 * */
export const getNoticeList = async (pageNum = 0, pageSize = 10) => {
  const reqUrl = `${store.getters.getApiServer}/notice/list?pageNum=${pageNum}&pageSize=${pageSize}`

  const res = await Network.fetchGet(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function postUpdateUser
 * @description 更新用户信息，POST请求，相较于管理员的更新，此接口没有积分修改
 * @param {Object} data 用户数据
 * @example data = {
 *   detail: "",
 *   email: "",
 *   gender: "",
 *   id: "",
 *   name: "",
 *   phone: "",
 *   portrait: "",
 *   role: 0,
 *   username: ""
 * }
 * */
export const postUpdateUser = async (data= {
  detail: "",
  email: "",
  gender: "",
  id: "",
  name: "",
  phone: "",
  portrait: "",
  role: 0,
  username: ""
}) => {
  const reqUrl = `${store.getters.getApiServer}/user/update`
  if (data.id === '' || data.id === undefined) { return Promise.reject(new Error("请求参数不能为空")) }

  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() }, data);

  if (res.status === 200) {
    return res.json();
  } else {
    res.text()
      .then(text => {
        if (text !== undefined) {
          text = text.toString()
          return Promise.reject(new Error(text));
        }
      })
  }
}
