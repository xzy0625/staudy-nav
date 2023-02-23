import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { ToolList } from '../ToolList';

// 我收藏的资源，将stars传过去就好了
export const SearchResource = (props: IAnyObject) => {
  const { currentUser, location } = props;
  const query = location.query.q;
  console.log(query, '......');

  return (
    <div>
      <ToolList extraCondition={{ name: query || '' }} />
    </div>
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  currentUser: user.currentUser,
}))(SearchResource);
