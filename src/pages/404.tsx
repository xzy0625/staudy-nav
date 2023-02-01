import { Link } from 'umi';
import { Result, Button } from 'antd';

export default () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle="哎呀，页面好像走丢了"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);
