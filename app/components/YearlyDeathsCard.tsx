import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { yearlyColumns, yearMenu, yearlyData } from '../utils';

const { TabPane } = Tabs;

interface YearlyDeathsCardProps {
  filteredYearlyDeathsData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleYearlyDeathsFilterChange: (year: number | null) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

export default function YearlyDeathsCard({ filteredYearlyDeathsData, chartRef, handleYearlyDeathsFilterChange, exportToExcel }: YearlyDeathsCardProps) {
  return (
    /* New Deaths - Yearly Data Card start */
    <Card
      title="New Deaths - Yearly Data"
      extra={(
        <>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData)) as CovidData[], 'yearly_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: yearMenu(handleYearlyDeathsFilterChange, filteredYearlyDeathsData) }} trigger={['click']}>
            <Tooltip title="Filter Data">
              <FilterOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
          </Dropdown>
        </>
      )}
      style={{ width: '48%' }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Graph" key="1">
          <div ref={chartRef}></div>
        </TabPane>
        <TabPane tab="Data Table" key="2">
          <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData))} rowKey="year" />
        </TabPane>
      </Tabs>
    </Card>
    /* New Deaths - Yearly Data Card end */
  );
}

/* YearlyDeathCard Script End */