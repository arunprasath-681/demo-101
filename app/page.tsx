'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  feelsLike: number;
  timestamp: string;
}

// Weather condition to gradient class mapping
const getWeatherGradientClass = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
    return 'weather-gradient-clear';
  }
  if (lowerCondition.includes('cloud')) {
    return 'weather-gradient-clouds';
  }
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return 'weather-gradient-rain';
  }
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return 'weather-gradient-storm';
  }
  if (lowerCondition.includes('snow')) {
    return 'weather-gradient-snow';
  }
  if (lowerCondition.includes('mist') || lowerCondition.includes('fog') || lowerCondition.includes('haze')) {
    return 'weather-gradient-mist';
  }
  return 'weather-gradient-default';
};

// Format time using Intl.DateTimeFormat (i18n compliant)
const formatTime = (timestamp: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
};

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center weather-gradient-default animate-gradient p-6">
      <div className="text-center animate-fade-in" role="status" aria-label="Loading weather data">
        <div className="relative w-20 h-20 mx-auto mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-glow" />
          {/* Spinner */}
          <div className="absolute inset-2 border-4 border-white/30 border-t-white rounded-full animate-spin-slow" />
          {/* Center dot */}
          <div className="absolute inset-1/3 rounded-full bg-white/60 backdrop-blur-sm" />
        </div>
        <p className="text-white/90 text-lg font-medium tracking-wide">Loading…</p>
        <p className="text-white/60 text-sm mt-2">Fetching weather for Bengaluru</p>
      </div>
    </div>
  );
}

// Error component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 animate-gradient p-6">
      <div className="text-center max-w-md animate-fade-in">
        {/* Error icon with glassmorphism */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full glass-card flex items-center justify-center">
          <svg
            className="w-12 h-12 text-rose-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3">
          Unable to Load Weather
        </h1>
        <p className="text-white/80 mb-8 leading-relaxed">
          {error}. Please check your connection and try again.
        </p>

        <button
          onClick={onRetry}
          className="px-8 py-4 glass-card rounded-2xl font-medium text-white 
                     interactive-hover focus-visible:ring-2 focus-visible:ring-white 
                     focus-visible:ring-offset-2 focus-visible:ring-offset-rose-500
                     transition-all duration-200"
          aria-label="Retry loading weather data"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Weather display component
function WeatherDisplay({ weather }: { weather: WeatherData }) {
  const gradientClass = getWeatherGradientClass(weather.condition);

  return (
    <div className={`min-h-screen flex items-center justify-center ${gradientClass} animate-gradient p-6`}>
      <main className="w-full max-w-sm animate-fade-in">
        {/* Main weather card with glassmorphism */}
        <article className="glass-card rounded-3xl p-8 interactive-hover">

          {/* Location header */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-white/80"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
                {weather.city}
              </span>
            </div>
          </header>

          {/* Weather icon with floating animation */}
          <div className="flex justify-center mb-4">
            <div className="animate-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt=""
                aria-hidden="true"
                className="w-36 h-36 drop-shadow-2xl"
                width={144}
                height={144}
              />
            </div>
          </div>

          {/* Temperature - Large display with tabular nums */}
          <div className="text-center mb-4">
            <div
              className="temperature-display text-8xl font-extralight text-white"
              aria-label={`Temperature: ${weather.temperature} degrees Celsius`}
            >
              {weather.temperature}
              <span className="text-4xl align-top ml-1 font-light">°C</span>
            </div>
          </div>

          {/* Weather description */}
          <div className="text-center mb-8">
            <p className="text-xl font-medium text-white/95 capitalize">
              {weather.description}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-6">
            {/* Feels like */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <span className="text-sm text-white/90 tabular-nums">
                Feels {weather.feelsLike}°
              </span>
            </div>

            {/* Humidity */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm text-white/90 tabular-nums">
                {weather.humidity}%
              </span>
            </div>
          </div>

          {/* Last updated timestamp */}
          <footer className="text-center">
            <p className="text-xs text-white/60">
              Updated at {formatTime(weather.timestamp)}
            </p>
          </footer>
        </article>

        {/* Attribution */}
        <p className="text-center text-xs text-white/40 mt-6">
          Powered by OpenWeatherMap
        </p>
      </main>
    </div>
  );
}

// Main page component
export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error('Unable to fetch weather');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchWeather} />;
  }

  // Success state
  if (weather) {
    return <WeatherDisplay weather={weather} />;
  }

  return null;
}
