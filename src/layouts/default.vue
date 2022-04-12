<template>
	<div class=" flex flex-col h-full">
		<div class="flex-1 overflow-y-auto bg-gray-100">
			<router-view />
		</div>

		<transition name="slide-fade">
			<Tabbar v-if="showTab" v-model="tabActive" @change="tabChange">
				<TabbarItem name="taskList" icon="home-o">任务</TabbarItem>
				<TabbarItem name="workOrder" icon="apps-o">工单</TabbarItem>
				<!-- <TabbarItem name="mine" icon="user-o">我的</TabbarItem> -->
			</Tabbar>
		</transition>
		
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { Tabbar, TabbarItem } from 'vant';
const route = useRoute()
const router = useRouter()
const showTab = ref(false) 
const tabActive = ref('taskList')
const tabChange = v => {
	// tabActive.value = v
	router.push('/' + v)
}
console.log(route)
watch(route, () => {
	// console.log(route)
	tabActive.value = route.name
	showTab.value = !!(route.meta?.showTab)
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 200ms ease-out;
}

.slide-fade-leave-active {
  transition: all 200ms cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
:deep(.van-tabbar--fixed){
	max-width: 500px;
	right: 0;
	margin: 0 auto;
}
</style>