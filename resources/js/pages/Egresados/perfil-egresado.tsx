import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SimpleMapComponent from './SimpleMapComponent';

interface Location {
    latitude: number;
    longitude: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil del Egresado',
        href: '/Egresados/perfil',
    },
];

type DatosEgresado = {
    identificacion_tipo: string;
    identificacion_numero: string;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
    user: {
        name: string;
        email: string;
    };
};

type FormacionAcademica = {
    id: number;
    titulo: string;
    institucion: string;
    tipo: string;
    fecha_realizacion: string;
};

type ExperienciaLaboral = {
    tipo_empleo: string;
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    servicios: string | null;
    correo_empresa: string | null;
    url_empresa: string | null;
    modalidad_trabajo: string;
    descripcion: string | null;
};

type Habilidad = {
    id: number;
    nombre: string;
    tipo: string;
};

export default function PerfilEgresado() {
    const [datosEgresado, setDatosEgresado] = useState<DatosEgresado | null>(null);
    const [formacionAcademica, setFormacionAcademica] = useState<FormacionAcademica[]>([]);
    const [experienciaLaboral, setExperienciaLaboral] = useState<ExperienciaLaboral[]>([]);
    const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('informacion'); // Nueva variable para las pestañas

    useEffect(() => {
        const verificarRegistro = async () => {
            try {
                const response = await axios.get(route('api.egresado.verificar-registro'));
                const { egresadoRegistrado, datosEgresado: datos } = response.data;

                if (egresadoRegistrado) {
                    setIsRegistered(true);
                    if (datos) {
                        setDatosEgresado(datos);
                        setFormacionAcademica(datos.formacionAcademica || []);
                        setExperienciaLaboral(datos.experienciaLaboral || []);

                        // Obtener habilidades del egresado
                        try {
                            const habilidadesResponse = await axios.get(route('habilidades.obtener'));
                            setHabilidades(habilidadesResponse.data.habilidades || []);
                        } catch (habilidadesError) {
                            console.error('Error al obtener habilidades:', habilidadesError);
                            setHabilidades([]);
                        }
                    }
                } else {
                    setIsRegistered(false);
                }
            } catch (error) {
                console.error('Error al verificar registro:', error);
                console.error('Error al verificar el registro. Por favor, intente nuevamente más tarde.');
                setIsRegistered(false);
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        };

        verificarRegistro();
    }, []);

    if (loading || isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil del Egresado" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-100">
                {/* Encabezado del perfil */}
                <div 
                    className="text-white p-8 rounded-t-lg shadow-lg relative"
                    style={{
                        backgroundImage: 'url("/images/fondoDash.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                    }}
                >
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                            <img
                                src={datosEgresado?.foto_url || '/img/default-avatar.png'}
                                alt="Foto de perfil"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{datosEgresado?.user.name}</h1>
                            <p className="text-lg opacity-90">{formacionAcademica[0]?.titulo || 'Egresado'}</p>
                            <p className="text-sm opacity-75">{formacionAcademica[0]?.institucion}</p>
                        </div>
                    </div>
                </div>

                {/* Navegación por pestañas */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <nav className="flex justify-center space-x-8">
                        <button
                            onClick={() => setActiveTab('informacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out flex items-center space-x-2 group ${
                                activeTab === 'informacion' 
                                ? 'border-blue-600 text-blue-600 bg-blue-50 transform scale-105' 
                                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Información Personal</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('formacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out flex items-center space-x-2 group ${
                                activeTab === 'formacion' 
                                ? 'border-blue-600 text-blue-600 bg-blue-50 transform scale-105' 
                                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            </svg>
                            <span>Formación Académica</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('experiencia')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out flex items-center space-x-2 group ${
                                activeTab === 'experiencia' 
                                ? 'border-blue-600 text-blue-600 bg-blue-50 transform scale-105' 
                                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Experiencia Laboral</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('habilidades')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out flex items-center space-x-2 group ${
                                activeTab === 'habilidades' 
                                ? 'border-blue-600 text-blue-600 bg-blue-50 transform scale-105' 
                                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Habilidades</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ubicacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 transition-all duration-300 ease-in-out flex items-center space-x-2 group ${
                                activeTab === 'ubicacion' 
                                ? 'border-blue-600 text-blue-600 bg-blue-50 transform scale-105' 
                                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Ubicación</span>
                        </button>
                    </nav>
                </div>

{/*                 <div className="mt-6">
                    {!isRegistered && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">No estás registrado como egresado</h3>
                            <p className="text-gray-600 mb-4">Para ver tu información, primero debes registrarte como egresado.</p>
                            <div className="flex justify-center space-x-4">
                                <Link href={route('regEgresados')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Registrarse como Egresado
                                </Link>
                            </div>
                        </div>
                    )}
                </div> */}
                {!isRegistered ? (
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">No estás registrado como egresado</h3>
                        <p className="text-gray-600 mb-6">Para ver tu información, primero debes registrarte como egresado.</p>
                        <Link
                            href={route('regEgresados')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                        >
                            <svg 
                                className="w-5 h-5 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                            <span className="font-medium text-lg group-hover:text-purple-100">Registrarse como Egresado</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'ubicacion' && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Mi Ubicación</h3>
                                    </div>
                                    <SimpleMapComponent />
                                </div>
                            </div>
                        )}
                        {activeTab === 'informacion' && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Información Personal</h3>
                                        <Link
                                            href={route('regEgresados.edit')}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                                        >
                                            <svg 
                                                className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            <span className="font-medium group-hover:text-purple-100">Editar</span>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                                                <p className="mt-1 text-lg text-gray-900">{datosEgresado?.user.name}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Identificación</label>
                                                <p className="mt-1 text-lg text-gray-900">
                                                    {datosEgresado?.identificacion_tipo} - {datosEgresado?.identificacion_numero}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                                <p className="mt-1 text-lg text-gray-900">{datosEgresado?.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                                <p className="mt-1 text-lg text-gray-900">{datosEgresado?.celular}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                                <p className="mt-1 text-lg text-gray-900">{datosEgresado?.direccion}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                                                <p className="mt-1 text-lg text-gray-900">
                                                    {datosEgresado?.fecha_nacimiento ? new Date(datosEgresado.fecha_nacimiento).toLocaleDateString() : 'No especificada'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'formacion' && (

                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Formación Académica</h3>
                                        <Link
                                            href={route('formacion-academica')}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                                        >
                                            <svg className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="font-medium group-hover:text-purple-100">Agregar Nueva</span>
                                        </Link>
                                    </div>

                                    {formacionAcademica.length === 0 ? (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay formación académica</h3>
                                            <p className="mt-1 text-sm text-gray-500">Comienza agregando tu formación académica.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {formacionAcademica.map((formacion, index) => (
                                                <div key={formacion.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="text-lg font-medium text-gray-900">{formacion.titulo}</h4>
                                                            <p className="text-gray-600">{formacion.institucion}</p>
                                                        </div>
                                                        <Link
                                                            href={route('formacion-academica.edit', { id: formacion.id })}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Tipo</p>
                                                            <p className="text-gray-900">{formacion.tipo}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Fecha de realización</p>
                                                            <p className="text-gray-900">{formacion.fecha_realizacion || 'No especificada'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'experiencia' && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Experiencia Laboral</h3>
                                        <Link
                                            href={route('historial-laboral')}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                                        >
                                            <svg 
                                                className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="font-medium group-hover:text-purple-100">Agregar Nueva</span>
                                        </Link>
                                    </div>

                                    {experienciaLaboral.length === 0 ? (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay experiencia laboral</h3>
                                            <p className="mt-1 text-sm text-gray-500">Comienza agregando tu experiencia laboral.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {experienciaLaboral.map((experiencia, index) => (
                                                <div key={index} className="relative pb-8">
                                                    {index < experienciaLaboral.length - 1 && (
                                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                    )}
                                                    <div className="relative flex items-start space-x-3">
                                                        <div className="relative">
                                                            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-8 ring-white">
                                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="text-lg font-medium text-gray-900">{experiencia.nombre_empresa}</h4>
                                                                    <p className="text-gray-600">{experiencia.tipo_empleo}</p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {new Date(experiencia.fecha_inicio).toLocaleDateString()} -
                                                                        {experiencia.fecha_fin ? new Date(experiencia.fecha_fin).toLocaleDateString() : 'Actual'}
                                                                    </p>
                                                                </div>
                                                                <Link
                                                                    href={route('experiencia-laboral.edit', { id: experiencia.id })}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </Link>
                                                            </div>
                                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Modalidad</p>
                                                                    <p className="text-gray-900">{experiencia.modalidad_trabajo}</p>
                                                                </div>
                                                                {experiencia.descripcion && (
                                                                    <div className="col-span-2">
                                                                        <p className="text-sm text-gray-500">Descripción</p>
                                                                        <p className="text-gray-900">{experiencia.descripcion}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'habilidades' && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Habilidades</h3>
                                        {habilidades.length > 0 && (
                                            <Link
                                                href={route('habilidades.editar')}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                                            >
                                                <svg 
                                                    className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                <span className="font-medium group-hover:text-purple-100">Editar Habilidades</span>
                                            </Link>
                                        )}
                                    </div>

                                    {habilidades.length === 0 ? (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No has agregado habilidades</h3>
                                            <p className="mt-1 text-sm text-gray-500">Comienza agregando tus habilidades técnicas y blandas.</p>
                                            <div className="mt-6">
                                                <Link
                                                    href={route('habilidades.index')}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group"
                                                >
                                                    <svg 
                                                        className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12 group-hover:text-purple-200" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    <span className="font-medium group-hover:text-purple-100">Agregar Habilidades</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                                                <h4 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    Habilidades Técnicas
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {habilidades
                                                        .filter(habilidad => habilidad.tipo === 'tecnica')
                                                        .map(habilidad => (
                                                            <span
                                                                key={habilidad.id}
                                                                className="px-4 py-2 bg-white text-blue-800 rounded-full text-sm font-medium shadow-sm border border-blue-200 hover:shadow-md transition-shadow"
                                                            >
                                                                {habilidad.nombre}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                                                <h4 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Habilidades Blandas
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {habilidades
                                                        .filter(habilidad => habilidad.tipo === 'blanda')
                                                        .map(habilidad => (
                                                            <span
                                                                key={habilidad.id}
                                                                className="px-4 py-2 bg-white text-green-800 rounded-full text-sm font-medium shadow-sm border border-green-200 hover:shadow-md transition-shadow"
                                                            >
                                                                {habilidad.nombre}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
