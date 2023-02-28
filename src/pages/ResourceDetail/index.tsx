import login from '@/api/account/login';
import MarkdownEditor from '@/components/MarkdownEditor';
import PreviewAvator from '@/components/PreviewAvator';
import ResourceCard from '@/components/ResourceCard';
import { LOGIN_TYPE, RESOURCE_TAB_TYPE } from '@/const';
import { ConnectState } from '@/models/connect';
import { searchResources, updateResource } from '@/services/resource';
import { updateUser } from '@/services/user';
import { doShare } from '@/utils';
import {
  EditOutlined,
  EllipsisOutlined,
  GlobalOutlined,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  List,
  Menu,
  message,
  Row,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { createRef, ReactNode, useEffect, useState } from 'react';
import {
  connect,
  CurrentUser,
  ResourceType,
  history,
  UserModelType,
  CommentType,
} from 'umi';
import styles from './index.less';
import Comment from '@/components/Comments/index';

interface IProps {
  currentUser?: CurrentUser;
  [props: string]: any;
}

// 标签页tabs
const tabList = [
  {
    key: RESOURCE_TAB_TYPE.COMMENT,
    tab: '评论',
  },
  {
    key: RESOURCE_TAB_TYPE.RELATE,
    tab: '相关内容',
  },
];

const ResourceDetail: React.FC<IProps> = (props: IProps) => {
  const {
    location: { query },
    wholeTagsMap,
    currentUser = {},
  } = props;
  const { originTags } = wholeTagsMap;

  const [resource, setResource] = useState<ResourceType>({} as ResourceType);
  const [resourceUserInfo, setResourceUserInfo] = useState<CurrentUser>(
    {} as CurrentUser,
  );
  const [activeTabKey, setActiveTabKey] = useState(tabList[0].key);
  const [count, setCount] = useState(0);
  const [staring, setStaring] = useState(false);
  const [liking, setLiking] = useState(false);
  const [userResource, setUserResource] = useState<ResourceType[]>(
    [] as ResourceType[],
  );
  const [similarResource, setSimilarResource] = useState<ResourceType[]>(
    [] as ResourceType[],
  );
  const [commentValue, setCommentValue] = useState('');
  const editRef = createRef();

  // 获取这个资源的发布人
  const getResourceUserInfo = async () => {
    const { user_id } = resource;
    if (!user_id) {
      return;
    }
    try {
      const userInfo = await login({ type: LOGIN_TYPE.AUTO, userId: user_id });
      setResourceUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      console.log(error);
    }
  };

  // 查看资源
  const onViewResource = async (resource: ResourceType) => {
    updateResource(resource._id as string, {
      viewNum: (resource.viewNum || 0) + 1,
    });
  };

  useEffect(() => {
    getResourceUserInfo();
  }, [resource]);

  const initResource = async () => {
    try {
      // 从链接里面获取id
      const res = await searchResources({ _ids: [query.id] });
      onViewResource(res?.[0]);
      setResource(res?.[0] ?? []);
      const userInfo = await getResourceUserInfo();
      getUserResource(userInfo?.user_id);
      getSimilarResource(res?.[0]);
    } catch (error) {
      message.error('获取资源错误，请稍后重试');
      console.log(error, '...错误');
    }
  };

  const getUserResource = async (user_id: string) => {
    try {
      // 从链接里面获取id
      const res = await searchResources({
        user_id,
        pageNum: 1,
        pageSize: 1000000,
      });
      const len = 4 < res.length ? 4 : res.length;
      const indexs = [
        ...new Set(
          new Array(len)
            .fill(0)
            .map(() => Math.floor(Math.random() * res.length)),
        ),
      ];
      setUserResource((res ?? []).filter((_, index) => indexs.includes(index)));
    } catch (error) {
      message.error('获取资源错误，请稍后重试');
    }
  };

  const getSimilarResource = async (resource: ResourceType) => {
    try {
      // 从链接里面获取id
      const res = await searchResources({
        name: resource.name,
        pageNum: 1,
        pageSize: 1000000,
      });
      const len = 5 < res.length ? 5 : res.length;
      const indexs = [
        ...new Set(
          new Array(len)
            .fill(0)
            .map(() => Math.floor(Math.random() * res.length)),
        ),
      ];
      setSimilarResource(
        (res ?? []).filter((_: any, index: number) => indexs.includes(index)),
      );
    } catch (error) {
      message.error('获取资源错误，请稍后重试');
    }
  };

  useEffect(() => {
    initResource();
  }, []);

  const avatorTime = (
    <div>
      <span>
        {moment(resource.create_time as number).format('YYYY-MM-DD HH:mm:ss')}
      </span>
      <span style={{ margin: '0 10px' }}>
        <Divider type="vertical" />
      </span>
      <span>阅读: {resource.viewNum}</span>
    </div>
  );

  // 发送评论
  const sendComments = async () => {
    if (!commentValue || !resource._id) {
      message.warning('请先写点儿东西吧~');
      return;
    }
    const commentValueSubmit: CommentType = {
      value: commentValue,
      userId: currentUser._id as string,
      url: currentUser.head_img,
      createTime: Date.now(),
      likeNum: 0,
      nickName: currentUser.nickname,
    };
    const status = await updateResource(resource._id, {
      commentList: [...(resource?.commentList || []), commentValueSubmit],
    });
    if (status) {
      setResource({
        ...resource,
        commentList: [...(resource?.commentList || []), commentValueSubmit],
      });
      message.success('评论发表成功');
      setCommentValue(''); // 置空评论
    } else {
      message.error('评论发表失败');
    }
  };

  // 评论组件
  const commentComp = (
    <div>
      <h2>{resource?.commentList?.length || 0} 条评论</h2>
      <Divider />
      <div className={styles.comment}>
        <PreviewAvator src={currentUser.head_img} alt="头像" size="large" />
        <div style={{ marginLeft: '20px', width: '100%' }}>
          <MarkdownEditor
            ref={editRef}
            value={commentValue}
            onChange={(value) => {
              setCommentValue(value);
            }}
            placeholder="请输入友善的评论吧，全屏编辑体验更好哦！"
            style={{
              width: '100%',
              boxShadow: 'rgb(0 0 0 ) 0px 0px 0px',
              minHeight: '200px',
            }}
          />
          <Button
            onClick={sendComments}
            size="middle"
            type="primary"
            style={{ marginTop: '6px' }}
          >
            发布评论
          </Button>
        </div>
      </div>
      <Divider />
      <div>
        {(resource?.commentList || []).map((comment) => (
          <Card>
            <Card.Meta
              avatar={<PreviewAvator size="large" src={comment?.url} />}
              title={comment.nickName}
              description={moment(comment.createTime as number).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            />
            <div
              className={styles.commentValueStyle}
              style={{ marginLeft: '56px', marginTop: '16px', width: '100%' }}
            >
              <Comment value={comment.value} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // 相似资源
  const relateComp = (
    <div>
      <List<ResourceType>
        rowKey="_id"
        dataSource={similarResource}
        split={false}
        style={{ width: '100%' }}
        renderItem={(item) => {
          return (
            <List.Item key={item._id} style={{ width: '100%' }}>
              <ResourceCard showMenus={false} resource={item} />
            </List.Item>
          );
        }}
      />
    </div>
  );

  // map
  const keyMap = {
    [RESOURCE_TAB_TYPE.COMMENT]: commentComp,
    [RESOURCE_TAB_TYPE.RELATE]: relateComp,
  };

  const onTabChange = (value: string) => {
    setActiveTabKey(value);
  };

  const onClickEdit = () => {
    if (currentUser._id !== resource.user_id) {
      message.error('你不是改资源的拥有者，无权修改');
      return;
    }
    // 修改资源，携带资源的ID
    history.push({
      pathname: '/addResource',
      query: {
        id: resource._id,
      },
    });
  };

  const itemMenu = (
    <Menu>
      <Menu.Item>
        <div onClick={onClickEdit}>
          <EditOutlined />
          编辑
        </div>
      </Menu.Item>
    </Menu>
  );

  // 喜欢资源
  const onLikeResourceClick = async () => {
    if (liking) {
      return;
    }
    setLiking(true);
    if (!resource._id) {
      message.error('这个资源似乎有点儿问题嗷');
      return;
    }
    const myLike = currentUser?.likeResourceIds || [];
    const isMylike = myLike.includes(resource._id);
    let userState = null;
    let resourceState = null;
    if (isMylike) {
      [userState, resourceState] = await Promise.all([
        updateResource(resource._id, { likeNum: (resource.likeNum || 0) - 1 }),
        updateUser(currentUser._id as string, {
          likeResourceIds: myLike.filter((item) => item !== resource._id),
        }),
      ]);
    } else {
      // 更新喜欢数
      [userState, resourceState] = await Promise.all([
        updateResource(resource._id, { likeNum: (resource.likeNum || 0) + 1 }),
        updateUser(currentUser._id as string, {
          likeResourceIds: [...myLike, resource._id],
        }),
      ]);
    }

    if (userState && resourceState) {
      if (isMylike) {
        resource.likeNum = (resource.likeNum || 0) - 1;
      } else {
        resource.likeNum = (resource.likeNum || 0) + 1;
      }
      // 用来做视图的重新渲染
      setCount((count) => count + 1);
      message.success(`${isMylike ? '取消点赞成功' : '点赞成功'}`);
    } else {
      message.error('操作失败');
    }
    setLiking(false);
  };

  // 收藏资源，，感觉这里也可以弄成一个方法，和上面重复了
  const onStarResourceClick = async () => {
    if (staring) {
      return;
    }
    setStaring(true);
    if (!resource._id) {
      message.error('这个资源似乎有点儿问题嗷');
      return;
    }
    const myStars = currentUser?.starResourceIds || [];
    const isMyStar = myStars.includes(resource._id);
    let userState = null;
    let resourceState = null;
    if (isMyStar) {
      [userState, resourceState] = await Promise.all([
        updateResource(resource._id, { starNum: (resource.starNum || 0) - 1 }),
        updateUser(currentUser._id as string, {
          starResourceIds: myStars.filter((item) => item !== resource._id),
        }),
      ]);
    } else {
      // 更新喜欢数
      [userState, resourceState] = await Promise.all([
        updateResource(resource._id, { starNum: (resource.starNum || 0) + 1 }),
        updateUser(currentUser._id as string, {
          starResourceIds: [...myStars, resource._id],
        }),
      ]);
    }

    if (userState && resourceState) {
      if (isMyStar) {
        resource.starNum = (resource.starNum || 0) - 1;
      } else {
        resource.starNum = (resource.starNum || 0) + 1;
      }
      // 用来做视图的重新渲染
      setCount((count) => count + 1);
      message.success(`${isMyStar ? '取消收藏成功' : '收藏成功'}`);
    } else {
      message.error('操作失败');
    }

    setStaring(false);
  };

  const onShareClick = () => {
    doShare(resource);
  };

  const onOpenClick = () => {
    if (resource._id) {
      window.open(resource.url || resource.link, '_blank');
    }
  };

  return (
    <div style={{ padding: '0 180px' }}>
      <GridContent>
        <Row gutter={24}>
          <Col span={18} xl={17} lg={17} xs={17}>
            <Card
              actions={[
                <div onClick={onLikeResourceClick}>
                  <Tooltip
                    key="like"
                    title={
                      currentUser?.likeResourceIds?.includes(resource?._id)
                        ? '取消点赞'
                        : '点赞'
                    }
                  >
                    <LikeOutlined
                      style={{
                        ...(currentUser?.likeResourceIds?.includes(
                          resource?._id,
                        )
                          ? { color: '#438df5' }
                          : null),
                      }}
                    />
                    {!!resource.likeNum && resource.likeNum}
                  </Tooltip>
                </div>,
                <div onClick={onStarResourceClick}>
                  <Tooltip
                    key="star"
                    title={
                      currentUser?.starResourceIds?.includes(resource?._id)
                        ? '取消收藏'
                        : '收藏'
                    }
                  >
                    <StarOutlined
                      style={{
                        ...(currentUser?.starResourceIds?.includes(
                          resource?._id,
                        )
                          ? { color: '#438df5' }
                          : null),
                      }}
                    />
                    {!!resource.starNum && resource.starNum}
                  </Tooltip>
                </div>,
                <div onClick={onShareClick}>
                  <Tooltip title="分享" key="share">
                    <ShareAltOutlined />
                  </Tooltip>
                </div>,
                <div onClick={onOpenClick}>
                  <Tooltip title="前往" key="share">
                    <GlobalOutlined />
                  </Tooltip>
                </div>,
                <Dropdown key="ellipsis" overlay={itemMenu}>
                  <EllipsisOutlined />
                </Dropdown>,
              ].filter(Boolean)}
            >
              <Card.Meta
                avatar={<PreviewAvator size="large" src={resource?.head_img} />}
                title={resource?.name}
                description={avatorTime}
              />
              <Divider />
              <h2>{resource.desc}</h2>
              <a href={resource.url}>网站链接: {resource.url}</a>
              <p style={{ marginTop: '10px' }}>{resource.detail}</p>
            </Card>
            <Card
              style={{ width: '100%', marginTop: '30px' }}
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={onTabChange}
            >
              {keyMap[activeTabKey]}
            </Card>
          </Col>

          {/* 右侧组件 */}
          <Col span={6} xl={7} lg={7} xs={7}>
            <Card title="帖子信息" hoverable>
              <div className={styles.resourceInfo}>
                <span>发布者头像：</span>
                {/* 这里后续可以加上大类 */}
                <div className={styles.desc}>
                  <PreviewAvator
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
            <Card title="作者其他分享" hoverable style={{ marginTop: '30px' }}>
              <List<ResourceType>
                rowKey="user_resource_id"
                dataSource={userResource}
                split={false}
                style={{ width: '100%' }}
                renderItem={(item) => {
                  return (
                    <List.Item key={item._id} style={{ width: '100%' }}>
                      <ResourceCard showMenus={false} resource={item} />
                    </List.Item>
                  );
                }}
              />
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
