// Import required dependencies
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

/**
 * GET endpoint to fetch all COVID data
 * @route GET /api/covid
 * @returns {Promise<Response>} JSON response with COVID data or error message
 */
export async function GET() {
  try {
    // Execute SQL query to fetch all records from CovidData table
    const covidData = await sql`SELECT * FROM CovidData`;

    // Return successful response with data
    return new Response(JSON.stringify({ covidData: covidData.rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
     // Return error response if query fails
     return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    return new Response(JSON.stringify({ message: 'Data inserted successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
    // Return error response if insertion fails
    return new Response(JSON.stringify({ error: 'Failed to insert data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/* Route Script End */