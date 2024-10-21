'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Layout, Typography, Dropdown, Table } from 'antd';
import { Chart } from '@antv/g2';
import styles from './Pagedesign.module.css';

const { Header, Content } = Layout;
const { Title } = Typography;

interface CovidData {
  date: string;
  positiveIncrease: number;
  deathIncrease: number;
  stateName: string;
  states: number;
}

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

const aggregateDataByMonth = (data: CovidData[]): CovidData[] => {
  const monthlyData: { [key: string]: CovidData } = {};

  data.forEach(item => {
    const date = new Date(item.date);
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
  const [data, setData] = useState<CovidData[]>([]);
  const [filteredCasesData, setFilteredCasesData] = useState<CovidData[]>([]);
  const [filteredDeathsData, setFilteredDeathsData] = useState<CovidData[]>([]);
  const [selectedCasesState, setSelectedCasesState] = useState<string>('All States');
  const [selectedDeathsState, setSelectedDeathsState] = useState<string>('All States');

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);

  const fetchData = async (): Promise<CovidData[]> => {
    try {
      const res = await axios.get<CovidData[]>('https://api.covidtracking.com/v1/us/daily.json');
      const dataWithNames = res.data.map(item => ({
        ...item,
        stateName: stateMapping[item.states] || 'Unknown',
      }));
      return dataWithNames;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  };

  const renderChart = (
    container: HTMLElement | null, 
    chartData: CovidData[], 
    metric: keyof CovidData, 
    chartInstance: React.MutableRefObject<Chart | null>,
    color: string
  ) => {
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
        formatter: (text) => text.split('-')[1],
        autoRotate: true,
      },
    });

    chart.render();
    chartInstance.current = chart;
  };

  useEffect(() => {
    fetchData().then((fetchedData) => {
      if (fetchedData.length > 0) {
        const aggregatedData = aggregateDataByMonth(fetchedData);
        setData(fetchedData);
        setFilteredCasesData(aggregatedData);
        setFilteredDeathsData(aggregatedData);
        renderChart(chartRef1.current, aggregatedData, 'positiveIncrease', chartInstance1, '#4CAF50');
        renderChart(chartRef2.current, aggregatedData, 'deathIncrease', chartInstance2, '#FF5252');
      }
    });
  }, []);

  const handleCasesFilterChange = (state: string) => {
    setSelectedCasesState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredCasesData(filteredData);
    renderChart(chartRef1.current, filteredData, 'positiveIncrease', chartInstance1, '#4CAF50');
  };

  const handleDeathsFilterChange = (state: string) => {
    setSelectedDeathsState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredDeathsData(filteredData);
    renderChart(chartRef2.current, filteredData, 'deathIncrease', chartInstance2, '#FF5252');
  };

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

  const stateMenuItems = (handleFilterChange: (state: string) => void) => [
    { key: 'all', label: 'All States', onClick: () => handleFilterChange('All States') },
    ...Object.entries(stateMapping).map(([id, state]) => ({
      key: id,
      label: state,
      onClick: () => handleFilterChange(state),
    })),
  ];

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.titleContainer}>
          <Title level={2} className={styles.title}>US Covid Data Report using Graphical Charts</Title>
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <div style={{ marginBottom: 16 }}>
            <h2>New Cases Over Time</h2>
            <Dropdown menu={{ items: stateMenuItems(handleCasesFilterChange) }} trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                {selectedCasesState} ▼
              </a>
            </Dropdown>
            <div ref={chartRef1}></div>
            <Table columns={columns} dataSource={filteredCasesData} rowKey="date" />
          </div>
          <div>
            <h2>New Deaths Over Time</h2>
            <Dropdown menu={{ items: stateMenuItems(handleDeathsFilterChange) }} trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                {selectedDeathsState} ▼
              </a>
            </Dropdown>
            <div ref={chartRef2}></div>
            <Table columns={columns} dataSource={filteredDeathsData} rowKey="date" />
          </div>
        </div>
      </Content>
    </Layout>
  );
}