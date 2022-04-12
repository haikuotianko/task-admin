import axios from 'axios'
import { Notify } from 'vant';
const request = axios.create({
	// 请求协议和域名
	baseURL: process.env.NODE_ENV === 'production'
	? ''
	: '/api',
	// 超时时间
	timeout: 10000,
	// 请求头
	// headers: {'X-Custom-Header': 'foobar'}
	// `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
	// console.log(config)
	return config
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
	// console.log(response)
	const config = {
		noShowTips: false, // 错误弹窗提示
		noLogin: false, // 需登录
		...response.config,
	}
	
	if(response.data.hasOwnProperty('status') && response.data.status === false){
		
		if(!config.noShowTips){
			// Toast.fail(response.data.msg)
			Notify({ type: 'danger', message: response.data?.msg || '请求错误' })
		}
		if(response.data.code === 401 && !config.noLogin){
			// Toast.fail(response.data.msg)
			// Object.values(requestObj).map(abort => abort())
			// Notify({ type: 'danger', message: response.data?.msg || '请登录' })
			location.replace(location.origin + location.pathname + '#/login')
			// history.replaceState(null, '', location.origin + location.pathname + '#/login')
			return Promise.reject({message: response.data?.msg || '请登录'});
		}
		return Promise.reject(response.data);
	}
	// 对响应数据做点什么
	return response.data;
}, function (error) {
	// console.log([error])
	console.warn(error.message, ':', error.config?.url)
	// Toast.fail('请求异常！请稍后再试')
	Notify({ type: 'danger', message: error.message || '请求异常！请稍后再试' })
	// 对响应错误做点什么
	return Promise.reject(error);
});

export default request