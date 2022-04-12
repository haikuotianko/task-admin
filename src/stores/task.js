import { defineStore } from 'pinia';

export const useTaskStores = defineStore('task', {
	state: ()=> ({
		levConfig: {
			'1': '默认',
			'2': '优先',
			'3': '紧急1',
			'4': '紧急2',
			'5': '紧急3',
		}
	})
})
