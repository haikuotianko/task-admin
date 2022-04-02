<template>
	<Tabs v-model:active="active">
		<Tab title="未完成">未完成</Tab>
		<Tab title="已完成">已完成</Tab>
	</Tabs>

	<div class="card-box m-3 shadow-md">
		<div class=" flex justify-between items-start">
			<div>
				<div class="flex p-3 pb-1 pr-0 items-center">
					<div class="w-5 h-5 text-center border border-blue-500 text-blue-500 rounded-sm text-sm">1</div>
					<div class=" flex-1 px-2">任务名称</div>
				</div>
				<div class="pl-2 text-sm">
					<div>
						<span class=" text-gray-500">任务类型：</span>
						<span>临时任务</span>
					</div>
					<div>
						<span class=" text-gray-500">任务等级：</span>
						<span>默认</span>
					</div>
				</div>
			</div>

			<div class=" text-white text-center py-2 text-sm">
				<div class="my-1 px-3 bg-green-500 rounded-tl-lg rounded-bl-lg text-md">已完成 [10]</div>
				<div class="my-1 px-3 bg-yellow-500 rounded-tl-lg rounded-bl-lg text-md">未完成 [10]</div>
				<div class="my-1 px-3 bg-red-500 rounded-tl-lg rounded-bl-lg text-md">反馈 [10]</div>
			</div>
		</div>

		<OpenDetails />
		
		
	</div>
</template>

<script setup lang="jsx">
import { defineComponent, onMounted, ref } from 'vue';
import { Tab, Tabs, Icon } from 'vant';
import AIcon from '../components/AIcon.vue';
import { getTaskList } from '@/api/';
const active = ref(0)
const taskList = ref([])
async function getTaskListData(){
	const res = await getTaskList()
	console.log(res)
}
onMounted(getTaskListData)
const OpenDetails = defineComponent({
	setup(){
		const isOpen = ref(false)
		return () => (
			<>
				{/* 任务详情 */}
				{
					isOpen.value &&
					<div class="card-box bg-gray-200 p-2 mx-2 text-gray-600">
						<div class=" text-center text-sm font-bold">任务详情</div>
						<div class=" text-sm">
							<span class=" pl-4"></span>
							这里是任务内容
							这里是任务内容
						</div>
					</div>
				}

				{
					isOpen.value &&
					<div class="card-box bg-gray-100 m-2  shadow-md overflow-hidden">
						<div class="relative">
							<div class=" absolute right-0 top-0 bottom-0 flex items-center text-6xl opacity-80">
								<AIcon name="icon-yiwancheng" />
								<span class=" text-7xl">
									<AIcon name="icon-yichang" />
								</span>
							</div>
							<div class=" flex items-center p-2">
								<div class="w-5 h-5 text-center border border-green-500 text-green-500 rounded-sm text-sm">1</div>
								<div class=" flex-1 px-2">设备名称</div>
							</div>
							<div class="pl-2 text-sm">
								<div>
									<span class=" text-gray-500">任务名称：</span>
									<span>检查设备</span>
								</div>
								<div>
									<span class=" text-gray-500">任务等级：</span>
									<span>默认</span>
								</div>
							</div>
						</div>
						{/* 快捷导航栏 */}
						<div class=" flex border-t text-center bg-white text-sm mt-2 text-gray-500">
							<div class=" flex-1 py-2 text-blue-500"> 
								设备导航
								<Icon name="guide-o" />
							</div>
							<div class=" flex-1 py-2 border-l text-green-500 font-bold"> 完成任务 </div>
							<div class=" flex-1 py-2 border-l text-red-500"> 反馈异常 </div>
						</div>

					</div>
				}

				<div class=" text-center text-blue-500 p-1 border-t border text-sm" onClick={() => isOpen.value = !isOpen.value}>
					{
						isOpen.value ?
						<>收起详情<Icon name="arrow-up" /> </>:
						<>展开详情<Icon name="arrow-down" /></>
					}
				</div>
			</>
		)
	}
})

</script>

<style scoped>
</style>