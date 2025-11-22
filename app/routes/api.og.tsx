import type { Route } from "./+types/api.og";
import { json } from "react-router";
import { parse } from "node-html-parser";

// Функція для отримання OG мета-тегів з URL
async function fetchOgData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
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
    console.error(`Error fetching OG data for ${url}:`, error);
    return null;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Валідація URL
  try {
    new URL(targetUrl);
  } catch {
    return json({ error: 'Invalid URL' }, { status: 400 });
  }

  const ogData = await fetchOgData(targetUrl);
  
  if (!ogData) {
    return json({ error: 'No OG data found' }, { status: 404 });
  }

  return json(ogData);
}

