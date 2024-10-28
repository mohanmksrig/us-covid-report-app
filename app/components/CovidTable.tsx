// Import required dependencies
import React from 'react';
import styles from '../CovidForm.module.css';

// Interface defining the structure of COVID data
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

// Props interface for the CovidTable component
interface CovidTableProps {
  data: CovidData[];
}

export default function CovidTable({ data }: CovidTableProps) {
  return (
    // Main container for the table section
    <div className={styles.tableSection}>
      <h2 className={styles.title}>Covid Data Gathering Table</h2>
      <div className={styles.tableWrapper}>
      <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Positive</th>
                <th>Negative</th>
                <th>Deaths</th>
                <th>Recovered</th>
                <th>Hospitalized</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {/* Conditional rendering based on data availability */}
              {data.length > 0 ? (
                // Map through data array to create table rows
              data.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="Date">{new Date(entry.date).toLocaleDateString()}</td>
                    <td data-label="Positive">{entry.positive}</td>
                    <td data-label="Negative">{entry.negative}</td>
                    <td data-label="Deaths">{entry.death}</td>
                    <td data-label="Recovered">{entry.recovered}</td>
                    <td data-label="Hospitalized">{entry.hospitalized}</td>
                    <td data-label="Country">{entry.country}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}

/* CovidTable Script End */