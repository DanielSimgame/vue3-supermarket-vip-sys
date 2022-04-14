/**
 * 此文件为API调用封装，请从此处调用API。
 * */

import {
  postLogin,
  getPhoneAvailability,
  getEmailAvailability,
  getUserInfo,
  postSignUp
} from '@/js/Utilities/RequestsUsers'

/**
 * @const users
 * */
export const UsersApi = {
  postLogin,
  postSignUp,
  getPhoneAvailability,
  getEmailAvailability,
  getUserInfo
}
