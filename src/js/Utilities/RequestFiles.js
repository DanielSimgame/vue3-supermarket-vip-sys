/**
 * 此文件是Requests的子模块，负责管理文件上传相关API
 * */

import Network from "@/js/basic/Network"
import store from "@/js/store"
import UserStorages from "@/js/Utilities/UserStorages"

// /**
//  * @function postImage
//  * @description 上传图片
//  * @param {FormData} img 图片FormData
//  * */
// export const postImage = async (img) => {
//   const reqUrl = `${store.getters.getApiServer}/file/image`
//
//   if (img === null || img === undefined) {
//     return Promise.reject('图片不能为空')
//   }
//
//   const res = await Network.fetchPostFile(reqUrl, { token: UserStorages.getToken() }, img);
//
//   if (res.status === 200) {
//     return res.text()
//   } else {
//     res.text()
//       .then(text => {
//         if (text !== undefined) {
//           text = text.toString()
//           return Promise.reject(new Error(text));
//         }
//       })
//   }
// }
