import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { columns, stateMenu } from '../utils';
import styles from '../Pagedesign.module.css';

const { TabPane } = Tabs;

interface NewCasesCardProps {
  filteredCasesData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleCasesFilterChange: (state: string) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

export default function NewCasesCard({ filteredCasesData, chartRef, handleCasesFilterChange, exportToExcel }: NewCasesCardProps) {
  return (
    /* New Cases Over Time Card start */
    <Card
      className={styles.card}
      title="New Cases Over Time - Monthly Data"
      extra={(
        <div className={styles.cardExtra}>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(filteredCasesData, 'new_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: stateMenu(handleCasesFilterChange) }} trigger={['click']}>
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
            <Table columns={columns} dataSource={filteredCasesData} rowKey="date" />
          </div>
        </TabPane>
      </Tabs>
    </Card>
    /* New Cases Over Time Card end */
  );
}

/* NewCaseCard Script End */
