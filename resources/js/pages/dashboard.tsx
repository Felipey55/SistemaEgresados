import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bar, Pie } from 'react-chartjs-2';
import { Document, Page, View, Text, StyleSheet, PDFViewer, pdf } from '@react-pdf/renderer';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Location {
    id?: number;
    latitud: number;
    longitud: number;
    nombre?: string;
}

type DashboardProps = {
    totalEgresados: number;
    distribucionGenero: Record<string, number>;
    distribucionTipoIdentificacion: Record<string, number>;
    distribucionTipoEmpleo: Record<string, number>;
    distribucionModalidadTrabajo: Record<string, number>;
    empresasTop: Record<string, number>;
    distribucionFormacionAcademica: Array<{
        titulo: string;
        institucion: string;
        total: number;
    }>;
    habilidadesTop: Record<string, number>;
    egresadosPorAnio: Record<string, number>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Define color palette using standard hex values instead of oklch
const colorPalette = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#D946EF', '#F97316', '#14B8A6', '#8B5CF6', '#64748B'];

export default function Dashboard({
    totalEgresados,
    distribucionGenero,
    distribucionTipoIdentificacion,
    distribucionTipoEmpleo,
    distribucionModalidadTrabajo,
    empresasTop,
    distribucionFormacionAcademica,
    habilidadesTop,
    egresadosPorAnio
}: DashboardProps) {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            padding: 30
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#1e40af'
        },
        subtitle: {
            fontSize: 18,
            marginBottom: 5,
            color: '#1e40af'
        },
        text: {
            fontSize: 12,
            marginBottom: 5
        },
        table: {
            display: 'flex',
            width: 'auto',
            marginVertical: 10
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            borderBottomStyle: 'solid',
            minHeight: 30,
            alignItems: 'center'
        },
        tableHeader: {
            backgroundColor: '#f3f4f6'
        },
        tableCell: {
            flex: 1,
            padding: 5
        }
    });

    const DashboardPDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Dashboard de Egresados</Text>

                    <Text style={styles.subtitle}>Estadísticas Generales</Text>
                    <Text style={styles.text}>Total de Egresados: {totalEgresados}</Text>

                    <Text style={styles.subtitle}>Distribución por Género</Text>
                    {Object.entries(distribucionGenero).map(([genero, cantidad]) => (
                        <Text key={genero} style={styles.text}>{genero}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Tipo de Identificación</Text>
                    {Object.entries(distribucionTipoIdentificacion).map(([tipo, cantidad]) => (
                        <Text key={tipo} style={styles.text}>{tipo}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Tipo de Empleo</Text>
                    {Object.entries(distribucionTipoEmpleo).map(([tipo, cantidad]) => (
                        <Text key={tipo} style={styles.text}>{tipo}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Modalidad de Trabajo</Text>
                    {Object.entries(distribucionModalidadTrabajo).map(([modalidad, cantidad]) => (
                        <Text key={modalidad} style={styles.text}>{modalidad}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Top 10 Empresas Empleadoras</Text>
                    {Object.entries(empresasTop).map(([empresa, cantidad]) => (
                        <Text key={empresa} style={styles.text}>{empresa}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Formación Académica</Text>
                    <View style={styles.table}>
                        {distribucionFormacionAcademica.map((item, index) => (
                            <View key={index} style={[styles.tableRow, index === 0 ? styles.tableHeader : null]}>
                                <Text style={styles.tableCell}>{item.titulo}</Text>
                                <Text style={styles.tableCell}>{item.institucion}</Text>
                                <Text style={styles.tableCell}>{item.total}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.subtitle}>Top 10 Habilidades</Text>
                    {Object.entries(habilidadesTop).map(([habilidad, cantidad]) => (
                        <Text key={habilidad} style={styles.text}>{habilidad}: {cantidad}</Text>
                    ))}

                    <Text style={styles.subtitle}>Egresados por Año</Text>
                    {Object.entries(egresadosPorAnio).map(([anio, cantidad]) => (
                        <Text key={anio} style={styles.text}>{anio}: {cantidad}</Text>
                    ))}
                </View>
            </Page>
        </Document>
    );

    const exportToPdf = async () => {
        try {
            const blob = await pdf(<DashboardPDF />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reporte-dashboard.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor, intente nuevamente en unos momentos.');
        }
    };

    const MapaEgresados = () => {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    const cargarUbicaciones = async () => {
        try {
            const response = await axios.get('/api/obtener-ubicaciones');
            if (response.data && Array.isArray(response.data)) {
                setLocations(response.data);
                mostrarUbicaciones(response.data);
            }
        } catch (error) {
            setError('Error al cargar las ubicaciones');
        } finally {
            setCargando(false);
        }
    };

    const mostrarUbicaciones = (ubicaciones: Location[]) => {
        if (!mapRef.current) return;

        // Limpiar marcadores existentes
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Crear nuevos marcadores
        const bounds = L.latLngBounds([]);
        ubicaciones.forEach((ubicacion, index) => {
            const marker = L.marker([ubicacion.latitud, ubicacion.longitud])
                .addTo(mapRef.current!)
                .bindPopup(`Ubicación ${ubicacion.nombre || (index + 1)}`);
            
            markersRef.current.push(marker);
            bounds.extend([ubicacion.latitud, ubicacion.longitud]);
        });

        // Ajustar la vista para mostrar todos los marcadores
        if (ubicaciones.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    };

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Inicializar el mapa con una vista predeterminada de Colombia
            mapRef.current = L.map(mapContainerRef.current).setView([4.6097, -74.0817], 6);

            // Agregar el tile layer de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);

            // Cargar las ubicaciones
            cargarUbicaciones();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <div 
                ref={mapContainerRef} 
                style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
                className="shadow-md"
            />
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            {cargando && (
                <div className="text-center text-gray-600">
                    Cargando ubicaciones...
                </div>
            )}
        </div>
    );
};

return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6" id="dashboard-content">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={exportToPdf}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Descargar PDF
                    </button>
                </div>
                <Card className="col-span-full mb-6">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Distribución Geográfica de Egresados</h2>
                        <MapaEgresados />
                    </div>
                </Card>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-2">Total de Egresados</h3>
                        <p className="text-4xl font-bold text-blue-600">{totalEgresados}</p>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribución por Género</h3>
                        <div className="aspect-square">
                            <Pie
                                data={{
                                    labels: Object.keys(distribucionGenero),
                                    datasets: [{
                                        data: Object.values(distribucionGenero),
                                        backgroundColor: colorPalette.slice(0, Object.keys(distribucionGenero).length)
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Egresados por Año</h3>
                        <Bar
                            data={{
                                labels: Object.keys(egresadosPorAnio),
                                datasets: [{
                                    label: 'Egresados',
                                    data: Object.values(egresadosPorAnio),
                                    backgroundColor: colorPalette[0]
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    }
                                }
                            }}
                        />
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Tipo de Identificación</h3>
                        <Pie
                            data={{
                                labels: Object.keys(distribucionTipoIdentificacion),
                                datasets: [{
                                    data: Object.values(distribucionTipoIdentificacion),
                                    backgroundColor: colorPalette.slice(0, Object.keys(distribucionTipoIdentificacion).length)
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                        />
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Tipo de Empleo</h3>
                        <Pie
                            data={{
                                labels: Object.keys(distribucionTipoEmpleo),
                                datasets: [{
                                    data: Object.values(distribucionTipoEmpleo),
                                    backgroundColor: colorPalette.slice(0, Object.keys(distribucionTipoEmpleo).length)
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                        />
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Modalidad de Trabajo</h3>
                        <Pie
                            data={{
                                labels: Object.keys(distribucionModalidadTrabajo),
                                datasets: [{
                                    data: Object.values(distribucionModalidadTrabajo),
                                    backgroundColor: colorPalette.slice(0, Object.keys(distribucionModalidadTrabajo).length)
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                        />
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Top 10 Empresas Empleadoras</h3>
                        <Bar
                            data={{
                                labels: Object.keys(empresasTop),
                                datasets: [{
                                    label: 'Egresados',
                                    data: Object.values(empresasTop),
                                    backgroundColor: colorPalette[0]
                                }]
                            }}
                            options={{
                                responsive: true,
                                indexAxis: 'y',
                                plugins: {
                                    legend: { position: 'top' }
                                }
                            }}
                        />
                    </Card>
                </div>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Formación Académica por Institución</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {distribucionFormacionAcademica.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.titulo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.institucion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Top 10 Habilidades</h3>
                    <Bar
                        data={{
                            labels: Object.keys(habilidadesTop),
                            datasets: [{
                                label: 'Egresados',
                                data: Object.values(habilidadesTop),
                                backgroundColor: colorPalette[2]
                            }]
                        }}
                        options={{
                            responsive: true,
                            indexAxis: 'y',
                            plugins: {
                                legend: { position: 'top' }
                            }
                        }}
                    />
                </Card>
            </div>
        </AppLayout>

        //aqui los informes
        
    );
}
