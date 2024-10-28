// Import required dependencies
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

/**
 * GET endpoint to fetch all COVID data
 */
export async function GET() {
  try {
    const covidData = await sql`SELECT * FROM CovidData`;
    return NextResponse.json({ covidData: covidData.rows }, { status: 200 });
  } 
  // eslint-disable-next-line no-unused-vars
  catch (error) {
    // eslint-disable-next-line no-unused-vars
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

/**
 * POST endpoint to insert new COVID data
 */
export async function POST(request) {
  try {
    const { date, positive, negative, death, recovered, hospitalized, country } = await request.json();

    await sql`
      INSERT INTO CovidData (date, positive, negative, death, recovered, hospitalized, country)
      VALUES (${date}, ${positive}, ${negative}, ${death}, ${recovered}, ${hospitalized}, ${country});
    `;
    return NextResponse.json({ message: 'Data inserted successfully' }, { status: 201 });
  } 
  // eslint-disable-next-line no-unused-vars
  catch (error) {
    // eslint-disable-next-line no-unused-vars
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}

/* Route Script End */