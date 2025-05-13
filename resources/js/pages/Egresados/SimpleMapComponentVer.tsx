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

    const mostrarUbicacion = (latitud: number, longitud: number) => {
        if (mapRef.current) {
            mapRef.current.setView([latitud, longitud], 15);

            if (markerRef.current) {
                markerRef.current.setLatLng([latitud, longitud]);
            } else {
                markerRef.current = L.marker([latitud, longitud])
                    .addTo(mapRef.current)
                    .bindPopup('Ubicación registrada')
                    .openPopup();
            }
        }
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
        const inicializarMapa = async () => {
            if (mapContainerRef.current && !mapRef.current) {
                // Inicializar el mapa con una vista predeterminada
                mapRef.current = L.map(mapContainerRef.current).setView([4.6097, -74.0817], 13);

                // Agregar el tile layer de OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapRef.current);

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
                            mostrarUbicacion(latitud, longitud);
                        } else {
                            setError('Datos de ubicación inválidos');
                        }
                    }
                } catch (error) {
                    setError('Error al cargar la ubicación');
                } finally {
                    setCargando(false);
                }
            }
        };

        inicializarMapa();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
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
{/*             <div className="flex justify-between items-center">
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
            </div> */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SimpleMapComponent;