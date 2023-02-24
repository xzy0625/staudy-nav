import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

interface IProps {
  value: string;
}

// 评论组件
export const Comment: React.FC<IProps> = (props: IProps) => {
  const { value } = props;

  // 展示markdown
  return (
    <div>
      <ReactMarkdown remarkPlugins={[gfm]}>{value}</ReactMarkdown>
    </div>
  );
};
export default Comment;
