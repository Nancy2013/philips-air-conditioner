/*
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-03-30 17:42:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\router\routes\app.js
 */
const Timer = () => import('viewsPath/timer/index.vue'); // 定时
const List = () => import('viewsPath/timer/list.vue'); // 列表
const Add = () => import('viewsPath/timer/add.vue'); // 添加
const Repeat = () => import('viewsPath/timer/repeat.vue'); // 设置重复
const Operate = () => import('viewsPath/timer/operate.vue'); // 设置开关|模式
const timer = [
  {
    path: '/timer',
    name: 'timer',
    component: Timer,
    redirect: '/timer/list',
    children: [
      {
        path: 'list',
        name: 'list',
        component: List,
      },
      {
        path: 'add/:jobid?',
        name: 'timerAdd',
        component: Add,
      },
      {
        path: 'repeat',
        name: 'repeat',
        component: Repeat,
      },
      {
        path: 'operate/:key',
        name: 'operate',
        component: Operate,
      },
    ],
  },
];

export default [...timer];
