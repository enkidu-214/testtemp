// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import './icons' // icon
import { routerMode } from './config/env'
import VueAMap from 'vue-amap';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import './utils/directives';
import JsonExcel from 'vue-json-excel';

Vue.use(ElementUI);
Vue.component('downloadExcel',JsonExcel)

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
	key: '788e08def03f95c670944fe2c78fa76f',
	plugin: [
		'AMap.Autocomplete',
		'AMap.PlaceSearch',
		'AMap.Scale',
		'AMap.OverView',
		'AMap.ToolBar',
		'AMap.MapType',
		'AMap.PolyEditor',
		'AMap.CircleEditor',
		'Geocoder'
	],
	// 默认高德 sdk 版本为 1.4.4
	v: '1.4.4'
});

Vue.config.productionTip = false

// offer on / emit pair
// this.$bus.emit('something');
// this.$bus.on('something', function(){ doSomething })
Vue.prototype.$bus = new Vue()
Vue.prototype.$map = {}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
			return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})

/* eslint-disable no-new */
new Vue({
	router,
	store,
}).$mount('#app')
