import {
  Avatar,
  Card,
  Col,
  Dropdown,
  Form,
  List,
  Menu,
  message,
  Pagination,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import { ResourceType } from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import type { IPagination } from './type';
import styles from './style.less';
import getTags from '@/api/tags';
import { defaultPagination } from '@/const';
import ResourceCard from '@/components/ResourceCard';
import {
  ResourceSearchParams,
  searchResourcesByPage,
} from '../../services/resource';

interface IProps {
  extraCondition?: {};
}

export const ToolList: FC<IProps> = ({ extraCondition }: IProps) => {
  // 标签数据
  const [tags, setTags]: [IAnyObject, any] = useState({});
  // 分页数据
  const [pagination, setPagination]: [IPagination, any] =
    useState(defaultPagination);
  // 是否在加载
  const [loading, setLoading] = useState<boolean>(false);
  // 资源数据
  const [resourceData, setResourceData] = useState<ResourceType[]>(
    [] as ResourceType[],
  );
  const [total, setTotal] = useState(0);

  // 初始化标签数据
  const initTags = async () => {
    try {
      const tagsdata = await getTags();
      setTags(tagsdata as IAnyObject);
    } catch (error) {
      message.error(error);
    }
  };

  // 获取列表数据
  const getListData = async (condition: ResourceSearchParams) => {
    setLoading(true);
    try {
      const data = await searchResourcesByPage({
        ...condition,
        ...extraCondition,
      });
      setResourceData(data?.data || []);
      setTotal(data.total ?? 0);
    } catch (error) {
      message.error('获取资源数据失败，请刷新后再重试');
    } finally {
      setLoading(false);
    }
  };

  const onPaginationChange = (
    page: IPagination['page'],
    pageSize: IPagination['pageSize'],
  ) => {
    setPagination({
      page,
      pageSize,
    });
    getListData({ pageNum: page, pageSize });
  };

  // 选了标签之后需要重新拉取数据
  const onValuesChange = (value: any) => {
    setPagination({ ...pagination, page: 1 });
    getListData({
      pageNum: 1,
      pageSize: pagination.pageSize,
      tags: value.category.length === tags.length ? [] : value.category,
    });
  };

  // 初始化数据
  useEffect(() => {
    initTags();
    getListData({});
  }, [extraCondition]);

  return (
    <div className={styles.filterCardList}>
      <Card bordered={false}>
        <Form
          onValuesChange={(_, values) => {
            onValuesChange(values);
          }}
        >
          <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
            <Form.Item name="category">
              <TagSelect expandable>
                {tags?.entries &&
                  tags
                    ?.entries()
                    ?.map((item: any, index: any) => (
                      <TagSelect.Option value={item.value}>
                        {item.label || '--'}
                      </TagSelect.Option>
                    ))}
              </TagSelect>
            </Form.Item>
          </StandardFormRow>
        </Form>
      </Card>
      <br />
      <List<ResourceType>
        rowKey="id"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={resourceData}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <ResourceCard resource={item} />
          </List.Item>
        )}
      />
      <div className={styles.pagination}>
        <Pagination
          total={total}
          showTotal={(total = total) => `共 ${total} 条资源`}
          defaultPageSize={pagination.pageSize}
          onChange={onPaginationChange}
          current={pagination.page}
          showSizeChanger
          pageSizeOptions={[12, 16, 24, 36, 44]}
        />
      </div>
    </div>
  );
};

export default ToolList;
