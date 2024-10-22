/**
 * Author: Mohankumar Selvaraj
 * Email: mohanmksri@gmail.com
 * Date: 22-Oct-2024
 * Description: This Application is a Next-JS web application that visualizes COVID-19 data for the United States. 
 */

'use client';

import { Layout, Card, Table, Tabs, message, Tooltip, Dropdown, Menu, Typography } from 'antd';
import styles from './Pagedesign.module.css';
import { FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Chart } from '@antv/g2';
import { Pie } from '@antv/g2plot';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

// Create a static mapping of state IDs to state names
const stateMapping: Record<number, string> = {
  1: 'Alabama',
  2: 'Alaska',
  3: 'Arizona',
  4: 'Arkansas',
  5: 'California',
  6: 'Colorado',
  7: 'Connecticut',
  8: 'Delaware',
  9: 'Florida',
  10: 'Georgia',
  11: 'Hawaii',
  12: 'Idaho',
  13: 'Illinois',
  14: 'Indiana',
  15: 'Iowa',
  16: 'Kansas',
  17: 'Kentucky',
  18: 'Louisiana',
  19: 'Maine',
  20: 'Maryland',
  21: 'Massachusetts',
  22: 'Michigan',
  23: 'Minnesota',
  24: 'Mississippi',
  25: 'Missouri',
  26: 'Montana',
  27: 'Nebraska',
  28: 'Nevada',
  29: 'New Hampshire',
  30: 'New Jersey',
  31: 'New Mexico',
  32: 'New York',
  33: 'North Carolina',
  34: 'North Dakota',
  35: 'Ohio',
  36: 'Oklahoma',
  37: 'Oregon',
  38: 'Pennsylvania',
  39: 'Rhode Island',
  40: 'South Carolina',
  41: 'South Dakota',
  42: 'Tennessee',
  43: 'Texas',
  44: 'Utah',
  45: 'Vermont',
  46: 'Virginia',
  47: 'Washington',
  48: 'West Virginia',
  49: 'Wisconsin',
  50: 'Wyoming',
};

// Define the type for the data fetched from the API
interface CovidData {
  date: string;
  states: number;
  positive: number;
  negative: number;
  pending: number;
  hospitalizedCurrently: number;
  hospitalizedCumulative: number;
  inIcuCurrently: number;
  inIcuCumulative: number;
  onVentilatorCurrently: number;
  onVentilatorCumulative: number;
  dateChecked: string;
  death: number;
  hospitalized: number;
  totalTestResults: number;
  lastModified: string;
  recovered: number | null;
  total: number;
  posNeg: number;
  deathIncrease: number;
  hospitalizedIncrease: number;
  negativeIncrease: number;
  positiveIncrease: number;
  totalTestResultsIncrease: number;
  hash: string;
  stateName?: string;
}

// Function to fetch COVID-19 data from the API
const fetchData = async (): Promise<{ aggregated: CovidData[], raw: CovidData[] }> => {
  try {
    const res = await axios.get<CovidData[]>('https://api.covidtracking.com/v1/us/daily.json');
    const dataWithNames = res.data.map(item => ({
      ...item,
      stateName: stateMapping[item.states] || 'Unknown',
      year: Math.floor(parseInt(item.date.toString()) / 10000),
    }));
    return {
      aggregated: aggregateDataByMonth(dataWithNames),
      raw: dataWithNames
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { aggregated: [], raw: [] };
  }
};

// Interface defining the structure of COVID-19 data with required fields
interface CovidData {
  date: string;
  states: number;
  hash: string;
  stateName?: string;
  year?: number;
}

// Function to aggregate data by month
const aggregateDataByMonth = (data: CovidData[]): CovidData[] => {
  const monthlyData: { [key: string]: CovidData } = {};

  data.forEach(item => {
    const date = new Date(parseInt(item.date.toString().slice(0, 4)), 
                          parseInt(item.date.toString().slice(4, 6)) - 1, 
                          parseInt(item.date.toString().slice(6, 8)));
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { ...item, date: monthKey, positiveIncrease: 0, deathIncrease: 0 };
    }

    monthlyData[monthKey].positiveIncrease += item.positiveIncrease;
    monthlyData[monthKey].deathIncrease += item.deathIncrease;
  });

  return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
};

