/**
 * 此文件是Requests的子模块，负责管理订单相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"
import UserStorages from "@/js/Utilities/UserStorages"

/**
 * @function postCreateBill
 * @description 创建账单，POST请求
 * @param {Object} data 请求参数
 * @example data = {
 *   "couponId": "",
 *   "description": "",
 *   "totalAmount": 0
 * }
 * */
export const postCreateBill = async (data = {}) => {
  const reqUrl = `${store.getters.getApiServer}/coupon/createConsumption`

  if (data === {}) {
    return Promise.reject(new Error("请求参数不能为空"))
  }

  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() }, data);
  if (res.status === 200) {
    return res.text();
  } else {
    res.text()
      .then(text => {
      return Promise.reject(new Error(text));
    });
    // return Promise.reject(res);
  }
}

/**
 * @TODO 后端要将接口改为GET方式
 * @function postShowBill
 * @description 查看历史账单，POST请求
 * @param {Number} pageNum 页码
 * @param {Number} pageSize 每页数量
 * */
export const postShowBill = async (pageNum, pageSize) => {
  const reqUrl = `${store.getters.getApiServer}/coupon/selectConsumptionList?pageNum=${pageNum}&pageSize=${pageSize}`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

/**
 * @TODO 后端要将接口改为GET方式
 * @function getUserCreditsUse
 * @description 花费积分，GET请求
 * @param {Number} credits 使用的积分
 * */
export const getUserCreditsUse = async (credits) => {
  const reqUrl = `${store.getters.getApiServer}/user/scoreExchange?ConsumptionScore=${credits}`
  const res = await Network.fetchPost(reqUrl, { token: UserStorages.getToken() });
  if (res.status === 200) {
    return res.text();
  } else {
    return Promise.reject(res);
  }
}
