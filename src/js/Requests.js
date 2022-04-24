/**
 * 此文件为API调用封装，请从此处调用API。
 * */

import {
  postLogin,
  getPhoneAvailability,
  getEmailAvailability,
  getUserInfo,
  postSignUp
} from '@/js/Utilities/RequestsAccount'

import {
  getUserBalance,
  getUserCoupon,
  getUserCredit,
  getUserSignIn,
  postUserRecharge
} from "@/js/Utilities/RequestsUser"

/**
 * @const users
 * */
export const AccountApi = {
  postLogin,
  postSignUp,
  getPhoneAvailability,
  getEmailAvailability,
  getUserInfo
}

export const UserInfoApi = {
  getUserBalance,
  getUserCredit,
  getUserCoupon,
  getUserSignIn,
  postUserRecharge
}
