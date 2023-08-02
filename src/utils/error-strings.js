/*
 * @Author: your name
 * @Date: 2021-12-10 10:22:53
 * @LastEditTime: 2022-03-23 09:47:16
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\utils\error-strings.js
 */
import getI18nBundle from 'commonPath/get-i18n-bundle';

export default errorCode => {
  const language = localStorage.getItem('language');
  const errorStrings = window.__ERRORS_STRINGS__
    ? getI18nBundle(window.__ERRORS_STRINGS__, language)
    : null;

  return errorStrings ? errorStrings[errorCode] : null;
};
