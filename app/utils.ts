// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MenuProps } from 'antd';
import { CovidData } from './types';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Chart } from '@antv/g2';

// Static mapping of state IDs to state names
export const stateMapping: Record<number, string> = {
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

export const columns = [
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

export const yearlyColumns = [
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

// Function to fetch COVID-19 data from the API
export const fetchData = async (): Promise<{ aggregated: CovidData[], raw: CovidData[] }> => {
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

// Function to aggregate data by month
export const aggregateDataByMonth = (data: CovidData[]): CovidData[] => {
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

// Function to aggregate yearly data
export const yearlyData = (metric: 'positiveIncrease' | 'deathIncrease', data: CovidData[]) => {
  return data.reduce((acc, item) => {
    const year = item.year!;
    if (!acc[year]) {
      acc[year] = { year, total: 0 };
    }
    acc[year].total += item[metric];
    return acc;
  }, {} as Record<number, { year: number; total: number }>);
};

// Function to export data to Excel
export const exportToExcel = (data: CovidData[] | { year: number; total: number }[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'COVID Data');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Function to generate state filter menu
export const stateMenu = (handleFilterChange: (state: string) => void): MenuProps['items'] => [
    {
      key: 'all',
      label: 'All States',
      onClick: () => handleFilterChange('All States')
    },
    ...Object.entries(stateMapping).map(([id, state]) => ({
      key: id,
      label: state,
      onClick: () => handleFilterChange(state)
    }))
  ];

// Function to generate year filter menu
export const yearMenu = (handleFilterChange: (year: number | null) => void, data: CovidData[] | undefined): MenuProps['items'] => [
{
    key: 'all',
    label: 'All Years',
    onClick: () => handleFilterChange(null)
},
...(data ? Array.from(new Set(data.map(item => item.year).filter((year): year is number => year !== undefined)))
    .sort()
    .map(year => ({
    key: year.toString(),
    label: year.toString(),
    onClick: () => handleFilterChange(year)
    })) : [])
];

// Function to render line charts
export const renderChart = (container: HTMLElement | null, chartData: CovidData[], metric: keyof CovidData, chartInstance: React.MutableRefObject<Chart | null>, color: string) => {
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
export const renderYearlyPieChart = (container: HTMLElement | null, chartData: CovidData[], metric: 'positiveIncrease' | 'deathIncrease', chartInstance: React.MutableRefObject<Chart | null>) => {
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

  chart.coordinate('theta', {
    radius: 0.75,
    innerRadius: 0.5,
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

/* Utils Script End */