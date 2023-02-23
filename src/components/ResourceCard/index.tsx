import {
  EditOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Tooltip, Avatar, Dropdown, Menu, message, Tag } from 'antd';
import { ResourceType, CurrentUser, history } from 'umi';
import numeral from 'numeral';
import styles from '../../pages/ToolList/style.less';
import { useEffect, useState } from 'react';
import getTags from '@/api/tags';
import { likeResource, updateResource } from '@/services/resource';
import { updateUser } from '@/services/user';
import { getDvaApp } from 'umi';
import { doShare } from '@/utils';

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

interface IProps {
  showMenus?: Boolean;
  resource: ResourceType;
}

const ResourceCard: React.FC<IProps> = ({
  showMenus = true,
  resource,
}: IProps) => {
  // 卸载这里比较麻烦，应该抛一个函数出去吧
  const currentUser = getDvaApp()?._store?.getState()?.user
    .currentUser as CurrentUser;
  // 渲染用
  const [count, setCount] = useState(0);
  const [staring, setStaring] = useState(false);
  const [liking, setLiking] = useState(false);
  const { _id } = currentUser;
  const [tags, setTags] = useState<any>({});

  const onClickEdit = () => {
    if (_id !== resource._id) {
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

  // 初始化所有的标签
  const initTages = async () => {
    try {
      const tags = await getTags();
      setTags(tags);
    } catch (error) {
      setTags({});
    }
  };

  useEffect(() => {
    initTages();
  }, []);

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

  const CardInfo: React.FC<{
    activeUser: React.ReactNode;
    newUser: React.ReactNode;
  }> = ({ activeUser, newUser }) => (
    <>
      <div className={styles.cardInfo}>
        <div>
          <p>点赞量</p>
          <p>{activeUser}</p>
        </div>
        <div>
          <p>收藏量</p>
          <p>{newUser}</p>
        </div>
      </div>
      <div style={{ marginTop: '5px', marginLeft: '40px' }}>
        {resource?.tags?.map((item) => (
          <Tag color="success">{tags?.getLabel?.(item)}</Tag>
        ))}
      </div>
    </>
  );

  const onClick = () => {
    history.push({
      pathname: '/resourseDetail',
      query: {
        id: resource._id,
      },
    });
  };

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

  return (
    <div>
      <Card
        hoverable
        bodyStyle={{ paddingBottom: 20 }}
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
                  ...(currentUser?.likeResourceIds?.includes(resource?._id)
                    ? { color: '#438df5' }
                    : null),
                }}
              />
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
                  ...(currentUser?.starResourceIds?.includes(resource?._id)
                    ? { color: '#438df5' }
                    : null),
                }}
              />
            </Tooltip>
          </div>,
          <div onClick={onShareClick}>
            <Tooltip title="分享" key="share">
              <ShareAltOutlined />
            </Tooltip>
          </div>,
          showMenus && (
            <Dropdown key="ellipsis" overlay={itemMenu}>
              <EllipsisOutlined />
            </Dropdown>
          ),
        ].filter(Boolean)}
      >
        <div onClick={onClick}>
          <Card.Meta
            avatar={<Avatar size="small" src={resource.head_img} />}
            title={resource.name}
            description={resource.desc}
          />
        </div>
        <div className={styles.cardItemContent} onClick={onClick}>
          <CardInfo
            activeUser={numeral(resource.likeNum).format('0,0')}
            newUser={numeral(resource.starNum).format('0,0')}
          />
        </div>
      </Card>
    </div>
  );
};

export default ResourceCard;
