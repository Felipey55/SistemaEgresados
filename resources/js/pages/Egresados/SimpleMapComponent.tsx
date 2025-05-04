import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

interface Location {
    latitude: number;
    longitude: number;
}

const SimpleMapComponent = () => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string>('');
    const [location, setLocation] = useState<Location | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [ubicacionExistente, setUbicacionExistente] = useState<boolean>(false);
    const [cargando, setCargando] = useState<boolean>(true);

    const actualizarUbicacion = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            } else {
                markerRef.current = L.marker([latitude, longitude], { draggable: true })
                    .addTo(mapRef.current)
                    .bindPopup('Arrastra el marcador para ajustar la ubicación')
                    .openPopup();

                markerRef.current.on('dragend', () => {
                    const newPos = markerRef.current?.getLatLng();
                    if (newPos) {
                        setLocation({
                            latitude: newPos.lat,
                            longitude: newPos.lng
                        });
                    }
                });
            }
        }
    };

    const manejarErrorUbicacion = (error: GeolocationPositionError) => {
        let mensajeError = '';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                mensajeError = 'Usuario denegó el acceso a la ubicación.';
                break;
            case error.POSITION_UNAVAILABLE:
                mensajeError = 'Información de ubicación no disponible.';
                break;
            case error.TIMEOUT:
                mensajeError = 'Tiempo de espera agotado para obtener la ubicación.';
                break;
            default:
                mensajeError = 'Error desconocido al obtener la ubicación.';
        }
        setError(mensajeError);
    };

    const verificarUbicacionExistente = async () => {
        try {
            const response = await axios.get('/api/verificar-ubicacion');
            if (response.data.existe) {
                setUbicacionExistente(true);
                const latitud = parseFloat(response.data.ubicacion.latitud);
                const longitud = parseFloat(response.data.ubicacion.longitud);
                if (!isNaN(latitud) && !isNaN(longitud)) {
                    setLocation({
                        latitude: latitud,
                        longitude: longitud
                    });
                } else {
                    setError('Datos de ubicación inválidos');
                }
            }
        } catch (error) {
            setError('Error al verificar la ubicación existente');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        verificarUbicacionExistente();
        if (mapContainerRef.current && !mapRef.current) {
            // Inicializar el mapa con una vista predeterminada
            mapRef.current = L.map(mapContainerRef.current).setView([4.6097, -74.0817], 13);

            // Agregar el tile layer de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);

            // Solicitar la ubicación del usuario
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    actualizarUbicacion,
                    manejarErrorUbicacion,
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );

                // Configurar seguimiento en tiempo real
                const watchId = navigator.geolocation.watchPosition(
                    actualizarUbicacion,
                    manejarErrorUbicacion,
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );

                // Limpiar el seguimiento cuando el componente se desmonte
                return () => {
                    navigator.geolocation.clearWatch(watchId);
                    if (mapRef.current) {
                        mapRef.current.remove();
                        mapRef.current = null;
                    }
                };
            } else {
                setError('Tu navegador no soporta geolocalización.');
            }
        }
    }, []);

    const guardarUbicacion = async () => {
        if (!location) return;
        
        setIsSaving(true);
        try {
            if (ubicacionExistente) {
                await axios.put('/api/actualizar-ubicacion', {
                    latitud: location.latitude,
                    longitud: location.longitude
                });
            } else {
                await axios.post('/api/guardar-ubicacion', location);
                setUbicacionExistente(true);
            }
            setError('');
        } catch (err) {
            setError('Error al guardar la ubicación. Por favor, intente nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div 
                ref={mapContainerRef} 
                style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
                className="shadow-md"
            />
            <div className="flex justify-between items-center">
                <button
                    onClick={guardarUbicacion}
                    disabled={!location || isSaving}
                    className={`px-4 py-2 rounded-md text-white ${!location || isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isSaving ? 'Guardando...' : ubicacionExistente ? 'Actualizar Ubicación' : 'Guardar Ubicación'}
                </button>
                {location && (
                    <div className="text-sm text-gray-600">
                        Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </div>
                )}
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SimpleMapComponent;