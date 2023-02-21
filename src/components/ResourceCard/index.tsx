import { formatWan } from '@/pages/ToolList';
import {
  EditOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  ShareAltOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Tooltip, Avatar, Dropdown, Menu, message, Tag } from 'antd';
import { ResourceType, CurrentUser } from 'umi';
import { history } from '@@/core/history';
import numeral from 'numeral';
import styles from '../../pages/ToolList/style.less';
import { useEffect, useState } from 'react';
import getTags from '@/api/tags';

interface IProps {
  showMenus?: Boolean;
  resource: ResourceType;
  currentUser?: CurrentUser;
}

const ResourceCard: React.FC<IProps> = ({
  showMenus = true,
  resource,
  currentUser = {},
}: IProps) => {
  const { _id, likeResourceIds, starResourceIds } = currentUser;
  const [tags, setTags] = useState<any>({});

  const onClickEdit = () => {
    if (_id !== resource._id) {
      message.error('你不是改资源的拥有者，无权修改');
      return;
    }
    // 修改资源，携带资源的ID
    history.push({
      pathname: '/',
      query: {
        resourceId: resource._id,
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

  return (
    <Card
      hoverable
      bodyStyle={{ paddingBottom: 20 }}
      actions={[
        <Tooltip key="download" title="点赞">
          <LikeOutlined />
        </Tooltip>,
        <Tooltip key="edit" title="收藏">
          <StarOutlined />
        </Tooltip>,
        <Tooltip title="分享" key="share">
          <ShareAltOutlined />
        </Tooltip>,
        showMenus && (
          <Dropdown key="ellipsis" overlay={itemMenu}>
            <EllipsisOutlined />
          </Dropdown>
        ),
      ].filter(Boolean)}
    >
      <Card.Meta
        avatar={<Avatar size="small" src={resource.head_img} />}
        title={resource.name}
        description={resource.desc}
      />
      <div className={styles.cardItemContent}>
        <CardInfo
          activeUser={formatWan(1000)}
          newUser={numeral(2000).format('0,0')}
        />
      </div>
    </Card>
  );
};

export default ResourceCard;
