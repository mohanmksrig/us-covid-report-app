/**
 * Author: Mohankumar Selvaraj
 * Email: mohanmksri@gmail.com
 * Date: 22-Oct-2024
 * Description: This Application is a Next-JS web application that visualizes COVID-19 data for the United States. 
 */

// 'use client';
'use client';

//Import required libraries and components files 
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
import styles from './Pagedesign.module.css';
import NavMenu from './components/NavMenu';

const { Content } = Layout;

export default function Home() {
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

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  const chartInstance3 = useRef<Chart | null>(null);
  const chartInstance4 = useRef<Chart | null>(null);

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
        renderChart(chartRef1.current, aggregated, 'positiveIncrease', chartInstance1, '#4CAF50');
        renderChart(chartRef2.current, aggregated, 'deathIncrease', chartInstance2, '#FF5252');
        renderYearlyPieChart(chartRef3.current, aggregated, 'positiveIncrease', chartInstance3);
        renderYearlyPieChart(chartRef4.current, aggregated, 'deathIncrease', chartInstance4);
      }
    });
  }, []);

  // Handler for cases filter change
  const handleCasesFilterChange = (state: string) => {
    setSelectedCasesState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredCasesData(filteredData);
    renderChart(chartRef1.current, filteredData, 'positiveIncrease', chartInstance1, '#4CAF50');
  };

  // Handler for deaths filter change
  const handleDeathsFilterChange = (state: string) => {
    setSelectedDeathsState(state);
    let filteredData = state === 'All States' ? data : data.filter(item => item.stateName === state);
    filteredData = aggregateDataByMonth(filteredData);
    setFilteredDeathsData(filteredData);
    renderChart(chartRef2.current, filteredData, 'deathIncrease', chartInstance2, '#FF5252');
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <NavMenu currentPage="dashboard" />
      {/* Main content section start */}
      <Content className={styles.content}>
      <div className={styles.cardContainer}>
          {/* New Cases Over Time Card start -- app/components/NewCasesCard.tsx */}
          <NewCasesCard
            filteredCasesData={filteredCasesData}
            chartRef={chartRef1}
            handleCasesFilterChange={handleCasesFilterChange}
            exportToExcel={exportToExcel}
          />
          {/* New Cases Over Time Card end */}

          {/* New Deaths Over Time Card start -- app/components/NewDeathsCard.tsx */}
          <NewDeathsCard
            filteredDeathsData={filteredDeathsData}
            chartRef={chartRef2}
            handleDeathsFilterChange={handleDeathsFilterChange}
            exportToExcel={exportToExcel}
          />
          {/* New Deaths Over Time Card end */}
        </div>
        

        {/* Positive Cases Over Time - Pie Chart - start -- app/components/PieChart.tsx */}
        <div className={styles.cardContainer}>
          <PieChart data={data} />
        </div>
        {/* Positive Cases Over Time - Pie Chart - end */}

        {/* Yearly Data Charts start */}
        <div className={styles.cardContainer}>
          {/* New Cases - Yearly Data Card start -- app/components/YearlyCasesCard.tsx */}
          <YearlyCasesCard
            filteredYearlyCasesData={filteredYearlyCasesData}
            allData={data}
            chartRef={chartRef3}
            handleYearlyCasesFilterChange={handleYearlyCasesFilterChange}
            exportToExcel={exportToExcel}
          />
          {/* New Cases - Yearly Data Card end */}  

          {/* New Deaths - Yearly Data Card start -- app/components/YearlyDeathsCard.tsx */}
          <YearlyDeathsCard
            filteredYearlyDeathsData={filteredYearlyDeathsData}
            allData={data}
            chartRef={chartRef4}
            handleYearlyDeathsFilterChange={handleYearlyDeathsFilterChange}
            exportToExcel={exportToExcel}
          />
          {/* New Deaths - Yearly Data Card end */}

        </div>
        {/* Yearly Data Charts end */}
      </Content>
      {/* Main content section end */}
    </Layout>
  );
}

/* Page Script End */