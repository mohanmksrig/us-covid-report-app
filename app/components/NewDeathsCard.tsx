import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { columns, stateMenu } from '../utils';

const { TabPane } = Tabs;

interface NewDeathsCardProps {
  filteredDeathsData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleDeathsFilterChange: (state: string) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

export default function NewDeathsCard({ filteredDeathsData, chartRef, handleDeathsFilterChange, exportToExcel }: NewDeathsCardProps) {
  return (
    <Card
      title="New Deaths Over Time - Monthly Data"
      extra={(
        <>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(filteredDeathsData, 'new_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: stateMenu(handleDeathsFilterChange) }} trigger={['click']}>
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
          <Table columns={columns} dataSource={filteredDeathsData} rowKey="date" />
        </TabPane>
      </Tabs>
    </Card>
  );
}