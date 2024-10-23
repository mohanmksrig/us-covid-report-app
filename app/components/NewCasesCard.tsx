import { Card, Tabs, Table, Tooltip, Dropdown } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { CovidData } from '../types';
import { columns, stateMenu } from '../utils';

const { TabPane } = Tabs;

interface NewCasesCardProps {
  filteredCasesData: CovidData[];
  chartRef: React.RefObject<HTMLDivElement>;
  handleCasesFilterChange: (state: string) => void;
  exportToExcel: (data: CovidData[], fileName: string) => void;
}

export default function NewCasesCard({ filteredCasesData, chartRef, handleCasesFilterChange, exportToExcel }: NewCasesCardProps) {
  return (
    <Card
      title="New Cases Over Time - Monthly Data"
      extra={(
        <>
          <Tooltip title="Export to Excel">
            <DownloadOutlined onClick={() => exportToExcel(filteredCasesData, 'new_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
          </Tooltip>
          <Dropdown menu={{ items: stateMenu(handleCasesFilterChange) }} trigger={['click']}>
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
          <Table columns={columns} dataSource={filteredCasesData} rowKey="date" />
        </TabPane>
      </Tabs>
    </Card>
  );
}