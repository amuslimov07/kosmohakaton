import { useEffect, useRef, useState } from "react";
import { mapMarkers } from "./markers";

const YANDEX_MAPS_URL = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";

let yandexMapsPromise;
const noop = () => {};

function loadYandexMaps() {
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (yandexMapsPromise) return yandexMapsPromise;

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
  const scriptUrl = apiKey
    ? `${YANDEX_MAPS_URL}&apikey=${apiKey}`
    : YANDEX_MAPS_URL;

  yandexMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src^="${YANDEX_MAPS_URL}"]`,
    );
    if (existingScript) {
      existingScript.addEventListener("load", () =>
        window.ymaps.ready(() => resolve(window.ymaps)),
      );
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return yandexMapsPromise;
}

export default function SatelliteMap({ onMarkerSelect = noop }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadYandexMaps()
      .then((ymaps) => {
        if (!isMounted || !mapNodeRef.current || mapRef.current) return;

        const map = new ymaps.Map(mapNodeRef.current, {
          center: [55.751244, 37.618423],
          zoom: 3,
          controls: ["zoomControl", "fullscreenControl"],
        });

        mapMarkers.forEach((marker) => {
          const placemark = new ymaps.Placemark(
            marker.coordinates,
            {
              balloonContentHeader: marker.title,
              balloonContentBody: `<p>${marker.description}</p><p><strong>Тип:</strong> ${marker.type}</p><p><strong>Спутниковый анализ:</strong> ${marker.analysis}</p>`,
              hintContent: marker.title,
            },
            {
              preset: "islands#greenDotIcon",
            },
          );

          placemark.events.add("click", () => onMarkerSelect(marker));
          map.geoObjects.add(placemark);
        });

        mapRef.current = map;
      })
      .catch(() => {
        if (isMounted) setMapError(true);
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [onMarkerSelect]);

  return (
    <div className="satellite-map-shell">
      <div
        ref={mapNodeRef}
        className="real-map"
        aria-label="Карта объектов спутникового анализа"
      />
      {mapError && (
        <div className="map-error">
          Не удалось загрузить Яндекс Карты. Проверьте API-ключ в
          `frontend/.env`.
        </div>
      )}
      <span className="map-source">
        Яндекс Карты · демонстрационные объекты
      </span>
    </div>
  );
}
