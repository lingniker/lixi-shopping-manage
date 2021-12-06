import Introduce from './introduce/index.vue';
import User from './user/index.vue';
import Administrator from './administrator/index.vue';
import Logininfor from './logininfor/index.vue';
import Operlog from './operlog/index.vue';
import Shop from './shop/index.vue';
import Order from './order/index.vue';
import Address from './address/index.vue';

var homeRouter = [
  {
    path: '/home/introduce',
    name: 'introduce',
    title: '首页',
    component: Introduce
  },
  {
    path: '/home/user',
    name: 'user',
    title: '用户管理',
    component: User
  },
  {
    path: '/home/administrator',
    name: 'administrator',
    title: '管理员',
    component: Administrator
  },
  {
    path: '/home/shop',
    name: 'shop',
    title: '商品信息',
    component: Shop
  },
  {
    path: '/home/order',
    name: 'order',
    title: '订单信息',
    component: Order
  },
  {
    path: '/home/logininfor',
    name: 'logininfor',
    title: '登录信息',
    component: Logininfor
  },
  {
    path: '/home/operlog',
    name: 'operlog',
    title: '操作信息',
    component: Operlog
  },
  {
    path: '/home/address',
    name: 'address',
    title: '地址信息',
    component: Address
  }
]

export default homeRouter