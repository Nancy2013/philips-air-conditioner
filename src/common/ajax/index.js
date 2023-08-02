import { paramsSerializer, isPlainObject } from 'commonPath/utils';
import moment from 'moment';
import {
  HTTP_METHOD,
  DEFAULT_REQ_METHOD,
  BASE_URL,
  URL_DEFAULT_PREFIXER,
  IS_SERIALIZER_PARAMS,
  REQ_TIME_OUT,
} from 'commonPath/config';
import axiosInstance from './axios';
import jsonp from './jsonp';
import { ajaxFulFilledHandle, ajaxRejectedHandle } from './ajaxErrorHandle';

function reqJSONP(url = '', params = {}, opts = {}) {
  return jsonp(url, params, opts).then(
    ({ data, options }) =>
      ajaxFulFilledHandle(data, { type: 'jsonp', options }),
    ajaxRejectedHandle
  );
}

let payload;

// 设置请求token
function setAxiosCfg() {
  const header = JSON.parse(localStorage.getItem('headerConfig') || '{}');
  const { userId, familyId, messageId, loginsession, licenseId } = header;
  console.log('-----headerConfig----', JSON.stringify(header));

  return {
    paramsSerializer,
    timeout: REQ_TIME_OUT,
    headers: {
      userId,
      familyId,
      messageId,
      loginsession,
      licenseId,
    },
    validateStatus: status => true,
  };
}

export function getAxiosInstance() {
  return axiosInstance(setAxiosCfg());
}

export const AJAX = {
  get(url = '', params = {}, opts = {}) {
    return getAxiosInstance().get(url, {
      params,
      ...opts,
    });
  },
  post(url = '', params = {}, opts = {}) {
    return getAxiosInstance().post(url, params, {
      ...opts,
    });
  },
  jsonp(url, params, opts) {
    return reqJSONP(url, params, opts);
  },
};
const defaultPrefixer = () => {
  let host = localStorage.getItem('host');
  if (host) {
    // 适配域名协议
    host = /http(s)?:\/\//.test(host) ? host : `https://${host}`;
  }
  console.log('【host】', host);
  return `${host || BASE_URL}${URL_DEFAULT_PREFIXER}`;
};
/**
 * @param {String} path
 * @param {Object} opts
 * @prop {GET|POST} method - 请求类型
 * @prop {String} prefixer - url前缀
 * @prop {Boolean} isSerializerParams - 是否序列化提交数据
 */
export function reqHandle(
  path = '',
  {
    method = DEFAULT_REQ_METHOD,
    prefixer = defaultPrefixer,
    isSerializerParams = IS_SERIALIZER_PARAMS,
    ...props
  } = {
    method: DEFAULT_REQ_METHOD,
    prefixer: defaultPrefixer,
    isSerializerParams: IS_SERIALIZER_PARAMS,
  }
) {
  const reqPath = path.indexOf('/') === 0 ? path.slice(1) : path;

  return params => {
    let reqParams = params;
    if (
      isSerializerParams &&
      method.toUpperCase() === HTTP_METHOD.POST &&
      (isPlainObject(reqParams) || Array.isArray(reqParams))
    ) {
      reqParams = paramsSerializer(reqParams);
    }
    payload = JSON.stringify(reqParams);
    console.log(JSON.stringify(reqParams));
    const reqUrl = /http(s)?:\/\//.test(reqPath)
      ? reqPath
      : `${prefixer()}/${reqPath}`;
    return AJAX[method.toLowerCase()](reqUrl, reqParams, {
      ...props,
    });
  };
}
