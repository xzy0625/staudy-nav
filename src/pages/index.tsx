import styles from './index.less';
import UserLogin from './UserLogin';
export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <UserLogin />
    </div>
  );
}
