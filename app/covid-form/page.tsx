"use client"

// Import required dependencies
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CovidForm from '../components/CovidForm';
import CovidTable from '../components/CovidTable';
import NavMenu from '../components/NavMenu';
import styles from '../CovidForm.module.css';

// Dynamically import CovidBarChart with client-side rendering only
const CovidBarChart = dynamic(() => import('../components/CovidBarChart'), { ssr: false });

/**
 * COVID Form Page Component
 * Displays form, chart, and table for COVID data management
 */
const CovidFormPage: React.FC = () => {
  // State for storing COVID data
  const [data, setData] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API
        const response = await fetch('/api/covid');
        const result = await response.json();
        // Update state with fetched data
        setData(result.covidData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    // Main container for the page
    <div className={styles.container}>
      {/* Navigation menu */}
      <NavMenu currentPage="form" />
      {/* Form and Chart Row */}
      <div className={styles.row}>
        {/* Form column */}
        <div className={styles.column}>
          <CovidForm />
        </div>
        {/* Chart column */}
        <div className={styles.column}>
          <CovidBarChart />
        </div>
      </div>

      {/* Table section */}
      <div className={styles.tableRow}>
        <div className={styles.tableSection}>
          <CovidTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default CovidFormPage;

/* Covid Form, Table and Charts Script End */