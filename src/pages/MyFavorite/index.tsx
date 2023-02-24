import { NoAuth } from '@/components/NoAuth';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { ToolList } from '../ToolList';

// 我收藏的资源，将stars传过去就好了
export const MyFavoriteResource = (props: IAnyObject) => {
  const { currentUser } = props;

  return currentUser._id ? (
    <ToolList extraCondition={{ _ids: currentUser?.starResourceIds || [] }} />
  ) : (
    <NoAuth />
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MyFavoriteResource);
