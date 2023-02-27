import { WEB_HOST } from '@/const';
import { ResourceType } from '@/models/resource';
import { addShareNum } from '@/services/resource';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { parse } from 'querystring';

export const validatePhnoeNubmer = (phone: string) => {
  const isEmpty = phone === '' || phone === null || phone === undefined;
  //判断手机号格式是否正确
  const regExp = /^1[3456789]\d{9}$/;
  return regExp.test(phone) && !isEmpty;
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const sleep = (time: number) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(null);
    }, time),
  );

/**
 * 让查询支持分页
 * @param query
 * @param pageSize
 * @param pageNum
 */
export const wrapPageQuery = (
  query: any,
  pageSize?: number,
  pageNum?: number,
) => {
  if (pageSize) {
    query = query.limit(pageSize);
    if (pageNum) {
      query = query.skip(pageSize * (pageNum - 1));
    }
  }
  return query;
};

/**
 * 获取评分
 */
export const getRate = (resource?: ResourceType) => {
  // 3 人评论才有效
  if (
    !resource ||
    !resource.rate ||
    !resource.rateNum ||
    resource.rateNum < 3
  ) {
    return null;
  }
  return Math.min(resource.rate + 0.5, 5);
};

/**
 * 美化文本
 *
 * @param str
 */
export const beautifyDetail = (str: string) => {
  str = str.replace(/\n/g, '<br/>');
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  if (str.length && reg.exec(str)) {
    return str.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>");
  }
  return str;
};

// 检测url是否正确
export const URL_REG =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/**
 * 分享资源
 */
export const doShare = async (resource?: ResourceType) => {
  // 复制到剪切板，分享数 +1
  if (resource && resource._id) {
    copy(
      `我在学习导航发现了『 ${resource.name} 』💎 快来看看 ${WEB_HOST}/resourseDetail/?id=${resource._id}`,
    );
    message.success('链接已复制到剪切板，感谢分享！');
  }
};

export const getLeftTime = () => {
  var curDate = new Date();

  //当前时间戳
  var curTamp = curDate.getTime();

  //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
  var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;

  //当日已经过去的时间（毫秒）
  var passedTamp = curTamp - curWeeHours;

  //当日剩余时间
  var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
  var leftTime = new Date();
  leftTime.setTime(leftTamp + curTamp);

  return leftTime;
};

export function preloadingImages(arr: any[]) {
  arr.forEach((item) => {
    const img = new Image();
    img.src = item;
  });
}