export default function Home() {
  // Refs for chart instances and DOM elements
  const pieChartInstance = useRef<Pie | null>(null);

  // State variables for data and filters
  const [data, setData] = useState<CovidData[]>([]);
  const [filteredCasesData, setFilteredCasesData] = useState<CovidData[]>([]);
  const [filteredDeathsData, setFilteredDeathsData] = useState<CovidData[]>([]);
  const [filteredYearlyCasesData, setFilteredYearlyCasesData] = useState<CovidData[]>([]);
  const [filteredYearlyDeathsData, setFilteredYearlyDeathsData] = useState<CovidData[]>([]);
  const [selectedCasesState, setSelectedCasesState] = useState<string>('All States');
  const [selectedDeathsState, setSelectedDeathsState] = useState<string>('All States');
  const [selectedYearlyCasesYear, setSelectedYearlyCasesYear] = useState<number | null>(null);
  const [selectedYearlyDeathsYear, setSelectedYearlyDeathsYear] = useState<number | null>(null);
  const chartRef1 = useRef<HTMLDivElement | null>(null);
  const chartRef2 = useRef<HTMLDivElement | null>(null);
  const chartRef3 = useRef<HTMLDivElement | null>(null);
  const chartRef4 = useRef<HTMLDivElement | null>(null);
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  const chartInstance3 = useRef<Chart | null>(null);
  const chartInstance4 = useRef<Chart | null>(null);

  const pieChartRef = useRef<HTMLDivElement | null>(null); // Ref for pie chart

  // Effect hook to fetch and render initial data
  useEffect(() => {
    fetchData().then(({ aggregated, raw }) => {
      if (aggregated.length > 0 && raw.length > 0) {
        setData(raw);
        setFilteredCasesData(aggregated);
        setFilteredDeathsData(aggregated);
        setFilteredYearlyCasesData(aggregated);
        setFilteredYearlyDeathsData(aggregated);
        setSelectedCasesState(selectedCasesState);
        setSelectedDeathsState(selectedDeathsState);
        setSelectedYearlyCasesYear(selectedYearlyCasesYear);
        setSelectedYearlyDeathsYear(selectedYearlyDeathsYear);
        renderChart(chartRef1.current, aggregated, 'positiveIncrease', chartInstance1, '#4CAF50'); // Green color for New Cases
        renderChart(chartRef2.current, aggregated, 'deathIncrease', chartInstance2, '#FF5252'); // Red color for New Deaths
        renderYearlyPieChart(chartRef3.current, aggregated, 'positiveIncrease', chartInstance3);
        renderYearlyPieChart(chartRef4.current, aggregated, 'deathIncrease', chartInstance4);

        renderPieChart(pieChartRef.current, aggregated); // Call to render pie chart
      }
    });
  }, []);

  // Function to render the pie chart
  const renderPieChart = (container: HTMLElement | null, chartData: CovidData[]) => {
    if (!container || chartData.length === 0) return;

    const pieChartData = chartData.slice(0, 10).map(item => ({
      type: item.date,
      value: item.positive,
    }));

    if (pieChartInstance.current) {
      pieChartInstance.current.update({ data: pieChartData });
    } else {
      pieChartInstance.current = new Pie(container, {
        data: pieChartData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
          type: 'outer',
          content: '{name} {percentage}',
        },
      });

      pieChartInstance.current.render();
    }
  };

  // Function to aggregate yearly data
  const yearlyData = (metric: 'positiveIncrease' | 'deathIncrease', data: CovidData[]) => {
    return data.reduce((acc, item) => {
      const year = item.year!;
      if (!acc[year]) {
        acc[year] = { year, total: 0 };
      }
      acc[year].total += item[metric];
      return acc;
    }, {} as Record<number, { year: number; total: number }>);
  };

  // Function to render line charts
  const renderChart = (container: HTMLElement | null, chartData: CovidData[], metric: keyof CovidData, chartInstance: React.MutableRefObject<Chart | null>,color: string) => {
    if (!container || chartData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chart = new Chart({
      container,
      autoFit: true,
      height: 300,
    });

    chart.data(chartData);

    chart.interval()
      .encode('x', 'date')
      .encode('y', metric)
      .style('fill', color);

      chart.axis('x', {
        label: {
          formatter: (text: string) => text.split('-')[1],
          autoRotate: true,
        },
      });

    chart.render();
    chartInstance.current = chart;
  };

  // Function to render yearly pie charts
  const renderYearlyPieChart = (container: HTMLElement | null, chartData: CovidData[], metric: 'positiveIncrease' | 'deathIncrease', chartInstance: React.MutableRefObject<Chart | null>) => {
    if (!container || chartData.length === 0) return;
  
    const pieChartData = Object.values(yearlyData(metric, chartData));
  
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
  
    const chart = new Chart({
      container,
      autoFit: true,
      height: 300,
    });
    
    chart.data(pieChartData);
  
    // Modify to create a doughnut chart by setting innerRadius
    chart.coordinate('theta', {
      radius: 0.75,
      innerRadius: 0.5,  // Add this to create the doughnut effect
    });
  
    chart.interval()
      .encode('x', '1')
      .encode('y', 'total')
      .encode('color', 'year')
      .style({ opacity: 0.8 })
      .label({
        text: (d: { year: number; total: number }) => `${d.year}: ${d.total}`,
        style: {
          textAlign: 'center',
          fontSize: 12,
          fill: '#000',
        },
      });
  
    chart.axis(false);
  
    chart.legend('color', {
      position: 'right',
    });
  
    chart.interaction('element-active');
  
    chart.render();
    chartInstance.current = chart;
  };  

  // Column definitions for yearly data table
  const yearlyColumns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  // Function to export data to Excel
  const exportToExcel = (data: CovidData[] | { year: number; total: number }[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'COVID Data');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    message.success('Exported to Excel successfully!');
  };

  // Handler for cases filter change
  const handleCasesFilterChange = (state: string) => {
    setSelectedCasesState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredCasesData(filteredData);
    renderChart(chartRef1.current, filteredData, 'positiveIncrease', chartInstance1, '#4CAF50'); // Green color
  };

  // Handler for deaths filter change
  const handleDeathsFilterChange = (state: string) => {
    setSelectedDeathsState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredDeathsData(filteredData);
    renderChart(chartRef2.current, filteredData, 'deathIncrease', chartInstance2, '#FF5252'); // Red color
  };

  // Handler for yearly cases filter change
  const handleYearlyCasesFilterChange = (year: number | null) => {
    setSelectedYearlyCasesYear(year);
    const filteredData = year ? data.filter(item => item.year === year) : data;
    setFilteredYearlyCasesData(filteredData);
    renderYearlyPieChart(chartRef3.current, filteredData, 'positiveIncrease', chartInstance3);
  };

  // Handler for yearly deaths filter change
  const handleYearlyDeathsFilterChange = (year: number | null) => {
    setSelectedYearlyDeathsYear(year);
    const filteredData = year ? data.filter(item => item.year === year) : data;
    setFilteredYearlyDeathsData(filteredData);
    renderYearlyPieChart(chartRef4.current, filteredData, 'deathIncrease', chartInstance4);
  };

  // Function to generate state filter menu
  const stateMenu = (handleFilterChange: (state: string) => void) => (
    <Menu>
      <Menu.Item onClick={() => handleFilterChange('All States')}>All States</Menu.Item>
      {Object.entries(stateMapping).map(([id, state]) => (
        <Menu.Item key={id} onClick={() => handleFilterChange(state)}>
          {state}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Function to generate year filter menu
  const yearMenu = (handleFilterChange: (year: number | null) => void) => (
    <Menu>
      <Menu.Item onClick={() => handleFilterChange(null)}>All Years</Menu.Item>
      {Array.from(new Set(data.map(item => item.year).filter((year): year is number => year !== undefined))).sort().map(year => (
        <Menu.Item key={year} onClick={() => handleFilterChange(year)}>
          {year}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Column definitions for monthly data table
  const columns = [
    {
      title: 'Month',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'New Cases',
      dataIndex: 'positiveIncrease',
      key: 'positiveIncrease',
    },
    {
      title: 'New Deaths',
      dataIndex: 'deathIncrease',
      key: 'deathIncrease',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header section start */}
      <Header className={styles.header}>
        <div className={styles.titleContainer}>
          <Title level={2} className={styles.title}>US Covid Data Report using Graphical Charts</Title>
        </div>
      </Header>
      {/* Header section end */}

      {/* Main content section start */}
      <Content style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* New Cases Over Time Card start */}
          <Card
            title="New Cases Over Time - Monthly Data"
            extra={(
              <>
                <Tooltip title="Export to Excel">
                  <DownloadOutlined onClick={() => exportToExcel(filteredCasesData, 'new_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
                </Tooltip>
                <Dropdown overlay={stateMenu(handleCasesFilterChange)} trigger={['click']}>
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
                <div ref={chartRef1}></div>
              </TabPane>
              <TabPane tab="Data Table" key="2">
                <Table columns={columns} dataSource={filteredCasesData} rowKey="date" />
              </TabPane>
            </Tabs>
          </Card>
          {/* New Cases Over Time Card end */}  

          {/* New Deaths Over Time Card start */}
          <Card
            title="New Deaths Over Time - Monthly Data"
            extra={(
              <>
                <Tooltip title="Export to Excel">
                  <DownloadOutlined onClick={() => exportToExcel(filteredDeathsData, 'new_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
                </Tooltip>
                <Dropdown overlay={stateMenu(handleDeathsFilterChange)} trigger={['click']}>
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
                <div ref={chartRef2}></div>
              </TabPane>
              <TabPane tab="Data Table" key="2">
                <Table columns={columns} dataSource={filteredDeathsData} rowKey="date" />
              </TabPane>
            </Tabs>
          </Card>
          {/* New Deaths Over Time Card end */}
        </div>

        {/* Positive Cases Over Time - Pie Chart - start */}
        <Card
          title="Positive Cases Over Time - Monthly Data"
          style={{ marginBottom: '20px' }}
        >
          <div ref={pieChartRef} style={{ width: '100%', height: '400px' }}></div>
        </Card>
        {/* Positive Cases Over Time - Pie Chart - end */}


        {/* Yearly Data Charts start */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* New Cases - Yearly Data Card start */}
          <Card
            title="New Cases - Yearly Data"
            extra={(
              <>
                <Tooltip title="Export to Excel">
                  <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData)), 'yearly_cases')} style={{ marginRight: 10, cursor: 'pointer' }} />
                </Tooltip>
                <Dropdown overlay={yearMenu(handleYearlyCasesFilterChange)} trigger={['click']}>
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
                <div ref={chartRef3}></div>
              </TabPane>
              <TabPane tab="Data Table" key="2">
                <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('positiveIncrease', filteredYearlyCasesData))} rowKey="year" />
              </TabPane>
            </Tabs>
          </Card>
          {/* New Cases - Yearly Data Card end */}    
          
          {/* New Deaths - Yearly Data Card start */}
          <Card
            title="New Deaths - Yearly Data"
            extra={(
              <>
                <Tooltip title="Export to Excel">
                  <DownloadOutlined onClick={() => exportToExcel(Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData)), 'yearly_deaths')} style={{ marginRight: 10, cursor: 'pointer' }} />
                </Tooltip>
                <Dropdown overlay={yearMenu(handleYearlyDeathsFilterChange)} trigger={['click']}>
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
                <div ref={chartRef4}></div>
              </TabPane>
              <TabPane tab="Data Table" key="2">
                <Table columns={yearlyColumns} dataSource={Object.values(yearlyData('deathIncrease', filteredYearlyDeathsData))} rowKey="year" />
              </TabPane>
            </Tabs>
          </Card>
          {/* New Deaths - Yearly Data Card end */}

        </div>
        {/* Yearly Data Charts end */}

      </Content>
      {/* Main content section end */}
    </Layout>
  );
}
{/* Script End */}
