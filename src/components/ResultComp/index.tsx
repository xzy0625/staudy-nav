import { Button, Result } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';

interface IProps {
  title?: string;
  time?: number;
  showAnather?: boolean;
  location?: IAnyObject;
  type?: any;
  id?: any;
}
const defaultTitle = '您的资源已成功推荐，感谢为开源学习社区做出贡献';

const ResultComp: React.FC<IProps> = (props: IProps) => {
  const {
    title,
    showAnather = true,
    time = 3,
    location,
    type = 'success',
    id,
  } = props;

  useEffect(() => {
    if (!id) {
      history.goBack();
      return;
    }
  });

  const refCount = useRef(time);
  const [count, setCount] = useState(time);
  let timer: any = null;

  const startTimer = () => {
    if (timer) {
      return;
    }
    timer = setInterval(() => {
      refCount.current = refCount.current - 1;
      setCount(refCount.current);
      if (refCount.current === 0) {
        clearInterval(timer);
        // 跳转资源详情页
        history.replace({
          pathname: '/resourseDetail',
          query: {
            id: id,
          },
        });
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    // 组件卸载清楚计时器
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 返回首页
  const toMain = () => {
    history.replace('/');
  };

  // 再次推荐
  const toRecommend = () => {
    history.replace('/addResource');
  };

  return (
    <Result
      status={type as any}
      title={title || defaultTitle}
      subTitle={`页面将在 ${count} 秒之后跳转资源详情页`}
      extra={[
        <Button onClick={toMain} type="primary" key="main">
          回到首页
        </Button>,
        showAnather && (
          <Button onClick={toRecommend} key="add">
            再次推荐
          </Button>
        ),
      ]}
    />
  );
};

export default ResultComp;
