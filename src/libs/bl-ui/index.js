/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-04-20 14:28:01
 * @LastEditors: Please set LastEditors
 */

import BlPageWrapper from 'componentsPath/PageWrapper';
import BlFixedBottom from 'componentsPath/FixedBottom';
import BlNavbar from 'componentsPath/Navbar';
import BlPanel from 'componentsPath/Panel';
import BlNotify from 'componentsPath/Notify';
import BlSwitch from 'componentsPath/Switch';

export default Vue => {
  Vue.component('bl-page-wrapper', BlPageWrapper);
  Vue.component('bl-fixed-bottom', BlFixedBottom);
  Vue.component('bl-navbar', BlNavbar);
  Vue.component('bl-panel', BlPanel);
  Vue.component('bl-notify', BlNotify);
  Vue.component('bl-switch', BlSwitch);
};
