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

## Tech Stack

- Next.js (React framework)
- TypeScript
- Ant Design (UI components)
- @antv/g2 (Charting library)
- Axios (HTTP client)
- XLSX (Excel file generation)
- CSS Modules (for component-specific styling)

## Project Structure

- `app/`: Main application directory
  - `components/`: Reusable React components
  - `styles/`: CSS Module files for component styling
    - `PageDesign.module.css`: Main stylesheet for page layout and responsiveness
  - `types.ts`: TypeScript interfaces
  - `utils.ts`: Utility functions
  - `page.tsx`: Main page component
  - `types.ts`: Define the types
  - `utils.ts`: Main page component support file and fetch API Data
- `public/`: Static assets

## Key Components

1. `NewCasesCard`: Displays monthly new cases data
2. `NewDeathsCard`: Displays monthly new deaths data
3. `YearlyCasesCard`: Shows yearly cases distribution
4. `YearlyDeathsCard`: Shows yearly deaths distribution
5. `PieChart`: Visualizes positive cases over time

## Styling and Responsiveness

The application uses a combination of Ant Design's built-in responsive components and custom CSS for optimal display across various device sizes:

- `PageDesign.module.css`: Contains responsive grid layouts and media queries for different screen sizes
- Flexbox and CSS Grid: Utilized for flexible and responsive component arrangements
- Ant Design's responsive grid system: Ensures proper alignment and spacing of UI elements

## Mobile Responsiveness

The dashboard is optimized for mobile devices with the following features:

- Responsive charts that adjust to screen width
- Collapsible sections for better navigation on small screens
- Touch-friendly UI elements for easy interaction on mobile devices
- Adjusted font sizes and spacing for improved readability on small screens

## Data Source

The application fetches data from the COVID Tracking Project API:
`https://api.covidtracking.com/v1/us/daily.json`

## Setup and Running

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser

## Testing Responsiveness

To test the mobile responsiveness of the application:

1. Open the application in a web browser
2. Use browser developer tools to toggle device emulation
3. Test on various device sizes (e.g., iPhone, iPad, Android phones)
4. Alternatively, access the deployed application on a real mobile device