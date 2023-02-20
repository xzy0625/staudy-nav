import type { Effect, Reducer } from 'umi';
import { message } from 'antd';
import getTags from '@/api/tags';
import { PartialConfigItem } from '@/cube/config_wrap';

type GroupTag = PartialConfigItem;
export type TagType = GroupTag;

declare type categoryTagsMapType = Record<
  string,
  { must: string; tags: string[] }
>;

export interface WholeTagsMap {
  hotTags: TagType[];
  allTags: TagType[];
  groupTags: TagType[];
  userIntroduceGroupTags: GroupTag[];
  categoryTagsMap: categoryTagsMapType;
}

export interface TagModelState {
  wholeTagsMap: WholeTagsMap;
}

export interface TagModelType {
  namespace: 'tag';
  state: TagModelState;
  effects: {
    get: Effect;
  };
  reducers: {
    setWholeTagsMap: Reducer<TagModelState>;
  };
}

const Model: TagModelType = {
  namespace: 'tag',

  state: {
    wholeTagsMap: {
      hotTags: [],
      groupTags: [],
      userIntroduceGroupTags: [],
      allTags: [],
      categoryTagsMap: {},
    },
  },

  effects: {
    // 获取所有的标签
    *get({ payload }, { call, put }) {
      const response = yield call(getTags, payload);
      if (response) {
        yield put({
          type: 'setWholeTagsMap',
          payload: {
            allTags: response.entries(),
          },
        });
      } else {
        message.error('获取标签失败，请刷新页面');
      }
    },
  },

  reducers: {
    setWholeTagsMap(state, action) {
      return {
        ...state,
        wholeTagsMap: action.payload,
      };
    },
  },
};

export default Model;
