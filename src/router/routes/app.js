/*
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-02-22 14:31:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\router\routes\app.js
 */
const Portal = () => import('viewsPath/main/portal.vue'); // 首界面

const app = [
  {
    path: '/portal',
    name: 'portal',
    component: Portal,
  },
];

export default [...app];
