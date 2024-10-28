"use client";

// Import required dependencies
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from '../CovidForm.module.css';

// List of European countries for dropdown selection
const europeanCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
  "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
];

// Interface defining the structure of form data
interface FormData {
  date: string;
  positive: number;
  negative: number;
  death: number;
  recovered: number;
  hospitalized: number;
  country: string;
}

export default function CovidForm() {
  // State for form data with initial values
  const [formData, setFormData] = useState<FormData>({
    date: '',
    positive: 0,
    negative: 0,
    death: 0,
    recovered: 0,
    hospitalized: 0,
    country: '',
  });

  // State for displaying alert messages
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Handle input changes for all form fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Convert to number for numeric fields, keep as string for date and country
      [name]: name === "country" ? value : name === "date" ? value : Number(value),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Send POST request to API
    const response = await fetch('/api/covid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      // Show success message and reset form
      setAlertMessage("Data successfully added!");
      setFormData({ date: '', positive: 0, negative: 0, death: 0, recovered: 0, hospitalized: 0, country: '' });
      
      // Timeout to refresh the page after the alert disappears
      setTimeout(() => {
        setAlertMessage(null);
        window.location.reload();
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // Show error message
      setAlertMessage("Failed to add data. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // Render form component
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.title}>Covid Data Gathering Form</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
           {/* Date input field */}
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
          
          {/* Positive cases input field */}
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

          {/* Negative cases input field */}
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

          {/* Deaths input field */}
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

          {/* Recovered cases input field */}
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

          {/* Hospitalized cases input field */}
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

          {/* Country selection dropdown */}
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
          
          {/* Submit button */}
          <button className={styles.button} type="submit">Submit</button>
          
          {/* Alert message display */}
          {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
        </form>
      </div>
    </div>
  );
}

/* CovidForm Script End */