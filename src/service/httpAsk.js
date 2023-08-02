/*
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-11-03 10:30:05
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\service\appAsk.js
 */
import { HTTP_METHOD } from 'commonPath/config';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 云端定时
  cloudServices: params => {
    params.version = 'v2';
    return reqHandle('/appfront/v1/timertask/manage', {
      method: HTTP_METHOD.POST,
    })(params);
  },
  faultQuery: params =>
    reqHandle('/farm/product/v1/system/faultquery', {
      method: HTTP_METHOD.GET,
    })(params),
};
