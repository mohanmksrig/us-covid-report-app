// Define the type for the data fetched from the API
export interface CovidData {
    date: string;
    states: number;
    positive: number;
    negative: number;
    pending: number;
    hospitalizedCurrently: number;
    hospitalizedCumulative: number;
    inIcuCurrently: number;
    inIcuCumulative: number;
    onVentilatorCurrently: number;
    onVentilatorCumulative: number;
    dateChecked: string;
    death: number;
    hospitalized: number;
    totalTestResults: number;
    lastModified: string;
    recovered: number | null;
    total: number;
    posNeg: number;
    deathIncrease: number;
    hospitalizedIncrease: number;
    negativeIncrease: number;
    positiveIncrease: number;
    totalTestResultsIncrease: number;
    hash: string;
    stateName?: string;
    year?: number;
  }