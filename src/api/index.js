import request from '@/api/request.ts'
const baseURL = '/data_api/index.php/sys'

// const requestPost = (url: string, data?: Object, config?:Object):Promise<{
// 	code?: Number,
// 	data?: any,
// 	msg?: string,
// 	errcode?: Number,
// }> => request.post(url, data, config)

/**
 * 登录
 */
const loginBase = baseURL + '/user_tas'
// 登录
// export const taskMachineInfo = (data?: Object) => requestPost(loginBase + '/taskMachineInfo', data, {noShowTips: false, noLogin: true})


/**
 * 巡检系统
 */
const usesTask = baseURL + '/user_task'
// 任务列表
export const getTaskList = (data) => request.post(usesTask + '/taskList', data)
// 任务的设备列表
export const taskMachineInfo = (data) => request.post(usesTask + '/taskMachineInfo', data)
