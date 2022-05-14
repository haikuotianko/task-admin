
// 使用微信api
export function useWxApi(){
	return new Promise(function(resolve, reject) {
    var script = document.createElement("script")
    script.type = "text/javascript"
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.onerror = reject
    document.head.appendChild(script)
		console.log(getWxApi())
		if(getWxApi()){
			return resolve(getWxApi())
		}
		
		const loadTime = setInterval(function(){
			if(getWxApi()){
				clearInterval(loadTime)
				resolve(getWxApi())
			}
		}, 50)
  })
}

// 获取微信api对象
function getWxApi(){
	return window['wx']
}
// {
// 	debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
// 	appId: '', // 必填，公众号的唯一标识
// 	timestamp: '', // 必填，生成签名的时间戳
// 	nonceStr: '', // 必填，生成签名的随机串
// 	signature: '',// 必填，签名
// 	jsApiList: [] // 必填，需要使用的JS接口列表
// }
// 微信api权限注入
export function useWxApiConfig(config){
	return new Promise(function(resolve, reject){
		const waApi = getWxApi()
		function success(){
			resolve(waApi)
		}
		waApi.ready(function(){
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
			if (typeof WeixinJSBridge == "undefined") {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', success, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', success);
					document.attachEvent('onWeixinJSBridgeReady', success);
				}
			}else{
				success()
			}
		});
		wx.error(function(res){
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			reject('初始化定位权限失败')
		});
		wx.config(config);
	})
	
}

// 获取定位
export function getLocation(type = 'gcj02'){
	return new Promise(function(success, reject){
		getWxApi().getLocation({
			type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success,
			cancel: function(){
				reject('用户取消定位!')
			},
			fail: function() {
				reject('获取定位失败，请开启定位后再试!')
			}
		});
	})
}

// 导航
export function useOpenLocation(config){
	return new Promise(function(success, reject){
		getWxApi().openLocation({
			// latitude: 0, // 纬度，浮点数，范围为90 ~ -90
			// longitude: 0, // 经度，浮点数，范围为180 ~ -180。
			// name: '', // 位置名
			// address: '', // 地址详情说明
			// scale: 1, // 地图缩放级别,整型值,范围从1~28。默认为最大
			// infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
			success,
			fail: function() {
				reject('导航失败!')
			},
			...config
		});
	})
}