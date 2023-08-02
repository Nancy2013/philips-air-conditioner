/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 09:46:19
 * @LastEditTime: 2022-08-18 14:21:13
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
/**
 * ajax 错误处理
 * @see 具体参数文档 - https://github.com/mzabriskie/axios#response-schema
 */
import { DEFAULT_ERR_MSG } from 'commonPath/config';
import Toast from 'vant/lib/toast';
import { notifyError } from 'utilsPath';

export function ajaxFulFilledHandle(data = {}, config) {
  return new Promise((resolve, reject) => {
    console.log(data);
    const { status } = data;
    let errMsg = data.msg || DEFAULT_ERR_MSG;
    if (status === 0) {
      // 返回成功
      resolve(data);
    } else {
      if (errMsg.length > 100) {
        errMsg = `${errMsg.slice(0, 100)}...`;
      }
      const error = {
        code: status,
        msg: errMsg,
      };
      // notifyError(error);
      reject(error);
    }
  });
}

export function ajaxRejectedHandle(err) {
  console.error('ajax err', err);
  const { response = {} } = err;
  Toast(response.statusText || DEFAULT_ERR_MSG);
  return Promise.reject(err);
}
