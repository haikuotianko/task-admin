<template>
	<div class="flex flex-col h-full relative">
		<NavBar
			:title="'【' + title + '】问题反馈'"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>

		<div class=" m-3 rounded-lg overflow-hidden">
			<NoticeBar left-icon="info-o" wrapable>
				您反馈的问题将由后台管理员审核。
				请您尽量描述清楚您发现的问题。
				如有需要您也可以拍照上传图片！
			</NoticeBar>
		</div>

		<div class=" py-2">
			<CellGroup inset>
				<Field v-model="formData.question_title" label-width="65px" required label="反馈标题" placeholder="请输入反馈标题" />
				<div class=" flex flex-wrap border-b border-gray-50" style="padding: 10px 16px;">
					<div class=" text-sm text-gray-500 text-center mr-3 mb-2" style="width: 65px;">图片上传</div>
					<div class=" flex flex-wrap">
							<template v-for="(item, index) in imgList" :key="item + index">
								<div class=" mb-2 mr-2">
									<UploadImg :value="item" @change="v => changeImgList(v, index)" />
									<!-- <div class=" w-2"></div> -->
								</div>
							</template>
						</div>
				</div>
				<Field 
					v-model="formData.question_content"
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
		<div class=" m-3">
			<Button :loading="isLoading" block round color="linear-gradient(to right, #ff6034, #ee0a24)" :disabled="!formData.question_title" @click="sendForm">确认反馈</Button>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NavBar, NoticeBar, CellGroup, Field, Button, Notify } from 'vant';
import UploadImg from '@/components/UploadImg.vue';
import { questionTaskMachine } from '@/api';
const route = useRoute()
const router = useRouter()
const MachineId = route.params.id
const title = ref(route.query.title || '')
const onClickLeft = () => {
	router.back()
}
const formData = reactive({
	question_title: '',
	question_content: '',
})
const imgList = ref([''])
function changeImgList(img, index){
	if(!img){
		imgList.value.splice(index, 1)
		if(imgList.value.indexOf('') == -1){
			imgList.value.push('')
		}
	}else{
		imgList.value[index] = img
		if(imgList.value.length < 6){
			imgList.value.push('')
		}
	}
}
const isLoading = ref(false)
async function sendForm(){
	isLoading.value = true
	try {
		const res = await questionTaskMachine({...formData, id: MachineId, media: imgList.value.filter(v => v).map(v => ({file_type: 1, file_url: v}))})
		Notify({type: 'success', message: res.msg})
		router.back()
	} catch (error) {
		
	}
	isLoading.value = false
}

</script>

<style scoped>
</style>