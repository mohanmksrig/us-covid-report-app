// Import required dependencies
import { Layout, Typography } from 'antd';
import styles from '../Pagedesign.module.css';

const { Header } = Layout;
const { Title } = Typography;

export default function AppHeader() {
  return (
    /* Header section start */
    <Header className={styles.header}>
      <div className={styles.titleContainer}>
        <Title level={2} className={styles.title}>US Covid Data Report using Graphical Charts</Title>
      </div>
    </Header>
    /* Header section end */
  );
}

/* Header Script End */