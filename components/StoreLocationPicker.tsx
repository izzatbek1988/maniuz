'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { reverseGeocode } from '@/lib/geocoding';

interface StoreLocationPickerProps {
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Default coordinates for Urganch, Xorazm
const DEFAULT_LAT = 41.550151;
const DEFAULT_LNG = 60.627490;

declare global {
  interface Window {
    ymaps: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export default function StoreLocationPicker({
  onLocationChange,
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
}: StoreLocationPickerProps) {
  const { t, language } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const placemarkRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState<string | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    // Load Yandex Maps script
    const loadYandexMaps = () => {
      // Check if script already exists
      if (window.ymaps) {
        initMap();
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = () => {
        if (window.ymaps) {
          window.ymaps.ready(initMap);
        }
      };
      
      script.onerror = () => {
        setError(t('map_load_error') || 'Xaritani yuklashda xatolik');
        setLoading(false);
      };
      
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapContainerRef.current) {
        setLoading(false);
        return;
      }

      try {
        // Create map
        const map = new window.ymaps.Map(mapContainerRef.current, {
          center: [coordinates.lat, coordinates.lng],
          zoom: 13,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Create draggable placemark
        const placemark = new window.ymaps.Placemark(
          [coordinates.lat, coordinates.lng],
          {
            balloonContent: t('store_location') || 'Do\'kon manzili'
          },
          {
            preset: 'islands#redDotIcon',
            draggable: true
          }
        );

        // Handle placemark drag
        placemark.events.add('dragend', function () {
          const coords = placemark.geometry.getCoordinates();
          updateCoordinates(coords[0], coords[1]);
        });

        // Handle map click
        map.events.add('click', function (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
          const coords = e.get('coords');
          placemark.geometry.setCoordinates(coords);
          updateCoordinates(coords[0], coords[1]);
        });

        map.geoObjects.add(placemark);

        mapRef.current = map;
        placemarkRef.current = placemark;
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(t('map_load_error') || 'Xaritani yuklashda xatolik');
        setLoading(false);
      }
    };

    loadYandexMaps();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCoordinates = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    
    // Fetch address from coordinates
    setFetchingAddress(true);
    const fetchedAddress = await reverseGeocode(lat, lng, language);
    setFetchingAddress(false);
    
    if (fetchedAddress) {
      setAddress(fetchedAddress);
      onLocationChange(lat, lng, fetchedAddress);
    } else {
      setAddress(null);
      onLocationChange(lat, lng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('geolocation_not_supported') || 'Geolokatsiya qo\'llab-quvvatlanmaydi');
      return;
    }

    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update map and placemark
        if (mapRef.current && placemarkRef.current) {
          mapRef.current.setCenter([latitude, longitude], 15);
          placemarkRef.current.geometry.setCoordinates([latitude, longitude]);
        }
        
        updateCoordinates(latitude, longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(t('geolocation_error') || 'Joylashuvni aniqlab bo\'lmadi');
        setGettingLocation(false);
      }
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[400px] rounded-lg border-2 border-gray-300 overflow-hidden"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('loading_map') || 'Xarita yuklanmoqda...'}</p>
            </div>
          </div>
        )}
      </div>

      {/* GPS Button */}
      <Button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading || gettingLocation}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {gettingLocation ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('loading')}
          </>
        ) : (
          <>
            <Navigation className="mr-2 h-4 w-4" />
            {t('use_current_location')}
          </>
        )}
      </Button>

      {/* Address Loading State */}
      {fetchingAddress && (
        <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-2 border border-yellow-200">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
          <p className="text-sm text-yellow-700">
            {t('fetching_address') || 'Manzil aniqlanmoqda...'}
          </p>
        </div>
      )}

      {/* Address Display */}
      {address && !fetchingAddress && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            {t('address_label') || 'Manzil'}:
          </p>
          <p className="text-sm text-gray-900">{address}</p>
        </div>
      )}

      {/* Coordinates Display */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          {t('selected_coordinates')}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">{t('latitude')}:</span>
            <p className="font-mono font-semibold">{coordinates.lat.toFixed(6)}</p>
          </div>
          <div>
            <span className="text-gray-600">{t('longitude')}:</span>
            <p className="font-mono font-semibold">{coordinates.lng.toFixed(6)}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-sm mb-2 text-blue-900">
          {t('how_to_use')}
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {t('map_instruction_click')}</li>
          <li>• {t('map_instruction_drag')}</li>
          <li>• {t('map_instruction_gps')}</li>
        </ul>
      </div>
    </div>
  );
}
