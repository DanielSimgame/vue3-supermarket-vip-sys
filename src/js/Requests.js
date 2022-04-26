/**
 * 此文件为API调用封装，请从此处调用API。
 * */

/**
 * Imports
 * */

import {
  postLogin,
  getPhoneAvailability,
  getEmailAvailability,
  getUserInfo,
  postSignUp
} from '@/js/Utilities/RequestsAccount'

import {
  getNoticeList,
  getUserBalance,
  getUserCoupon,
  getUserCredit,
  getUserSignIn,
  postUserRecharge,
  postUpdateUser,
  getExchangeableCoupons
} from "@/js/Utilities/RequestsUser"

import {
  getCreditsExchangeCoupon,
  postCreateBill,
  postShowBill
} from "@/js/Utilities/RequestPurchase"

import {
  getActivityPush,
  deleteUser,
  postCouponCreate,
  postUpdateUserAdmin, deleteCoupon
} from "@/js/Utilities/RequestAdmin"

// import {
//   postImage
// } from "@/js/Utilities/RequestFiles"

/**
 * Exports
 * */

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
  postUserRecharge,
  getNoticeList,
  postUpdateUser,
  getExchangeableCoupons
}

export const PurchaseApi = {
  postCreateBill,
  postShowBill,
  getCreditsExchangeCoupon
}

export const AdminApi = {
  getActivityPush,
  deleteUser,
  postCouponCreate,
  postUpdateUserAdmin,
  deleteCoupon
}

// export const FilesApi = {
//   postImage
// }
