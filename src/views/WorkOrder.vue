<template>
	<div class="h-full flex flex-col relative">
		<NavBar title="工单列表" >
			<template #right>
				<div @click="showSearch = true">
					<Icon name="filter-o" />筛选
				</div>
			</template>
		</NavBar>
		<div v-show="isLoading" class=" transform -translate-x-1/2 absolute left-1/2 top-14 p-2 z-50 bg-gray-800 text-center py-2 rounded-lg">
			<Loading size="24px">加载中...</Loading>
		</div>

		<div @click="toWorkFeedback" class=" absolute right-0 bottom-20 px-2 py-1 rounded-l-md bg-red-500 text-white shadow-md">
			<Icon name="warn-o" />
			<span class=" text-sm">反馈</span>
		</div>

		<Empty v-if="!workList.length && !isLoading" description="工单为空">
			<Button round type="danger" icon="warn-o" @click="toWorkFeedback">添加工单反馈</Button>
		</Empty>

		<div class="flex-auto overflow-y-auto">
			
			<div v-for="(item, index) in workList" :key="index" class="m-3 card-box shadow-md">
				<div class=" flex items-center p-2 pr-0">
					<div class="w-5 h-5 text-center border border-green-500 text-green-500 rounded-sm text-sm">1</div>
					<div class=" flex-1 px-2">{{item.work_order_title}}</div>
					<div class="flex items-center">
						<a v-if="item.admin_phone" :href="'tel:' + item.admin_phone" class="flex items-center mr-2 px-2 py-1 bg-gray-100 rounded-md active:bg-blue-100">
							<span class=" text-xs text-gray-600">管理员</span>
							<Icon name="phone-o" />
						</a>
						<div v-if="item.status == 1" class=" text-white my-1 px-3 bg-green-500 rounded-tl-lg rounded-bl-lg text-md">已处理</div>
						<div v-if="item.status == 0" class=" text-white my-1 px-3 bg-yellow-500 rounded-tl-lg rounded-bl-lg text-md">待审核</div>
						<div v-if="item.status == 2" class=" text-white my-1 px-3 bg-gray-500 rounded-tl-lg rounded-bl-lg text-md">忽略</div>
					</div>
				</div>
				<div class=" p-2 pb-0 pt-0 text-sm">
					<div>
						<span class=" text-gray-500 mr-2">工单编号:</span>
						<span class=" text-gray-700">{{item.work_order_no}}</span>
					</div>
					<div>
						<span class=" text-gray-500 mr-2">审核管理员:</span>
						<span class=" text-gray-700">{{item.admin_name}}</span>
					</div>
				</div>
				<OpenDetails :info="item" />
			</div>

		</div>

		<div v-if="pageConfig.total > pageConfig.per_page" class="card-box absolute left-2 right-2 bottom-4 p-1 shadow-md z-10">
			<Pagination v-model="pageConfig.current_page" :total-items="pageConfig.total" :items-per-page="pageConfig.per_page" />
		</div>
	</div>

	<Popup v-model:show="showSearch" round position="right" :style="{height: '100%', width: '70%'}">
		<div class=" text-md p-2 text-gray-700 text-center">筛选数据</div>
		<!-- <CellGroup>
			<Cell size="large" title="开始时间" is-link :value="formatTime(searchDate.start)" @click="pickerDate.start = true" />
			<Cell size="large" title="结束时间" is-link :value="formatTime(searchDate.end)" @click="pickerDate.end = true" />
		</CellGroup> -->
		<div class=" border-t">

			<div class=" form-input py-3 px-2 flex items-center border-b">
				<div class=" text-sm">工单编号：</div>
				<div class=" flex-1">
					<Field v-model="searchDate.work_order_no" type="digit" placeholder="请输入工单编号" />
				</div>
			</div>

			<div class=" py-4 px-2 flex items-center border-b"  @click="pickerDate.status = true">
				<div class=" text-sm">工单状态：</div>
				<div class=" flex-1 text-sm text-gray-500">{{getColumnsLabel(searchDate.status)}}</div>
				<Icon name="arrow-down" />
			</div>
			
			<div class=" py-4 px-2 flex items-center border-b" @click="pickerDate.start = true">
				<div class=" text-sm">开始时间：</div>
				<div class=" flex-1 text-sm text-gray-500">{{formatTime(searchDate.start)}}</div>
				<Icon name="arrow-down" />
			</div>
			<div class=" py-4 px-2 flex items-center border-b" @click="pickerDate.end = true">
				<div class=" text-sm">结束时间：</div>
				<div class=" flex-1 text-sm text-gray-500">{{formatTime(searchDate.end)}}</div>
				<Icon name="arrow-down" />
			</div>
		</div>
		<div class=" absolute left-0 right-0 bottom-0 flex">
			<div class=" flex-1">
				<Button type="primary" block @click="primarySearch">确 认</Button>
			</div>
			<div class=" flex-1">
				<Button block @click="resetDate">重 置</Button>
			</div>
		</div>
	</Popup>

	<Popup v-model:show="pickerDate.status" round position="bottom">
		<Picker @confirm="statusConfirm" @cancel="pickerDate.status = false" :columns="columns" >
			<template #option="{label}">
				{{label}}
			</template>
		</Picker>
	</Popup>

	<Popup v-model:show="pickerDate.start" round position="bottom">
		<DatetimePicker
			v-model="searchDate.start"
			type="date"
			title="选择开始时间"
			:min-date="minTime"
			:max-date="maxTime"
			@confirm="pickerDate.start = false"
		/>
	</Popup>

	<Popup v-model:show="pickerDate.end" round position="bottom">
		<DatetimePicker
			v-model="searchDate.end"
			type="date"
			title="选择结算时间"
			:max-date="maxTime"
			@confirm="pickerDate.end = false"
		/>
	</Popup>

