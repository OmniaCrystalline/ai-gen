import type { Route } from "./+types/api.og";
import { parse } from "node-html-parser";

// Функція для створення JSON Response
function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Функція для отримання OG мета-тегів з URL з timeout
async function fetchOgData(url: string) {
  try {
    // Додаємо timeout для fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const html = await response.text();
    
    if (!html || html.length === 0) {
      return null;
    }
    
    const doc = parse(html);
    
    const ogImage = 
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="og:image:url"]')?.getAttribute('content');
    
    const ogTitle = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent;
    
    const ogDescription = 
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content');

    if (ogImage) {
      // Перетворюємо відносний URL на абсолютний
      let imageUrl = ogImage;
      if (ogImage.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.origin}${ogImage}`;
      } else if (!ogImage.startsWith('http')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.origin}/${ogImage}`;
      }

      return {
        image: imageUrl,
        title: ogTitle || undefined,
        description: ogDescription || undefined,
      };
    }
    
    return null;
  } catch (error) {
    // Тихо обробляємо помилки
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error(`Error fetching OG data for ${url}:`, error.message);
    }
    return null;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return jsonResponse({ error: 'URL parameter is required' }, 400);
    }

    // Валідація URL
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(targetUrl);
    } catch {
      return jsonResponse({ error: 'Invalid URL' }, 400);
    }

    // Дозволяємо тільки http та https
    if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
      return jsonResponse({ error: 'Only HTTP and HTTPS URLs are allowed' }, 400);
    }

    const ogData = await fetchOgData(targetUrl);
    
    if (!ogData) {
      return jsonResponse({ error: 'No OG data found' }, 404);
    }

    return jsonResponse(ogData);
  } catch (error) {
    console.error('Error in OG loader:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// API route не потребує UI компонента
export default function ApiOg() {
  return null;
}

