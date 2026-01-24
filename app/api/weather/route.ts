import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.WEATHER_API_BASE_URL;
  const apiKey = process.env.WEATHER_API_KEY;
  const city = process.env.DEFAULT_CITY || 'Bengaluru';
  const units = process.env.UNITS || 'metric';

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: 'Weather API configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const url = `${baseUrl}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
    const response = await fetch(url, { 
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0]?.main || 'Unknown',
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '01d',
      humidity: data.main.humidity,
      feelsLike: Math.round(data.main.feels_like),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
