export const hasClass = (el, cls) => {
  return el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};

export const removeClass = function(el, cls) {
  if (hasClass(el, cls)) {
    var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
};

export const addClass = function(el, cls) {
  if (!hasClass(el, cls)) el.className += " " + cls;
};

export const addPayOrWithdrawalClass = function(el, cls) {
  if (!hasClass(el, cls)) el.className += cls;
};

export const toggleClass = (el, cls) => {
  if (hasClass(el, cls)) {
    removeClass(el, cls);
  } else {
    addClass(el, cls);
  }
};

export const siblings = function(elem) {
  var nodes = [];
  var previ = elem.previousSibling;
  while (previ) {
    if (previ.nodeType === 1) {
      nodes.push(previ);
    }
    previ = previ.previousSibling;
  }
  nodes.reverse();
  var nexts = elem.nextSibling;
  while (nexts) {
    if (nexts.nodeType === 1) {
      nodes.push(nexts);
    }
    nexts = nexts.nextSibling;
  }
  return nodes;
};

export const initNumber = function(number, num) {
  if (!number) return "0.00";
  let index = parseInt(num);
  if (/\./.test(`${number}`)) {
    let arr = `${number}`.split(".");
    if (arr[1].length >= index) {
      return `${arr[0]}.` + `${arr[1]}`.slice(0, index);
    }
    let prics = arr[1];
    for (let i = 0; i < index - arr[1].length; i++) {
      prics += "0";
    }
    return (number = `${arr[0]}.${prics}`);
  }

  number = `${number}.`;
  for (let j = 0; j < index; j++) {
    number += "0";
  }
  return number.replace(/(\.*$)/g, "");
};
/**
 * @description 函数节流
 * @param {Function} method 待执行的函数
 * @param {Context} context 函数执行上下文
 * @param {Number} delay 延时时间 毫秒
 * @param {Array} args 传递给函数的参数
 */
export const throttle = function throttle(
  method,
  context,
  delay = 200,
  ...args
) {
  method.timer && clearTimeout(method.timer);
  method.timer = setTimeout(() => {
    method.call(context, ...args);
  }, delay);
};

const extractSearch = function extractSearch(input) {
  const queryStart = input.indexOf("?");
  if (queryStart === -1) {
    return "";
  }
  return input.slice(queryStart + 1);
};

/**
 * @description 将 URL 的查询部分解析为键值对形式（不对 hash 部分进行解析）
 * @param {String} input URL
 */
export const parseUrl = function parseUrl(input) {
  let searchStr = extractSearch(input);

  const ret = Object.create(null);

  searchStr = searchStr.trim().replace(/^[?#&]/, "");

  for (const param of searchStr.split("&")) {
    let [key, value] = param.replace(/\+/g, " ").split("=");
    if (key) {
      ret[key] = value ? value : null;
    }
  }

  return {
    url: input.split("?")[0] || "",
    query: ret,
  };
};

export const isNumber = function isNumber(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

//倒计时
export const leftTimer = (endTime) => {
  const startTime = new Date();
  let leftTime = endTime - startTime; //计算剩余的毫秒数
  let data = {};
  if (leftTime > 0) {
    let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
    let minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
    let seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
    days = checkTime(days);
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    data = { days: days, hours: hours, minutes: minutes, seconds: seconds };
    return data;
  }
};
export const checkTime = (i) => {
  //将0-9的数字前面加上0，例1变为01
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};
