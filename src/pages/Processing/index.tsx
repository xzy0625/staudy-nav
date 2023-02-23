import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const Processing: React.FC = () => {
  const onClick = () => {
    history.push('/');
  };
  return (
    <Result
      title="别催了，别催了，正在快马加鞭的做了....."
      extra={
        <Button type="primary" key="console" onClick={onClick}>
          返回首页
        </Button>
      }
    />
  );
};

export default Processing;
