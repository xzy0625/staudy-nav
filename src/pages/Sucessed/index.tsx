import ResultComp from '@/components/ResultComp';
import { RESOURCE_TYPE } from '@/const/index';

const Sucessed: React.FC<IAnyObject> = (props: IAnyObject) => {
  const { location } = props;
  const { id, type } = location?.query;

  let title = '您的资源已成功推荐，感谢为开源学习社区做出贡献';
  if (type === RESOURCE_TYPE.MODIFY) {
    title = '您的资源已成功修改，感谢为开源学习社区做出贡献';
  }

  return (
    <ResultComp
      id={id}
      title={title}
      showAnather={type === RESOURCE_TYPE.ADD}
    />
  );
};

export default Sucessed;
