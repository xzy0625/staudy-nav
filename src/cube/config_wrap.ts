import _ from 'lodash';

type ConfigItem = {
  /**
   * 定义一个枚举名字
   */
  key: string;
  /**
   * 枚举对应的值
   */
  value: any;
  /**
   * 用户看到的名字
   */
  label: string;
  /**
   * 重新指定索引
   */
  index: number;
  [prop: string]: any;
};
export type PartialConfigItem = {
  key: string;
  index?: number;
  value?: any;
  label?: string;
  [prop: string]: any;
};

/**
 * 包装一个配置信息，参数可以是对象的方式，也可以是数组的方式。数组必须要 加 as const 才能显示常量
 */
export function configWrap<
  T extends ReadonlyArray<PartialConfigItem> | Record<string, string | number>,
>(objectOrArrayData: T) {
  type UnionKeys = T extends ReadonlyArray<PartialConfigItem>
    ? T[number]['key']
    : keyof T;
  type ResultType = T extends ReadonlyArray<PartialConfigItem>
    ? { [p in UnionKeys]: any }
    : { [p in UnionKeys]: any };
  const result = {} as ResultType;
  const labels = {} as IAnyObject;
  let innerList = [] as ConfigItem[];

  /**
   * 入参是数组，value和label字段可选，key必填
   * 1. 没有value字段，默认使用key当成value
   * 2. 没有label字段，默认使用value当成label（value满足规则1）
   */
  if (_.isArray(objectOrArrayData)) {
    innerList = objectOrArrayData.map((item, index) => {
      const tmp = { ...item };
      if (tmp.index === undefined) tmp.index = index;
      if (tmp.value === undefined) tmp.value = tmp.key;
      if (tmp.label === undefined) tmp.label = tmp.value;
      return tmp;
    });
    /**
     * 入参是对象
     */
  } else {
    innerList = Object.entries(objectOrArrayData).map(
      ([key, label], index) => ({
        key,
        label,
        index,
        value: key,
      }),
    );
  }

  /**
   * 1. labels处理成通过key和value都能找到label（为了满足不同的使用场景）
   * 2. reslut最终会直接结构到返回的实例属性中，也就可以通过实例的属性直接访问到value
   */
  innerList.forEach((item) => {
    labels[item.key] = item.label;
    labels[item.value] = item.label;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[item.key] = item.value;
  });

  return {
    ...result,
    /**
     * 通过 key 或者 value 返回其标签名
     * @param keyOrValue key或value的值
     * @param defaultLabel 不存在时，返回的名字
     */
    getLabel(keyOrValue: string, defaultLabel = '--') {
      return _.get(labels, keyOrValue, defaultLabel);
    },
    /**
     * 根据索引返回指定的项
     * @param index 索引
     */
    getByIndex(index: number) {
      return innerList.find((e) => e.index === index);
    },
    /**
     * 根据 key or value 获取Item
     * @param keyOrValue key or value
     * @returns item
     */
    getItemBy(keyOrValue: string) {
      return innerList.find(
        (e) => e.key === keyOrValue || e.value === keyOrValue,
      );
    },
    /**
     * 获取所有的项，一般用于界面UI显示
     */
    entries() {
      return innerList.map((item) => item);
    },
  };
}
