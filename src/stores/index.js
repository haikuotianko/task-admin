import { defineStore } from 'pinia';
import { loginOut as confirmLoginout } from '@/api'
export const useMainStore = defineStore('main', {
	state: () => ({
		route: {},
		pageDrawer: false,
		isLogin: true, // 是否登录
	}),
	getters: {
		
	},
	actions: {
		async loginout(){
			const res = await confirmLoginout()
			this.isLogin = false
			return res
		}
	}
})