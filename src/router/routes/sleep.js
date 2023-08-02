/*
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-04-20 10:33:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\router\routes\app.js
 */
const Sleep = () => import('viewsPath/sleep/index.vue'); // 睡眠
const List = () => import('viewsPath/sleep/list.vue'); // 列表
const Default = () => import('viewsPath/sleep/default.vue'); // 列表
const Add = () => import('viewsPath/sleep/add.vue'); // 添加
const sleep = [
  {
    path: '/sleep',
    name: 'sleep',
    component: Sleep,
    redirect: '/sleep/list',
    children: [
      {
        path: 'list',
        name: 'list',
        component: List,
      },
      {
        path: 'default',
        name: 'default',
        component: Default,
      },
      {
        path: 'add/:ac_mode/:jobid?',
        name: 'sleepAdd',
        component: Add,
      },
    ],
  },
];

export default [...sleep];
