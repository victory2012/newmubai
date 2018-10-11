export default function () {
  let ua = window.navigator.userAgent;
  let isWeixin;

  if (/MicroMessenger/i.test(ua)) {
    isWeixin = true;
  } else {
    isWeixin = false;
  }
  return isWeixin;
}