</template>

<script setup lang="jsx">
import { defineComponent, onMounted, ref, reactive, watch } from 'vue';
import { Icon, Pagination, Loading, NavBar, Popup, DatetimePicker, Button, Field, Picker, Empty } from 'vant';
import { format } from 'silly-datetime';
import { getWorkOrderList } from '@/api/';
import { useRouter } from 'vue-router';
const router = useRouter()
const isLoading = ref(false)
const pageConfig = reactive({
	total: 0,
	per_page: 10,
	current_page: 1
})

const workList = ref([])
onMounted(upDataList)
async function getWorkList(){
	isLoading.value = true
	try {
		const { work_order_no, status, admin_id, start, end } = searchDate
		const {data} = await getWorkOrderList({work_order_no, status, admin_id, work_order_time_start: formatTime(start), work_order_time_end: formatTime(end)})
		workList.value = data.data
		Object.assign(pageConfig, {
			total: data.total,
			per_page: data.per_page,
			current_page: data.current_page
		})
	} catch (error) {
		
	}
	isLoading.value = false
}
function upDataList(){
	pageConfig.current_page === 1 ?
	getWorkList() :
	pageConfig.current_page = 1
	// getFillingDetailList()
	showSearch.value = false
}
// '全部', '未完成', '完成', '忽略'
const columns = [
	{
		label: '全部',
		value: ''
	},
	{
		label: '待审核',
		value: '0'
	},
	{
		label: '已处理',
		value: '1'
	},
	{
		label: '忽略',
		value: '2'
	}
]
function getColumnsLabel(value){
	return columns.find(v => v.value == value)?.label || '全部'
}
function statusConfirm({value}){
	searchDate.status = value
	pickerDate.status = false
}
const initDate = {
	start: new Date(format(new Date(), 'YYYY/MM/DD 00:00:00')),
	end: new Date(format(new Date(), 'YYYY/MM/DD 23:59:59')),
}
const showSearch = ref(false)
const minTime = new Date(2000, 1, 1)
const maxTime = new Date()
const pickerDate = reactive({
	start: false,
	end: false,
	status: false,
})
const searchDate = reactive({
	work_order_no: undefined,
	status: undefined,
	admin_id: undefined,
	start: initDate.start,
	end: initDate.end,
})
function resetDate(){
	Object.assign(searchDate, {
		...initDate,
		work_order_no: undefined,
		status: undefined,
		admin_id: undefined,
	})
	upDataList()
}
function formatTime(date){
	return format(date)
}
function primarySearch(){
	upDataList()
}

function toWorkFeedback(){
	router.push('/workFeedback')
}

const OpenDetails = defineComponent({
	props: {
		info: Object
	},
	setup(props){
		const isOpen = ref(false)
		return () => (
			<>
				{
					isOpen.value && 
					<div class="p-2 pt-0 text-sm">
						<div>
							<span class=" text-gray-500 mr-2">反馈时间:</span>
							<span class=" text-gray-700">{props.info.work_order_time}</span>
						</div>
						<div>
							<span class=" text-gray-500 mr-2">更新时间:</span>
							<span class=" text-gray-700">{props.info.updated_at}</span>
						</div>
					</div>
				}
				{/* 任务详情 */}
				{
					isOpen.value &&
					<div class="card-box bg-gray-200 p-2 mx-2 mt-2 text-gray-600">
						<div class=" text-center text-sm font-bold">任务详情</div>
						<div class=" text-sm">
							<pre>{props.info.work_order_content}</pre>
						</div>
					</div>
				}
				
				<div class=" text-center text-blue-500 py-2 mt-2 border-t border text-sm" onClick={() => isOpen.value = !isOpen.value}>
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
.form-input:deep(.van-cell.van-field){
	padding: 0;
}
</style>