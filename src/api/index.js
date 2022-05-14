import request from '@/api/request'
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
const loginBase = baseURL + '/Login'
// export const loginOut = (data) => requestPost(loginBase + '/loginOut', data, {noShowTips: false, noLogin: true})
// 退出登录
export const loginOut = (data) => request.post(loginBase + '/loginOut', data)

/**
 * 文件系统
 */
const fileBase = baseURL + '/file_handle'
// export const fileOut = (data) => requestPost(loginBase + '/loginOut', data, {noShowTips: false, noLogin: true})
// 上传文件
export const upload = (data, config) => request.post(fileBase + '/upload', data, config)
// 删除文件
export const delFile = (data) => request.post(fileBase + '/del', data)


/**
 * 巡检系统
 */
const usesTask = baseURL + '/user_task'
// 获取公众号配置
export const getWxConfig = (data) => request.post(usesTask + '/config', data)
// 任务列表
export const getTaskList = (data) => request.post(usesTask + '/taskList', data)
// 完成任务
export const overTaskMachine = (data) => request.post(usesTask + '/overTaskMachine', data)
// 任务的设备列表
export const taskMachineInfo = (data) => request.post(usesTask + '/taskMachineInfo', data)
// 发起问题(针对任务的机器)
export const questionTaskMachine = (data) => request.post(usesTask + '/questionTaskMachine', data)
// 工单列表
export const getWorkOrderList = (data) => request.post(usesTask + '/workOrderList', data)
// 发起工单
export const sendworkOrder = (data) => request.post(usesTask + '/workOrder', data)
// 巡检管理员列表
export const getAdminList = (data) => request.post(usesTask + '/userList', data)
