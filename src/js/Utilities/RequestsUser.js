/**
 * 此文件是Requests的子模块，负责管理用户信息相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"
import UserStorages from "@/js/Utilities/UserStorages";


/**
 * @TODO 后端要将接口改为GET方式
 * @function getUserBalance
 * @description 获取账户余额
 * */
export const getUserBalance = async () => {
  const reqUrl = `${store.getters.getApiServer}/user/selectAccount`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken()});
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
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken()});
  if (res.status === 200) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @TODO 后端要将接口改为GET方式
 * @function getUserCoupon
 * @description 获取账户积分
 * */
export const getUserCoupon = async () => {
  const reqUrl = `${store.getters.getApiServer}/coupon/查看`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken()});
  if (res.status === 200) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}
