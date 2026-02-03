'use client';

import { useState } from 'react';
import { YMaps, Map, Placemark, GeolocationControl } from 'react-yandex-maps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Locate } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface Coordinates {
  lat: number;
  lng: number;
}

interface StoreLocationPickerProps {
  onLocationSelect: (coords: Coordinates) => void;
  initialCoords?: Coordinates;
}

export default function StoreLocationPicker({ 
  onLocationSelect, 
  initialCoords 
}: StoreLocationPickerProps) {
  const { t } = useTranslation();
  
  // Default: Tashkent, Uzbekistan
  const [coordinates, setCoordinates] = useState<Coordinates>(
    initialCoords || { lat: 41.311081, lng: 69.240562 }
  );
  
  const [mapState, setMapState] = useState({
    center: [coordinates.lat, coordinates.lng],
    zoom: 12,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    const newCoords = { lat: coords[0], lng: coords[1] };
    setCoordinates(newCoords);
    onLocationSelect(newCoords);
  };

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoords);
          setMapState({
            center: [newCoords.lat, newCoords.lng],
            zoom: 15,
          });
          onLocationSelect(newCoords);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert(t('geolocation_error') || 'Joylashuvni aniqlab bo\'lmadi. Xaritadan tanlang.');
        }
      );
    } else {
      alert(t('geolocation_not_supported') || 'Brauzer joylashuvni qo\'llab-quvvatlamaydi.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          {t('store_location') || "Do'kon manzili"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {t('store_location_hint') || "Xaritada do'koningizning joylashuvini belgilang"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          className="w-full"
        >
          <Locate className="h-4 w-4 mr-2" />
          {t('get_current_location') || 'Joriy joylashuvimni ishlatish'}
        </Button>

        {/* Yandex Map */}
        <div className="rounded-lg overflow-hidden border-2 border-gray-200">
          <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY }}>
            <Map
              state={mapState}
              width="100%"
              height="400px"
              onClick={handleMapClick}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            >
              <Placemark
                geometry={[coordinates.lat, coordinates.lng]}
                options={{
                  preset: 'islands#redDotIcon',
                  draggable: true,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onDragEnd={(e: any) => {
                  const coords = e.get('target').geometry.getCoordinates();
                  const newCoords = { lat: coords[0], lng: coords[1] };
                  setCoordinates(newCoords);
                  onLocationSelect(newCoords);
                }}
              />
              <GeolocationControl options={{ float: 'right' }} />
            </Map>
          </YMaps>
        </div>

        {/* Coordinates Display */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {t('selected_coordinates') || 'Tanlangan koordinatalar:'}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{t('latitude') || 'Kenglik (Lat)'}:</span>
              <p className="font-mono font-bold text-blue-600">
                {coordinates.lat.toFixed(6)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">{t('longitude') || 'Uzunlik (Lng)'}:</span>
              <p className="font-mono font-bold text-blue-600">
                {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
          <p>💡 <strong>{t('how_to_use') || 'Qanday ishlatish:'}:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t('map_instructions') || 'Xaritani bosing yoki pinni suring'}</li>
            <li>&quot;{t('get_current_location') || 'Joriy joylashuvimni ishlatish'}&quot; {t('button_click') || 'tugmasini bosing'}</li>
            <li>{t('coordinates_auto_saved') || 'Koordinatalar avtomatik saqlanadi'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
