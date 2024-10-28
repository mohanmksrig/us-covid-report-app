"use client"; // Add this line

import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { Chart } from '@antv/g2';
import styles from '../CovidForm.module.css';

interface CovidData {
  id: number;
  date: string;
  positive: number;
  negative: number;
  death: number;
  recovered: number;
  hospitalized: number;
  country: string;
}

interface AggregatedData {
  country: string;
  positive: number;
}

const CovidBarChart: React.FC = () => {
  const [data, setData] = useState<CovidData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/covid');
      //console.log('Recrds Detials', response);
      const result = await response.json();
      setData(result.covidData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData: AggregatedData[] = Object.values(
        data.reduce((acc: { [key: string]: AggregatedData }, curr) => {
          if (!acc[curr.country]) {
            acc[curr.country] = {
              country: curr.country,
              positive: 0,
            };
          }
          acc[curr.country].positive += curr.positive;
          return acc;
        }, {})
      );

      const chart = new Chart({
        container: 'covid-bar-chart',
        autoFit: true,
        height: 400,
      });

      chart.data(aggregatedData);
      chart.scale({
        country: {
          alias: 'Country',
        },
        positive: {
          alias: 'Total Positive Cases',
          nice: true,
        },
      });

      const interval = chart.interval();
      interval.encode('x', 'country')
              .encode('y', 'positive')
              .encode('color', 'country')
              .label({
                text: 'positive',
                style: {
                  textAlign: 'center',
                },
                offset: 10,
              });

      chart.axis('y', {
        title: {
          text: 'Total Positive Cases',
        },
      });

      chart.interaction('element-active');

      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return (
    <Card className={styles.card} title="Total COVID-19 Positive Cases by Country">
      {loading ? (
        <Spin size="large" />
      ) : (
        <div id="covid-bar-chart" className={styles.chartContainer}></div>
      )}
    </Card>
  );
};

export default CovidBarChart;