<template>
	<div class=" h-full flex flex-col">
		<NavBar
			:title="'【' + machineName + '】任务详情'"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>

		<div class=" flex-1 overflow-y-auto py-3">
			<div class=" mx-4 rounded-lg overflow-hidden shadow-md">
				<NoticeBar v-if="formData.status == 1" left-icon="info-o" wrapable color="#fff" background="#00c853"> 完成任务！</NoticeBar>
				<NoticeBar v-else-if="formData.status == 2" left-icon="info-o" wrapable > 任务反馈异常! </NoticeBar>
			</div>
			
			<div class=" py-2">
				<div class=" pl-5 pb-2 text-gray-600 text-lg font-bold">任务内容</div>
				<CellGroup inset>
					<Field :modelValue="formData.task_name" readonly label-width="65px" label="任务标题" />
					<Field :modelValue="formData.user_task_no" readonly label-width="65px" label="任务编号" />
					<Field :modelValue="levConfig[formData.lev]" readonly label-width="65px" label="任务等级" />
					<Field :modelValue="formData.machine_name" readonly label-width="65px" label="设备名称" />
					<Field :modelValue="formData.machine_code" readonly label-width="65px" label="设备编号" />
					<Field :modelValue="formData.created_at" readonly label-width="65px" label="生产时间" />
					<Field 
						:modelValue="formData.task_content"
						readonly
						label-width="65px"
						label="任务内容" 
						rows="2"
						autosize
						type="textarea"
						show-word-limit 
					/>
				</CellGroup>
			</div>

			<div class=" py-2" v-if="formData.status == 1">
				<div class=" pl-5 pb-2 text-gray-600 text-lg font-bold">完成情况</div>
				<CellGroup inset>
					<Field :modelValue="formData.question_time" readonly label-width="65px" label="完成时间" />
					<Field 
						:modelValue="formData.over_remark"
						readonly 
						label-width="65px"
						label="完成备注" 
						rows="2"
						autosize
						type="textarea"
						maxlength="200"
						show-word-limit 
					/>
					
				</CellGroup>
			</div>

			<div class=" py-2" v-if="formData.status == 2">
				<div class=" pl-5 pb-2 text-gray-600 text-lg font-bold">我的反馈</div>
				<CellGroup inset>
					<Field :modelValue="formData.question_title" readonly label-width="65px" label="反馈标题" />
					<Field :modelValue="formData.question_time" readonly label-width="65px" label="反馈时间" />
					<div class=" flex flex-wrap border-b border-gray-50" style="padding: 10px 16px;">
						<div class=" text-sm text-gray-500 mb-2" style="width: 65px;">反馈图片</div>
						<div class=" flex flex-wrap">
								<template v-for="(item, index) in formData.file" :key="item + index">
									<div class=" mb-2 mr-2" @click="showImg(index)">
										<img class=" h-20 rounded-md" :src="item.file_url" alt="" srcset="">
									</div>
								</template>
							</div>
					</div>
					<Field 
						:modelValue="formData.question_content"
						readonly 
						label-width="65px"
						label="反馈内容" 
						rows="2"
						autosize
						type="textarea"
						maxlength="200"
						show-word-limit 
					/>
					
				</CellGroup>
			</div>
		</div>

	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NavBar, NoticeBar, CellGroup, Field, ImagePreview } from 'vant';
import { taskMachineInfo } from '@/api';
import { useTaskStores } from '@/stores/task';
const { levConfig } = useTaskStores()
const route = useRoute()
const router = useRouter()
const userTaskNo = route.params.id
const machineName = ref(route.query.machine_name || '')
const machineId = ref(route.query.machine_id || '')
const onClickLeft = () => {
	router.back()
}

const formData = reactive({
	task_name: '',
	task_content: '',
	question_title: '',
	question_content: '',
	file: []
})

onMounted(async () => {
	const { data } = await taskMachineInfo({
		user_task_no: userTaskNo,
		machine_id: machineId.value
	})

	Object.assign(formData, data.data[0])
	console.log(formData)
})

function showImg(index){
	ImagePreview({
		images: formData.file.map(v => v.file_url),
		startPosition: index,
	});
}

</script>

<style scoped>
</style>