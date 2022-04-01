import request from './request'
const baseURL = '/admin.php'

const requestPost = (url: string, data?: Object, config?:Object):Promise<{
	code?: Number,
	data?: any,
	msg?: string,
	errcode?: Number,
}> => request.post(url, data, config)

/**
 * 登录
 */
const loginBase = baseURL + '/Login'
// 登录
export const checkLogin = (data?: Object) => requestPost(loginBase + '/checkLogin', data, {noShowTips: false, noLogin: true})
// 验证码
export const Captcha = (data?: Object) => requestPost(loginBase + '/getCaptcha', data, {noShowTips: true, noLogin: true})
// 退出登录
export const loginout = (data?: Object) => requestPost(loginBase + '/loginout', data, {noShowTips: true, noLogin: true})
