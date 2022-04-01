export const emptyObject = (data: { [propsName: string]: any }) => {
  Object.keys(data).map((k) => delete data[k]);
  return data;
};

function isObject(value: any) {
  return value === Object(value);
}

function isArray(value: any) {
  return Array.isArray(value);
}

function makeArrayKey(key: string | string[]) {
  if (key.length > 2 && key.lastIndexOf("[]") === key.length - 2) {
    return key;
  } else {
    return key + "[]";
  }
}

/**
 * 格式化
 * @param {*} obj
 * @param {*} resultObj
 * @param {*} pre
 */
export function objectToFormData(
  obj: { [propsName: string]: any },
  resultObj: { [propsName: string]: any },
  pre?: string
) {
  resultObj = resultObj || {};
  Object.keys(obj).forEach(function (prop) {
    var key = pre ? pre + "[" + prop + "]" : '['+ prop +']';
    if (isObject(obj[prop]) && !isArray(obj[prop])) {
			if(obj[prop] instanceof File ){
				resultObj[key] = obj[prop]
			}else{
				objectToFormData(obj[prop], resultObj, key);
			}
    } else if (isArray(obj[prop])) {
      obj[prop].forEach(function (value: any, i: number) {
        var arrayKey = key + "[" + i + "]";
        if (isObject(value)) {
          objectToFormData(value, resultObj, arrayKey);
        } else {
          resultObj[arrayKey] = value;
        }
      });
    } else {
      
			(obj[prop] !== "" && obj[prop] !== null)
        ? (resultObj[key] = obj[prop])
        : null;
    }
  });
  // console.log(resultObj)
  return resultObj;
  // return resultArr.join("&")
}
// 获取上一个月
export function getLastMonth(date?: Date): {year: number, month: number}{//获取上个月日期
  date = date || new Date(); 
  var year = date.getFullYear();
  var month = date.getMonth();
  if(month == 0){
    year = year -1;
    month = 12; 
  }
  return {year, month}
}

// 获取月份最后一天
export function getLastDate(year: number, month: number){
  const d = new Date(year, month, 0)
  return d.getDate()
}