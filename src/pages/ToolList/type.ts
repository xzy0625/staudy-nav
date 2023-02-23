export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export interface Params {
  count: number;
}

// 页面类型
export interface IPagination {
  pageSize: number;
  total: number;
  page: number;
  [props: string]: any;
}
