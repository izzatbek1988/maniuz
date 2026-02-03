/**
 * Reverse geocoding using Yandex Maps API
 * Converts coordinates (lat, lng) to human-readable address
 */

export async function reverseGeocode(
  lat: number,
  lng: number,
  language: string
): Promise<string | null> {
  try {
    // Map language codes to Yandex format
    const langMap: { [key: string]: string } = {
      uz: 'uz_UZ',
      tr: 'tr_TR',
      ru: 'ru_RU',
    };
    const yandexLang = langMap[language] || 'uz_UZ';

    // Build Yandex Geocoding API URL
    // NOTE: Yandex uses lng,lat order (reversed!)
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&geocode=${lng},${lat}&format=json&lang=${yandexLang}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();

    // Extract address from response
    const geoObject =
      data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    if (!geoObject) {
      console.warn('No geocoding results found');
      return null;
    }

    const address =
      geoObject.metaDataProperty?.GeocoderMetaData?.Address?.formatted;
    return address || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
