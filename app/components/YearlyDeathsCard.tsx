// Import required dependencies
import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { yearlyColumns, yearMenu, yearlyData } from '../utils';
import styles from '../Pagedesign.module.css';

// Destructure Tabs.TabPane for easier usage
const { TabPane } = Tabs;

//Interface for YearlyCasesCard props
interface YearlyDeathsCardProps {
  filteredYearlyDeathsData: CovidData[];
  allData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleYearlyDeathsFilterChange: (year: number | null) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

/**
 * YearlyDeathsCard Component
 * Displays yearly COVID death data in both chart and table format
 */
export default function YearlyDeathsCard({ filteredYearlyDeathsData, allData, chartRef, handleYearlyDeathsFilterChange, exportToExcel }: YearlyDeathsCardProps) {
  return (
    <Card
      className={styles.card}
      title="New Deaths - Yearly Data"
      extra={(
        <div className={styles.cardExtra}>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData)) as CovidData[], 'yearly_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: yearMenu(handleYearlyDeathsFilterChange, allData) }} trigger={['click']}>
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
          <div ref={chartRef} className={styles.chartContainer}></div>
        </TabPane>
        <TabPane tab="Data Table" key="2">
          <div className={styles.tableContainer}>
            <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData))} rowKey="year" />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
}

/* YearlyDeathCard Script End */