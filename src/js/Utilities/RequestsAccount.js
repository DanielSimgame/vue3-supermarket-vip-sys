/**
 * 此文件是Requests的子模块，负责管理账户相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"

/**
 * @function postLogin
 * @description 发送登录请求
 * @param {Object} data 登录信息
 * */
export const postLogin = async (data) => {
  const reqUrl = `${store.getters.getApiServer}/user/login`
  const res = await Network.fetchPost(reqUrl, null, data);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function postSignUp
 * @description 发送注册请求
 * @param {Object} data 注册信息，空字符串填null或者不传
 */
export const postSignUp =  async (data) => {
  const reqUrl = `${store.getters.getApiServer}/user/register`
  const res = await Network.fetchPost(reqUrl, null, data);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function getPhoneAvailability
 * @description 检查手机号是否可用
 * @param {String} phone 手机号
 * @returns {Promise<Boolean> | Promise<Error>} 是否可用
 */
export const getPhoneAvailability = async (phone)  => {
  const reqUrl = `${store.getters.getApiServer}/user/isPhoneAvailable?phone=${phone}`
  const res = await Network.fetchGet(reqUrl);
  if (res.status === 200) {
    return res;
  } else {
    return Promise.reject(res);
  }
}

/**
 * @TODO 后端忘记把参数改了，还是phone
 * @function getEmailAvailability
 * @description 检查email是否可用
 * @param {String} email email
 * @returns {Promise<Boolean> | Promise<Error>} 是否可用
 */
export const getEmailAvailability = async (email) => {
  const reqUrl = `${store.getters.getApiServer}/user/isEmailAvailable?phone=${email}`
  const res = await Network.fetchGet(reqUrl);
  if (res.status === 200) {
    return res;
  } else {
    return Promise.reject(res);
  }
}

/**
 * @function getUserInfo
 * @description 获取用户信息
 * @param {String} token 用户token
 */
export const getUserInfo = async (token) => {
  const reqUrl = `${store.getters.getApiServer}/user/currentUser?token=${token}`
  const res = await Network.fetchGet(reqUrl)
  if (res.status === 200) {
    return res.json()
  } else {
    return Promise.reject(res)
  }
}
