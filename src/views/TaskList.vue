<template>
	<div class="h-full flex flex-col relative">
		<div v-show="isLoading" class=" transform -translate-x-1/2 absolute left-1/2 top-14 p-2 z-50 bg-gray-800 text-center py-2 rounded-lg">
			<Loading size="24px">加载中...</Loading>
		</div>
		<div class="flex-1">
			<Tabs v-model:active="active" sticky animated swipeable>
				<Tab title="未完成">
					<div class="pt-3 overflow-y-auto" style="height: calc(100vh - 94px);">
						<template v-for="(item, index) in taskList" :key="item.id">
							<div class="card-box m-3 mt-0 shadow-md">
								<TaskItem 
									:index="index + 1"
									:task_name="item.task_name"
									:task_type_name="item.task_type_name"
									:lev="item.lev"
									:machine_info="item.machine_info"
								/>
								<div class="">
									<OpenDetails 
										:user_task_no="item.user_task_no"
										:content="item.content"
										:machine_info="item.machine_info"
									/>
								</div>
							</div>
						</template>
					</div>
				</Tab>
				<Tab title="已完成">
					<div class="pt-3 overflow-y-auto" style="height: calc(100vh - 94px);">
						<template v-for="(item, index) in taskList" :key="item.id">
							<div class="card-box m-3 mt-0 shadow-md">
								<TaskItem 
									:index="index + 1"
									:task_name="item.task_name"
									:task_type_name="item.task_type_name"
									:lev="item.lev"
									:machine_info="item.machine_info"
								/>
								<div>
									<OpenDetails
										:user_task_no="item.user_task_no"
										:content="item.content"
										:machine_info="item.machine_info"
									/>
								</div>
							</div>
						</template>
					</div>
				</Tab>
			</Tabs>
			
		</div>

		<div v-if="pageConfig.total >= pageConfig.per_page" class="card-box absolute left-2 right-2 bottom-14 p-1 shadow-md z-10">
			<Pagination v-model="pageConfig.current_page" :total-items="pageConfig.total" :items-per-page="pageConfig.per_page" />
		</div>
	</div>

</template>

<script setup lang="jsx">
import { defineComponent, onMounted, ref, reactive, watch, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Tab, Tabs, Icon, Pagination, Dialog, Field, Toast, Loading } from 'vant';
import AIcon from '@/components/AIcon.vue';
import { useTaskStores } from '@/stores/task';
import { getWxConfig, getTaskList, overTaskMachine } from '@/api/';
import { emptyObject, getCaculateLL } from '@/utils/';
import { useWxApi, useWxApiConfig, getLocation, useOpenLocation } from '@/hooks';
const taskStores = useTaskStores()
const router = useRouter()
const active = ref(0)
const isLoading = ref(false)
const taskList = ref([])
const pageConfig = reactive({
	total: 0,
	per_page: 10,
	current_page: 1
})
let wxApi;
const locationData = {
	lat: undefined,
	lng: undefined
}
function getColor(){
	return ''
}
onMounted(async () => {
	try {
		console.time('useWxApi')
		await useWxApi()
		console.timeEnd('useWxApi')
		const res = await getWxConfig({url: location.href.split('#')[0]})
		wxApi = await useWxApiConfig({
			// debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			// appId: '', // 必填，公众号的唯一标识
			// timestamp: '', // 必填，生成签名的时间戳
			// nonceStr: '', // 必填，生成签名的随机串
			// signature: '',// 必填，签名
			...res.data,
			jsApiList: ['getLocation', 'openLocation'] // 必填，需要使用的JS接口列表
		})
		console.log(wxApi)
		const { latitude, longitude } = await getLocation()
		locationData.lat = latitude
		locationData.lng = longitude
	} catch (error) {
		Toast.fail(typeof error == 'string' ? error : '定位失败！')
	}
	getTaskListData()
	
})

async function toOpenLocation(item){
	// latitude: 0, // 纬度，浮点数，范围为90 ~ -90
	// longitude: 0, // 经度，浮点数，范围为180 ~ -180。
	// name: '', // 位置名
	// address: '', // 地址详情说明
	const { latitude, longitude, address, address_name, machine_name } = item
	if(!latitude || !longitude) return Toast.fail('经纬度为空，无法导航！')
	Toast.loading({
		message: '加载中...',
		forbidClick: true
	})
	try {
		await useOpenLocation({
			latitude,
			longitude,
			name: machine_name,
			address: address || address_name || machine_name
		})
		Toast.clear()
		console.log('打开导航成功')
	} catch (error) {
		Toast.fail(typeof error == 'string' ? error : '定位失败！')
	}
}
watch(() => active.value, () => {
	taskList.value = []
	upDataList()
})

