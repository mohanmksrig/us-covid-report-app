// File: app/components/CovidForm.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from '../CovidForm.module.css';

// List of European countries
const europeanCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
  "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
];

interface FormData {
  date: string;
  positive: number;
  negative: number;
  death: number;
  recovered: number;
  hospitalized: number;
  country: string;
}

interface CovidData extends FormData {
  id: number;
}

export default function CovidForm() {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    positive: 0,
    negative: 0,
    death: 0,
    recovered: 0,
    hospitalized: 0,
    country: '',
  });
  const [data, setData] = useState<CovidData[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCovidData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "country" ? value : name === "date" ? value : Number(value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/covid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      setAlertMessage("Data successfully added!");
      setFormData({ date: '', positive: 0, negative: 0, death: 0, recovered: 0, hospitalized: 0, country: '' });
      
      // Set a timeout to refresh the page after the alert disappears
      setTimeout(() => {
        setAlertMessage(null);
        window.location.reload();
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      setAlertMessage("Failed to add data. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const fetchCovidData = async () => {
    try {
      const response = await fetch('/api/covid');
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      if (Array.isArray(result.covidData)) setData(result.covidData);
      else setData([]);
    } catch (error) {
      console.error("Failed to fetch Covid data:", error);
      setData([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.title}>Covid Data Gathering Form</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="date">Date</label>
          <input 
            className={styles.input} 
            type="date" 
            id="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="positive">Positive Cases</label>
          <input 
            className={styles.input} 
            type="number" 
            id="positive" 
            name="positive" 
            placeholder="Positive Cases" 
            value={formData.positive} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="negative">Negative Cases</label>
          <input 
            className={styles.input} 
            type="number" 
            id="negative" 
            name="negative" 
            placeholder="Negative Cases" 
            value={formData.negative} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="death">Deaths</label>
          <input 
            className={styles.input} 
            type="number" 
            id="death" 
            name="death" 
            placeholder="Deaths" 
            value={formData.death} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="recovered">Recovered</label>
          <input 
            className={styles.input} 
            type="number" 
            id="recovered" 
            name="recovered" 
            placeholder="Recovered" 
            value={formData.recovered} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="hospitalized">Hospitalized</label>
          <input 
            className={styles.input} 
            type="number" 
            id="hospitalized" 
            name="hospitalized" 
            placeholder="Hospitalized" 
            value={formData.hospitalized} 
            onChange={handleChange} 
            required 
          />

          <label className={styles.label} htmlFor="country">Country</label>
          <select
            className={styles.input}
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select a country</option>
            {europeanCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <button className={styles.button} type="submit">Submit</button>

          {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
        </form>
      </div>
    </div>
  );
}