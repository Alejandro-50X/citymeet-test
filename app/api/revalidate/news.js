// Save this as app/api/news/route.js
// This is a Next.js API route implementation

import { NextResponse } from 'next/server';

// NewsAPI key - consider moving this to environment variables
const NEWS_API_KEY = '9cbcdd36e60648878547cf8957fe087b';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'local';
    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 10;
    
    // Map category to appropriate search query
    let query;
    switch (category) {
      case 'local':
        query = 'Los Angeles news';
        break;
      case 'state':
        query = 'California news';
        break;
      case 'national':
        query = 'US news';
        break;
      case 'international':
        query = 'world news';
        break;
      default:
        query = 'news';
    }
    
    // Build the URL with parameters
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', query);
    url.searchParams.append('apiKey', NEWS_API_KEY);
    url.searchParams.append('page', page);
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('language', 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    
    // Make request to NewsAPI
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: 'Error fetching news', error: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { message: 'Error fetching news', error: error.message },
      { status: 500 }
    );
  }
}

// Add another API route for headlines if needed
// Save as app/api/headlines/route.js
export async function headlines() {
  // Similar implementation for headlines
}