import login from '@/api/account/login';
import { LOGIN_TYPE } from '@/const';
import { ConnectState } from '@/models/connect';
import { searchResources } from '@/services/resource';
import { UserOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Divider, message, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, CurrentUser, ResourceType, UserModelType } from 'umi';
import styles from './index.less';

interface IProps {
  [props: string]: any;
}

const ResourceDetail: React.FC<IProps> = (props: IProps) => {
  const {
    location: { query },
    wholeTagsMap,
  } = props;
  const { originTags } = wholeTagsMap;

  const [resource, setResource] = useState<ResourceType>({} as ResourceType);
  const [resourceUserInfo, setResourceUserInfo] = useState<CurrentUser>(
    {} as CurrentUser,
  );

  // 获取这个资源的发布人
  const getResourceUserInfo = async () => {
    const { user_id } = resource;
    if (!user_id) {
      return;
    }
    try {
      const userInfo = await login({ type: LOGIN_TYPE.AUTO, userId: user_id });
      setResourceUserInfo(userInfo);
      console.log(userInfo, '......');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResourceUserInfo();
  }, [resource]);

  const initResource = async () => {
    try {
      // 从链接里面获取id
      const res = await searchResources({ _ids: [query.id] });
      setResource(res?.[0] ?? []);
      getResourceUserInfo();
    } catch (error) {
      message.error('获取资源错误，请稍后重试');
      console.log(error, '...错误');
    }
  };
  useEffect(() => {
    initResource();
  }, []);

  const avatorTime = (
    <div>
      <span>
        {moment(resource.create_time as number).format('YYYY-MM-DD HH:MM')}
      </span>
      <span style={{ margin: '0 10px' }}>
        <Divider type="vertical" />
      </span>
      <span>阅读: 1231</span>
    </div>
  );

  return (
    <div style={{ padding: '0 180px' }}>
      <GridContent>
        <Row gutter={24}>
          <Col span={18} xl={17} lg={17} xs={17}>
            <Card>
              <Card.Meta
                avatar={<Avatar size="large" src={resource?.head_img} />}
                title={resource?.name}
                description={avatorTime}
              />
              {/* <SimilarResources resource={resource} /> */}
              <Divider />
              相似资源
            </Card>
          </Col>
          <Col span={6} xl={7} lg={7} xs={7}>
            <Card title="帖子信息" hoverable>
              <div className={styles.resourceInfo}>
                <span>发布者头像：</span>
                {/* 这里后续可以加上大类 */}
                <div className={styles.desc}>
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    alt="头像"
                    src={resourceUserInfo.head_img}
                  />
                </div>
              </div>
              <div className={styles.resourceInfo}>
                <span>发布者：</span>
                {/* 这里后续可以加上大类 */}
                <span className={styles.desc}>{resourceUserInfo.nickname}</span>
              </div>
              <div className={styles.resourceInfo}>
                <span>分类：</span>
                {/* 这里后续可以加上大类 */}
                <span className={styles.desc}>资源</span>
              </div>
              <div
                className={styles.resourceInfo}
                style={{ marginTop: '10px' }}
              >
                <span>标签：</span>
                <div className={styles.desc}>
                  {resource?.tags?.map((item) => (
                    <Tag>{originTags?.getLabel?.(item) || '--'}</Tag>
                  ))}
                </div>
              </div>
            </Card>
            <Card title="作者分享" hoverable style={{ marginTop: '30px' }}>
              {/* <SimilarResources resource={resource} /> */}
              相似资源
            </Card>
          </Col>
        </Row>
      </GridContent>
    </div>
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  wholeTagsMap: tag.wholeTagsMap,
  currentUser: user.currentUser,
}))(ResourceDetail);