function upDataList(){
	pageConfig.current_page === 1 ?
	getTaskListData() :
	pageConfig.current_page = 1
}
onActivated(() => {
	console.log('显示')
	if(!isLoading.value){
		upDataList()
	}
})
async function getTaskListData(){
	isLoading.value = true
	const {data} = await getTaskList({status: active.value, ...locationData, page: pageConfig.current_page})
	isLoading.value = false
	taskList.value = data.data
	// console.log(res)
	Object.assign(pageConfig, {
		total: data.total,
		per_page: data.per_page,
		current_page: data.current_page
	})
}
watch(() => pageConfig.current_page, getTaskListData)

const SendTaskInp = defineComponent({
	props: {
		onChange: Function
	},
	setup(props){
		const value = ref('')
		const onChange=(v) => {
			value.value = v
			props.onChange?.call(null, v)
		}
		return () => (
			<div class=" card-box border-2 border-green-500 overflow-hidden">
				<Field
					modelValue={value.value}
					onUpdate:modelValue={onChange}
					rows="2"
					autosize
					type="textarea"
					maxlength="200"
					placeholder="请输入留言"
					show-word-limit
				/>
			</div>
		)
	}
})

const TaskItem = defineComponent({
	props: {
		index: Number, // 序号
		task_name: String, // 任务名称
		task_type_name: String, // 任务类型
		lev: Number, // 任务等级
		machine_info: Array, // 完成情况
	},
	setup(props){
		const detailsData = reactive({})
		props.machine_info.map(v => detailsData[v.status] = v.info?.length || 0)
		watch(props, () =>{
			emptyObject(detailsData)
			props.machine_info.map(v => detailsData[v.status] = v.info?.length || 0)
		})
		return () => (
			<div class=" flex justify-between items-start pb-2">
				<div>
					<div class="flex p-3 pb-1 pr-0 items-center">
						<div class="w-5 h-5 text-center border border-blue-500 text-blue-500 rounded-sm text-sm">{props.index}</div>
						<div class=" flex-1 px-2 font-bold text-gray-600">{props.task_name}</div>
					</div>
					<div class="pl-2 text-sm">
						<div>
							<span class=" text-gray-500">任务类型：</span>
							<span>{props.task_type_name}</span>
						</div>
						<div>
							<span class=" text-gray-500">任务等级：</span>
							<span>{taskStores.levConfig[props.lev]}</span>
						</div>
					</div>
				</div>

				<div class=" text-white text-center py-2 text-sm">
					{
						detailsData['0'] &&
						<div class="my-1 px-3 bg-yellow-500 rounded-tl-lg rounded-bl-lg text-md">未完成 [{detailsData['0']}]</div>
					}
					{
						detailsData['1'] &&
						<div class="my-1 px-3 bg-green-500 rounded-tl-lg rounded-bl-lg text-md">已完成 [{detailsData['1']}]</div>
					}
					{
						detailsData['2'] &&
						<div class="my-1 px-3 bg-red-500 rounded-tl-lg rounded-bl-lg text-md">反馈 [{detailsData['2']}]</div>
					}
				</div>
			</div>
		)
	}
})
const OpenDetails = defineComponent({
	props: {
		user_task_no: String, // 编号
		content: String, // 任务内容
		machine_info: Array, // 完成情况
	},
	setup(props){
		const isOpen = ref(false)
		const detailsList = ref([])
		function upData(){
			detailsList.value = []
			props.machine_info.map(v => detailsList.value.push(...v.info))
			detailsList.value = detailsList.value.sort((a, b) => a.distance - b.distance)
		}
		watch(props, upData)
		upData()
		function StatusIcon(type){
			switch (type) {
				case 0: return <AIcon name="icon-weiwancheng" />
				case 1: return <AIcon name="icon-yiwancheng" />
				default: return <span class=" text-7xl"> <AIcon name="icon-yichang" /> </span>
			}
		}
		async function clickSuccessTask(item){
			if(item.latitude && item.longitude){
				Toast.loading({
					message: '定位中...',
					forbidClick: true,
					duration: 0
				})
				try {
					const { latitude, longitude } = await getLocation()
					const distance = getCaculateLL(latitude, longitude, item.latitude, item.longitude)
					Toast.clear()
					if(distance > 200){
						upDataList()
						Dialog({ message: '此设备需要在 200(米)范围内，才可以进行任务! 现在距离设备' + distance + '(米)' });
						return false
					}
					
				} catch (error) {
					Toast.fail(typeof error == 'string' ? error : '定位失败！')
					return false
				}
			}
			
			const overRemark = ref('')
			const onChange = (v) => {
				overRemark.value = v
			}
			Dialog.confirm({
				title: '完成任务',
				message: () => <SendTaskInp id={item.id} onChange={onChange} />,
				confirmButtonText: '确认完成',
				// allowHtml: true,
				beforeClose: async (active) => {
					if(active === 'cancel') return true
					if(!overRemark.value) return !Toast.fail('请输入留言')
					const res = await overTaskMachine({id: item.id, over_remark: overRemark.value})
					Toast.success(res.msg || '成功')
					getTaskListData()
					return true
				}
			})
		}
		function taskFeedback(item){
			router.push(`/taskFeedback/${item.id}?title=${item.machine_name}`)
		}
		function clickShowDetails(item){
			router.push(`/taskItemDetails/${props.user_task_no}?machine_id=${item.machine_id}&machine_name=${item.machine_name}`)
		}
		return () => (
			<>
				{/* 任务详情 */}
				{
					isOpen.value &&
					<div class="card-box bg-gray-200 p-2 mx-2 mt-2 text-gray-600">
						<div class=" text-center text-sm font-bold">任务详情</div>
						<div class=" text-sm">
							<pre>{props.content}</pre>
						</div>
					</div>
				}
				{
					isOpen.value &&
					<div class=" bg-blue-300 py-2 my-2 rounded-lg">
						{
							detailsList.value.map((v, i) => (
								<div class="card-box bg-gray-100 m-2 mb-3 shadow-md overflow-hidden" key={v.id}>
									<div class="relative">
										<div class=" absolute right-0 top-0 bottom-0 flex items-center text-6xl opacity-80">
											{ StatusIcon(v.status) }
										</div>
										<div class=" flex items-center p-2">
											<div class="w-5 h-5 text-center border border-green-500 text-green-500 rounded-sm text-sm">{i + 1}</div>
											<div class=" flex-1 px-2">{v.machine_name}</div>
										</div>
										<div class="pl-2 text-sm">
											<div>
												<span class=" text-gray-500">类型：</span>
												<span>{v.type_name}</span>
											</div>
											<div>
												<span class=" text-gray-500">编号：</span>
												<span>{v.machine_code}</span>
											</div>
											<div>
												<span class=" text-gray-500">网点名称：</span>
												<span class=" ">{v.address_name}</span>
											</div>
											<div>
												<span class=" text-gray-500">网点地址：</span>
												<span class=" ">{v.address}</span>
											</div>
											<div>
												<span class=" text-gray-500">距离：</span>
												<span class=" text-blue-500">{v.latitude && v.longitude ? v.distance_text : '未设置'}</span>
											</div>
										</div>
									</div>
									{/* 快捷导航栏 */}
									<div class=" flex border-t text-center bg-white text-sm mt-2 text-gray-500">
										<div class="active:bg-gray-100 flex-1 py-2 text-blue-500" onClick={() => toOpenLocation(v)}> 
											设备导航
											<Icon name="guide-o" />
										</div>
										{
											v.status == 0 ?
											<>
												<div class="active:bg-gray-100 flex-1 py-2 border-l text-green-500 font-bold" onClick={() => clickSuccessTask(v)}> 完成任务 </div>
												<div class="active:bg-gray-100 flex-1 py-2 border-l text-red-500" onClick={() => taskFeedback(v)}> 反馈异常 </div>
											</> :
											<div class="active:bg-gray-100 flex-1 py-2 border-l text-gray-500 font-bold" onClick={() => clickShowDetails(v)}> 查看详情 </div>
										}
									</div>
								</div>
							))
						}
					</div>
				}
				<div class=" text-center text-blue-500 py-2 border-t border text-sm" onClick={() => isOpen.value = !isOpen.value}>
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