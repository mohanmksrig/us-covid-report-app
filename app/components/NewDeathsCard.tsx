// Import required dependencies
import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { columns, stateMenu } from '../utils';
import styles from '../Pagedesign.module.css';

// Destructure Tabs.TabPane for easier usage
const { TabPane } = Tabs;

//Interface for NewDeathCard props
interface NewDeathsCardProps {
  filteredDeathsData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleDeathsFilterChange: (state: string) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

/**
 * NewDeathCard Component
 * Displays new COVID death data in both chart and table format
 */
export default function NewDeathsCard({ filteredDeathsData, chartRef, handleDeathsFilterChange, exportToExcel }: NewDeathsCardProps) {
  return (
    /* New Deaths Over Time Card start */
    <Card
      className={styles.card}
      title="New Deaths Over Time - Monthly Data"
      extra={(
        <div className={styles.cardExtra}>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(filteredDeathsData, 'new_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: stateMenu(handleDeathsFilterChange) }} trigger={['click']}>
            <Tooltip title="Filter Data">
              <FilterOutlined className={styles.cardExtraIcon} />
            </Tooltip>
          </Dropdown>
        </div>
      )}
      
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Graph" key="1">
          <div ref={chartRef} className={styles.chartContainer}></div>
        </TabPane>
        <TabPane tab="Data Table" key="2">
          <div className={styles.tableContainer}>
            <Table columns={columns} dataSource={filteredDeathsData} rowKey="date" />
          </div>
        </TabPane>
      </Tabs>
    </Card>
    /* New Deaths Over Time Card end */
  );
}

/* NewDeathCard Script End */