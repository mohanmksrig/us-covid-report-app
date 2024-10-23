'use client';

import { Layout } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Chart } from '@antv/g2';
import { CovidData } from './types';
import { fetchData, aggregateDataByMonth, exportToExcel, renderChart, renderYearlyPieChart } from './utils';
import Header from './components/Header';
import NewCasesCard from './components/NewCasesCard';
import NewDeathsCard from './components/NewDeathsCard';
import PieChart from './components/PieChart';
import YearlyCasesCard from './components/YearlyCasesCard';
import YearlyDeathsCard from './components/YearlyDeathsCard';

const { Content } = Layout;

export default function Home() {
  const [data, setData] = useState<CovidData[]>([]);
  const [filteredCasesData, setFilteredCasesData] = useState<CovidData[]>([]);
  const [filteredDeathsData, setFilteredDeathsData] = useState<CovidData[]>([]);
  const [filteredYearlyCasesData, setFilteredYearlyCasesData] = useState<CovidData[]>([]);
  const [filteredYearlyDeathsData, setFilteredYearlyDeathsData] = useState<CovidData[]>([]);
  const [selectedCasesState, setSelectedCasesState] = useState<string>('All States');
  const [selectedDeathsState, setSelectedDeathsState] = useState<string>('All States');
  const [selectedYearlyCasesYear, setSelectedYearlyCasesYear] = useState<number | null>(null);
  const [selectedYearlyDeathsYear, setSelectedYearlyDeathsYear] = useState<number | null>(null);

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  const chartInstance3 = useRef<Chart | null>(null);
  const chartInstance4 = useRef<Chart | null>(null);

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
        renderChart(chartRef1.current, aggregated, 'positiveIncrease', chartInstance1, '#4CAF50');
        renderChart(chartRef2.current, aggregated, 'deathIncrease', chartInstance2, '#FF5252');
        renderYearlyPieChart(chartRef3.current, aggregated, 'positiveIncrease', chartInstance3);
        renderYearlyPieChart(chartRef4.current, aggregated, 'deathIncrease', chartInstance4);
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

  const handleYearlyCasesFilterChange = (year: number | null) => {
    setSelectedYearlyCasesYear(year);
    const filteredData = year ? data.filter(item => item.year === year) : data;
    setFilteredYearlyCasesData(filteredData);
    renderYearlyPieChart(chartRef3.current, filteredData, 'positiveIncrease', chartInstance3);
  };

  const handleYearlyDeathsFilterChange = (year: number | null) => {
    setSelectedYearlyDeathsYear(year);
    const filteredData = year ? data.filter(item => item.year === year) : data;
    setFilteredYearlyDeathsData(filteredData);
    renderYearlyPieChart(chartRef4.current, filteredData, 'deathIncrease', chartInstance4);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <NewCasesCard
            filteredCasesData={filteredCasesData}
            chartRef={chartRef1}
            handleCasesFilterChange={handleCasesFilterChange}
            exportToExcel={exportToExcel}
          />
          <NewDeathsCard
            filteredDeathsData={filteredDeathsData}
            chartRef={chartRef2}
            handleDeathsFilterChange={handleDeathsFilterChange}
            exportToExcel={exportToExcel}
          />
        </div>

        <PieChart data={data} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <YearlyCasesCard
            filteredYearlyCasesData={filteredYearlyCasesData}
            chartRef={chartRef3}
            handleYearlyCasesFilterChange={handleYearlyCasesFilterChange}
            exportToExcel={exportToExcel}
          />
          <YearlyDeathsCard
            filteredYearlyDeathsData={filteredYearlyDeathsData}
            chartRef={chartRef4}
            handleYearlyDeathsFilterChange={handleYearlyDeathsFilterChange}
            exportToExcel={exportToExcel}
          />
        </div>
      </Content>
    </Layout>
  );
}