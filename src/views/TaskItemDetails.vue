<template>
	<NavBar
		:title="'【' + machineName + '】任务详情'"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft"
	/>

	<div class=" m-4 rounded-lg overflow-hidden shadow-md">
		<NoticeBar v-if="formData.status == 1" left-icon="info-o" wrapable color="#fff" background="#00c853"> 完成任务！</NoticeBar>
		<NoticeBar v-else-if="formData.status == 2" left-icon="info-o" wrapable > 任务反馈异常! </NoticeBar>
	</div>
	
	<div class=" py-2">
		<CellGroup inset>
			<Field :modelValue="formData.task_name" readonly label-width="65px" label="反馈标题" placeholder="请输入反馈标题" />
			<div class=" flex flex-wrap border-b border-gray-50" style="padding: 10px 16px;">
				<div class=" text-sm text-gray-500 mb-2" style="width: 65px;">图片上传</div>
				<div class=" flex flex-wrap">
						<template v-for="(item, index) in formData.file" :key="item + index">
							<div class=" mb-2 mr-2" @click="showImg(index)">
								<img class=" h-20 rounded-md" :src="item.file_url" alt="" srcset="">
							</div>
						</template>
					</div>
			</div>
			<Field 
				:modelValue="formData.task_content"
				readonly
				label-width="65px"
				label="反馈内容" 
				placeholder="请输入反馈内容"  
				rows="2"
				autosize
				type="textarea"
				maxlength="200"
				show-word-limit 
			/>
		</CellGroup>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NavBar, NoticeBar, CellGroup, Field, ImagePreview } from 'vant';
import { taskMachineInfo } from '@/api';
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