// Import required dependencies
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

/**
 * GET endpoint to fetch all COVID data
 * @route GET /api/covid
 * @returns {Object} JSON response with COVID data or error message
 */
export async function GET() {
  try {
    // Execute SQL query to fetch all records from CovidData table
    const covidData = await sql`SELECT * FROM CovidData`;

    // Return successful response with data
    return NextResponse.json({ covidData: covidData.rows }, { status: 200 });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
     // Return error response if query fails
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

/**
 * POST endpoint to insert new COVID data
 * @route POST /api/covid
 * @param {Object} request - Request object containing COVID data
 * @returns {Object} JSON response with success/error message
 */
export async function POST(request) {
  const { date, positive, negative, death, recovered, hospitalized, country } = await request.json();

  try {
    // Execute SQL query to insert new record
    await sql`
      INSERT INTO CovidData (date, positive, negative, death, recovered, hospitalized, country)
      VALUES (${date}, ${positive}, ${negative}, ${death}, ${recovered}, ${hospitalized}, ${country});
    `;

    // Return success response
    return NextResponse.json({ message: 'Data inserted successfully' }, { status: 201 });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
    // Return error response if insertion fails
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}