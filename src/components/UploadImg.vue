<template>
	<div class=" w-20 bg-gray-50 shadow-md h-20 rounded-md flex items-center justify-center text-xl relative">
		<!-- <Icon name="back-top" /> -->
		<template v-if="imgSrc">
			<img class=" max-w-full max-h-full" :src="'/data_api'+imgSrc" alt="" srcset="" />
			<div v-if="progress != 100" class=" absolute inset-0 flex items-center justify-center">
				<div class=" absolute inset-0 bg-black opacity-25 rounded-md"></div>
				<div class=" relative z-10 text-white">{{progress}}%</div>
			</div>
			<div v-else @click="removeImg" class=" text-white text-xs bg-red-500 leading-3 absolute -top-1 -right-1 p-1 border border-gray-300 rounded-full">
				<div class=" -mr-px">
					<Icon name="cross" />
				</div>
			</div>
		</template>
		<template v-else>
			<i class="van-badge__wrapper van-icon van-icon-photograph van-uploader__upload-icon"></i>
			<input class=" absolute inset-0 opacity-0" type="file" accept="image/*" @change="onChange" />
		</template>
		
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon, Toast } from 'vant';
import { upload, delFile } from '@/api/';
const props = defineProps({
	value: String
})
const emit = defineEmits(['change'])
const imgSrc = ref(props.value || '')
const progress = ref(props.value ? 100 : 0)
async function removeImg(){
	Toast.loading({
		message: '请求中...',
		forbidClick: true,
	});
	try {
		const res = await delFile({file_url: imgSrc.value})
		imgSrc.value = ''
		emit('change', '')
		Toast.success(res.msg || '成功')
	} catch (error) {
		
	}
}

function onChange(e){
	const file = e.target.files[0]
	const img = new Image()
	img.src = URL.createObjectURL(file)
	// console.log(img.src)
	imgSrc.value = img.src
	img.onload = async function(e){
		// console.log(img.naturalWidth, img.naturalHeight)
		const obj = {
			width: 1920,
			height: img.naturalHeight,
			type: file.type
		}
		if(img.naturalWidth > obj.width){
			obj.height = (obj.width / img.naturalWidth) * img.naturalHeight
		}else{
			obj.width = img.naturalWidth
		}
		const compressBlob = await compress(img, obj)
		// console.log(file)
		// console.log(compressBlob)
		// console.log(formatBytes(file.size))
		// console.log(formatBytes(compressBlob.size))
		// return;
		const compressFile = new File([compressBlob], file.name)
		uploadData(compressFile)
	}
}
function formatBytes(a, b) { 
	if (0 == a) return "0 B"; 
	var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); 
	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

function onUploadProgress(progressEvent){
	progress.value = (progressEvent.loaded / progressEvent.total * 100 | 0).toFixed(0)
}

function uploadData(file){
	const formData = new FormData()
	formData.append('file_type', 1)
	formData.append('file', file)
	upload(formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		onUploadProgress
	}).then(res => {
		imgSrc.value = res.data.file_url
		emit('change', res.data.file_url)
	})
}

function compress(file, {width, height,type}){
	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		canvas.width = width
		canvas.height = height
		const context = canvas.getContext('2d');
		context.drawImage(file, 0, 0, width, height);
		// console.log(canvas.toDataURL('image/jpeg'))
		canvas.toBlob(function(blob){
			// console.log(blob)
			resolve(blob)
		}, type || 'image/jpeg')
	})
}
</script>

<style scoped>
</style>