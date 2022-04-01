import { defineStore } from 'pinia';
import { useColorMode  } from '@vueuse/core'
import { loginout as confirmLoginout } from '@/api/'
const colorMode = useColorMode()
export const useMainStore = defineStore('main', {
	state: () => ({
		route: {},
		theme: colorMode.value, // 主题
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