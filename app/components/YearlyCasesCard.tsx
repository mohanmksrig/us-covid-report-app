// Import required dependencies
import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { yearlyColumns, yearMenu, yearlyData } from '../utils';
import styles from '../Pagedesign.module.css';

// Destructure Tabs.TabPane for easier usage
const { TabPane } = Tabs;

//Interface for YearlyCasesCard props
interface YearlyCasesCardProps {
  filteredYearlyCasesData: CovidData[];
  allData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleYearlyCasesFilterChange: (year: number | null) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

/**
 * YearlyCasesCard Component
 * Displays yearly COVID cases data in both chart and table format
 */
export default function YearlyCasesCard({ filteredYearlyCasesData, allData, chartRef, handleYearlyCasesFilterChange, exportToExcel }: YearlyCasesCardProps) {
  return (
    /* New Cases - Yearly Data Card start */
    <Card
      className={styles.card}
      title="New Cases - Yearly Data"
      extra={(
        <div className={styles.cardExtra}>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData)) as CovidData[], 'yearly_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: yearMenu(handleYearlyCasesFilterChange, allData) }} trigger={['click']}>
            <Tooltip title="Filter Data">
            <FilterOutlined className={styles.cardExtraIcon} />
            </Tooltip>
          </Dropdown>
        </div>
      )}
      /*style={{ width: '48%' }}*/
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Graph" key="1">
         <div ref={chartRef} className={styles.pieChartContainer}></div>
        </TabPane>
        <TabPane tab="Data Table" key="2">
          <div className={styles.tableContainer}>
            <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData))} rowKey="year" />
          </div>
        </TabPane>
      </Tabs>
    </Card>
    /* New Cases - Yearly Data Card end */
  );
}

/* YearlyCasesCard Script End */