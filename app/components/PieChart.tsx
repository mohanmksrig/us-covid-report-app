import { Card } from 'antd';
import { CovidData } from '../types';
import { useEffect, useRef } from 'react';
import { Pie } from '@antv/g2plot';

interface PieChartProps {
  data: CovidData[];
}

export default function PieChart({ data }: PieChartProps) {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const pieChartInstance = useRef<Pie | null>(null);

  useEffect(() => {
    if (pieChartRef.current) {
      renderPieChart(pieChartRef.current, data);
    }
  }, [data]);

  // Function to render the pie chart
  const renderPieChart = (container: HTMLElement, chartData: CovidData[]) => {
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

  return (
    /* Positive Cases Over Time - Pie Chart - start */
    <Card
      title="Positive Cases Over Time - Monthly Data"
      style={{ marginBottom: '20px' }}
    >
      <div ref={pieChartRef} style={{ width: '100%', height: '400px' }}></div>
    </Card>
    /* Positive Cases Over Time - Pie Chart - end */
  );
}

/* PieChart Script End */