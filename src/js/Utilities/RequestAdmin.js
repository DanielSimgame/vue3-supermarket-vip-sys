/**
 * 此文件是Requests的子模块，负责管理后台相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"
import UserStorages from "@/js/Utilities/UserStorages"

/**
 * @function getActivityPush
 * @description 推送活动通知，GET请求
 * @param {string} content 活动描述
 * */
export const getActivityPush = async (content) => {
  const reqUrl = `${store.getters.getApiServer}/notice/push?content=${content}`

  if (content === '' || content === undefined) {
    return Promise.reject(new Error("请求参数不能为空"))
  }

  const res = await Network.fetchGet(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.text();
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
 * @function deleteUser
 * @description 删除用户，DELETE请求
 * @param {string} id 用户ID
 * */
export const deleteUser = async (id) => {
  const reqUrl = `${store.getters.getApiServer}/user/deleteUser?id=${id}`

  if (id === '' || id === undefined) {
    return Promise.reject(new Error("请求参数不能为空"))
  }

  const res = await Network.fetchDel(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.text();
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
 * @function postCouponCreate
 * @description 创建优惠券，POST请求
 * @param {Object} data 优惠券数据
 * */
export const postCouponCreate = async (data) => {
  const reqUrl = `${store.getters.getApiServer}/coupon/create`

  if (data.name === '' || data.name === undefined) {
    return Promise.reject(new Error("请求参数不能为空"))
  }
  const res = Network.fetchPost(reqUrl,{ token: UserStorages.getToken() }, data);
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
 * @function postUpdateUser
 * @description 更新用户信息，POST请求，相较于用户的更新，此接口增加了积分修改
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
 *   score: 0
 * }
 * */
export const postUpdateUserAdmin = async (data= {
  detail: "",
  email: "",
  gender: "",
  id: "",
  name: "",
  phone: "",
  portrait: "",
  role: 0,
  username: "",
  score: 0
}) => {
  const reqUrl = `${store.getters.getApiServer}/user/update`

  if (data.id === '' || data.id === undefined) {
    return Promise.reject(new Error("请求参数不能为空"))
  }

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
