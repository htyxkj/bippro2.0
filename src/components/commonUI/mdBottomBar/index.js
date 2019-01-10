import MdBottomBar from './mdBottomBar.vue';
import MdBottomBarItem from './mdBottomBarItem.vue';
import MdBottomBarTheme from './mdBottomBar.theme';
export default function install(Vue) {
  Vue.component('md-bottom-bar', MdBottomBar);
  Vue.component('md-bottom-bar-item', MdBottomBarItem);

  // Vue.component('md-bottom-bar', function (resolve) { 
  //   require(['./mdBottomBar'], resolve)
  // })
  // Vue.component('md-bottom-bar-item', function (resolve) { 
  //   require(['./mdBottomBarItem'], resolve)
  // })

  Vue.material.styles.push(MdBottomBarTheme);
}
