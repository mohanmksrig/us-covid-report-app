import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { yearlyColumns, yearMenu, yearlyData } from '../utils';

const { TabPane } = Tabs;

interface YearlyCasesCardProps {
filteredYearlyCasesData: CovidData[];
chartRef: React.RefObject<HTMLDivElement>;
handleYearlyCasesFilterChange: (year: number | null) => void;
exportToExcel: (data: CovidData[], fileName: string) => void;
}

export default function YearlyCasesCard({ filteredYearlyCasesData, chartRef, handleYearlyCasesFilterChange, exportToExcel }: YearlyCasesCardProps) {
  return (
    /* New Cases - Yearly Data Card start */
    <Card
      title="New Cases - Yearly Data"
      extra={(
        <>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData)) as CovidData[], 'yearly_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
            <Dropdown menu={{ items: yearMenu(handleYearlyCasesFilterChange, filteredYearlyCasesData) }} trigger={['click']}>
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
          <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData))} rowKey="year" />
        </TabPane>
      </Tabs>
    </Card>
    /* New Cases - Yearly Data Card end */
  );
}

/* YearlyCasesCard Script End */