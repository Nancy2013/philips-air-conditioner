/*
 * @Description: 按需引用ant design vue组件
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-07 17:10:38
 * @LastEditTime: 2022-04-13 10:21:01
 */

import Button from 'vant/lib/button';
import Dialog from 'vant/lib/dialog';
import Row from 'vant/lib/row';
import Col from 'vant/lib/col';
import Toast from 'vant/lib/toast';
import Switch from 'vant/lib/switch';
import Overlay from 'vant/lib/overlay';
import Slider from 'vant/lib/slider';
import Grid from 'vant/lib/grid';
import GridItem from 'vant/lib/grid-item';
import Picker from 'vant/lib/picker';
import SwipeCell from 'vant/lib/swipe-cell';
import Popup from 'vant/lib/popup';

export default Vue => {
  Vue.use(Dialog);
  Vue.use(Button);
  Vue.use(Row).use(Col);
  Vue.use(Toast);
  Vue.use(Switch);
  Vue.use(Overlay);
  Vue.use(Slider);
  Vue.use(Grid);
  Vue.use(GridItem);
  Vue.use(Picker);
  Vue.use(SwipeCell);
  Vue.use(Popup);
};
