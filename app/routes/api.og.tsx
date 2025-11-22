import type { Route } from "./+types/api.og";
import axios from "axios";
import { load } from "cheerio";

// Функція для створення JSON Response
function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Функція для отримання OG мета-тегів з URL
async function getOgImage(url: string) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = load(data);

    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content');

    const ogTitle =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text();

    const ogDescription =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content');

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
    if (error instanceof Error) {
      console.error(`Error fetching OG data for ${url}:`, error.message);
    }
    return null;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  // Перевіряємо, чи це запит до API (не HTML)
  const accept = request.headers.get('accept') || '';
  const isApiRequest = accept.includes('application/json') ||
    accept.includes('*/*') ||
    !accept.includes('text/html');

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

    // Блокуємо localhost та невалідні домени
    const hostname = validatedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.includes('localhost') ||
      hostname === 'nda' ||
      !hostname.includes('.') // Блокуємо домени без крапки (наприклад, просто "NDA")
    ) {
      return jsonResponse({ error: 'Invalid or blocked hostname' }, 400);
    }

    const ogData = await getOgImage(targetUrl);

    if (!ogData) {
      return jsonResponse({ error: 'No OG data found' }, 404);
    }

    return jsonResponse(ogData);
  } catch (error) {
    console.error('Error in OG loader:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// API route - повертаємо Response напряму, без рендерингу
export async function action({ request }: Route.ActionArgs) {
  return loader({ request } as Route.LoaderArgs);
}

// API route не потребує UI компонента - не експортуємо default

