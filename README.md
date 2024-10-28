# Next-JS web application for COVID-19 Data Visualization Dashboard Application for the United States

## Overview

This project is a comprehensive COVID-19 data visualization dashboard for the United States. It provides an interactive interface to explore and analyze COVID-19 statistics, including new cases, deaths, and yearly trends, using various charts and data tables.

## Features

- Interactive charts for new cases and deaths over time (monthly data)
- Yearly pie charts for cases and deaths distribution
- Filterable data by state and year
- Exportable data to Excel
- Responsive design using Ant Design components
- Mobile-friendly layout and components
- Real-time data updates
- Data Entry Form for COVID-19 statistics
- Server-side data persistence using Vercel Postgres
- Navigation menu for easy switching between dashboard and form views
- Responsive navigation controls
- Seamless client-side routing between pages
- Consistent UI across different views

## Tech Stack

- **Frontend**
  - Next.js 14 (React framework)
  - TypeScript
  - Ant Design (UI components)
  - @antv/g2 (Charting library)
  - Axios (HTTP client)
  - XLSX (Excel file generation)
  - CSS Modules (for component-specific styling)

- **Backend**
  - Next.js API Routes
  - Vercel Postgres
  - @vercel/postgres

## Project Structure

```plaintext
app/
├── api/
│   └── covid/
│       └── route.js         # Handles API requests for COVID data using Vercel Postgres
├── components/
│   ├── CovidForm.tsx        # Data entry form with validation
│   ├── CovidTable.tsx       # Displays COVID data in tabular format
│   ├── CovidBarChart.tsx    # Visualizes country-wise COVID cases
│   ├── Header.tsx           # App header with title and navigation
│   ├── NavMenu.tsx          # Navigation between dashboard and form views
│   ├── NewCasesCard.tsx     # Shows new COVID cases trends
│   ├── NewDeathsCard.tsx    # Shows death cases trends
│   ├── PieChart.tsx         # Circular visualization of COVID data
│   ├── YearlyCasesCard.tsx  # Yearly COVID cases summary
│   └── YearlyDeathsCard.tsx # Yearly death cases summary
├── covid-form/
│   └── page.tsx             # Data entry and visualization page
├── page.tsx                 # Main dashboard with charts and statistics
├── types.ts                 # TypeScript interfaces for data structures
├── utils.ts                 # Helper functions for data processing
├── PageDesign.module.css    # Main stylesheet for layout
└── CovidForm.module.css     # Form-specific styles
public/
└── assets/                  # Static assets
```

## Key Components

1. `NewCasesCard`: Displays monthly new cases data
2. `NewDeathsCard`: Displays monthly new deaths data
3. `YearlyCasesCard`: Shows yearly cases distribution
4. `YearlyDeathsCard`: Shows yearly deaths distribution
5. `PieChart`: Visualizes positive cases over time
6. `CovidForm`: Input form for new COVID-19 data entries
7. `CovidTable`: Displays all COVID-19 data in a tabular format
8. `CovidBarChart`: Visualizes total positive cases by country
9. `NavMenu`: Provides navigation between dashboard and form views

## Database Schema

The application uses a Vercel Postgres database with the following structure:

CREATE TABLE CovidData (
    id SERIAL PRIMARY KEY,
    date DATE,
    positive INTEGER,
    negative INTEGER,
    death INTEGER,
    recovered INTEGER,
    hospitalized INTEGER,
    country VARCHAR(255)
);

## Responsive Design

The application is fully responsive across all device sizes:
- Desktop: Full-width layout with side-by-side form and chart
- Tablet: Adjusted spacing and component sizes
- Mobile: Stacked layout for optimal viewing on smaller screens

## Data Source

The application fetches data from the COVID Tracking Project API:
`https://api.covidtracking.com/v1/us/daily.json`

## API Endpoints

- `GET /api/covid`
  - Retrieves all COVID-19 data entries
  - Returns data in JSON format

- `POST /api/covid`
  - Adds new COVID-19 data entry
  - Required fields: date, positive, negative, death, recovered, hospitalized, country

## Setup and Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server
5. Open `http://localhost:3000` in your browser

## Testing Responsiveness

To test the mobile responsiveness of the application:

1. Open the application in a web browser
2. Use browser developer tools to toggle device emulation
3. Test on various device sizes (e.g., iPhone, iPad, Android phones)
4. Alternatively, access the deployed application on a real mobile device