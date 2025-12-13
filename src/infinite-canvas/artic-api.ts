import type { MediaItem } from "./types";

const API_BASE = "https://api.artic.edu/api/v1";
const IIIF_BASE = "https://www.artic.edu/iiif/2";

type ArticSearchResponse = {
  data: ArticArtwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
};

type ArticArtwork = {
  id: number;
  title: string;
  artist_display: string;
  date_display: string;
  image_id: string;
  thumbnail?: {
    width: number;
    height: number;
  };
};

export async function fetchArticArtworks(page = 1, limit = 50): Promise<MediaItem[]> {
  try {
    // Fetch Renaissance paintings (approx 1400-1600), public domain, with images
    // Only fetch strictly necessary fields to save bandwidth
    const fields = "id,title,artist_display,date_display,image_id,thumbnail";

    // We use a complex search query to filter for Renaissance period (1400-1600) and Paintings
    const query = {
      query: {
        bool: {
          must: [
            { term: { is_public_domain: true } },
            { term: { "classification_titles.keyword": "painting" } },
            { term: { "department_title.keyword": "Painting and Sculpture of Europe" } },
            { range: { date_end: { gte: 1400 } } },
            { range: { date_start: { lte: 1600 } } },
          ],
        },
      },
    };

    // Serialize the query object for the GET request
    const params = encodeURIComponent(JSON.stringify(query));
    const searchUrl = `${API_BASE}/artworks/search?params=${params}&page=${page}&limit=${limit}&fields=${fields}`;

    console.log(`Fetching page ${page} from AIC API:`, searchUrl);

    const res = await fetch(searchUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch from AIC API: ${res.status} ${res.statusText}`);
    }

    const data: ArticSearchResponse = await res.json();

    if (!data.data || data.data.length === 0) {
      console.warn("No artworks found from AIC API");
      return [];
    }

    const artworks: MediaItem[] = [];

    // Shuffle results of this page to give variety (local shuffle, but pages are sequential)
    const shuffled = data.data.sort(() => 0.5 - Math.random());

    for (const item of shuffled) {
      if (item.image_id) {
        // Construct IIIF URL for the image
        const imageUrl = `${IIIF_BASE}/${item.image_id}/full/843,/0/default.jpg`;

        artworks.push({
          url: imageUrl,
          type: "image",
          title: item.title,
          artist: item.artist_display || "Unknown Artist",
          year: item.date_display,
          link: `https://www.artic.edu/artworks/${item.id}`,
          width: item.thumbnail?.width,
          height: item.thumbnail?.height,
        });
      }
    }

    return artworks;
  } catch (error) {
    console.error("Error fetching from AIC API:", error);
    return [];
  }
}
