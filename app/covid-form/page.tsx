
"use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CovidForm from '../components/CovidForm';
import CovidTable from '../components/CovidTable';
import NavMenu from '../components/NavMenu';
import styles from '../CovidForm.module.css';

const CovidBarChart = dynamic(() => import('../components/CovidBarChart'), { ssr: false });

const CovidFormPage: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/covid');
        const result = await response.json();
        setData(result.covidData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <NavMenu currentPage="form" />
      <div className={styles.row}>
        <div className={styles.column}>
          <CovidForm />
        </div>
        <div className={styles.column}>
          <CovidBarChart />
        </div>
      </div>

      <div className={styles.tableRow}>
        <div className={styles.tableSection}>
          <CovidTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default CovidFormPage;
