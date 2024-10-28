// File: app/api/covid/route.js
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const covidData = await sql`SELECT * FROM CovidData`;
    return NextResponse.json({ covidData: covidData.rows }, { status: 200 });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
  const { date, positive, negative, death, recovered, hospitalized, country } = await request.json();

  try {
    await sql`
      INSERT INTO CovidData (date, positive, negative, death, recovered, hospitalized, country)
      VALUES (${date}, ${positive}, ${negative}, ${death}, ${recovered}, ${hospitalized}, ${country});
    `;
    return NextResponse.json({ message: 'Data inserted successfully' }, { status: 201 });
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  catch (error) {
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}