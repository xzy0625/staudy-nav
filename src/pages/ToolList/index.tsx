import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
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
import numeral from 'numeral';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import { useRequest } from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import type { IPagination, ListItemDataType } from './type';
import { queryFakeList } from './service';
import styles from './style.less';
import getTags from '@/api/tags';
import { defaultPagination } from '@/const';

const { Option } = Select;

export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
}> = ({ activeUser, newUser }) => (
  <div className={styles.cardInfo}>
    <div>
      <p>活跃用户</p>
      <p>{activeUser}</p>
    </div>
    <div>
      <p>新增用户</p>
      <p>{newUser}</p>
    </div>
  </div>
);

export const ToolList: FC<Record<string, any>> = () => {
  // 标签数据
  const [tags, setTags]: [IAnyObject, any] = useState({});
  // 分页数据
  const [pagination, setPagination]: [IPagination, any] =
    useState(defaultPagination);

  const { data, loading, run } = useRequest((values: any) => {
    console.log('form data', values);
    return queryFakeList({
      count: 12,
    });
  });

  const list = data?.list || [];

  // const itemMenu = (
  //   <Menu>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
  //         1st menu item
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
  //         2nd menu item
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
  //         3d menu item
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // );

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
  const getListData = () => {
    const { page, pagesize } = pagination;
  };

  const onPaginationChange = (
    page: IPagination['page'],
    pagesize: IPagination['pageSize'],
  ) => {
    console.log(page, pagesize, '......changee');
  };
  // 初始化数据
  useEffect(() => {
    initTags();
  }, []);

  return (
    <div className={styles.filterCardList}>
      <Card bordered={false}>
        <Form
          onValuesChange={(_, values) => {
            run(values);
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
      <List<ListItemDataType>
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
        dataSource={list}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{ paddingBottom: 20 }}
              actions={[
                <Tooltip key="download" title="下载">
                  <DownloadOutlined />
                </Tooltip>,
                <Tooltip key="edit" title="编辑">
                  <EditOutlined />
                </Tooltip>,
                <Tooltip title="分享" key="share">
                  <ShareAltOutlined />
                </Tooltip>,
                // <Dropdown key="ellipsis" overlay={itemMenu}>
                //   <EllipsisOutlined />
                // </Dropdown>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar size="small" src={item.avatar} />}
                title={item.title}
              />
              <div className={styles.cardItemContent}>
                <CardInfo
                  activeUser={formatWan(item.activeUser)}
                  newUser={numeral(item.newUser).format('0,0')}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
      <div className={styles.pagination}>
        <Pagination
          total={85}
          showTotal={(total = 100) => `共 ${total} 条资源`}
          defaultPageSize={pagination.pageSize}
          defaultCurrent={pagination.page}
          onChange={onPaginationChange}
          pageSizeOptions={[12, 16, 24, 36, 44]}
        />
      </div>
    </div>
  );
};

export default ToolList;
