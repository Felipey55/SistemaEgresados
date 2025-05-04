import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Calendar, Building2, Mail, MapPin, User, Phone, Home, Calendar as CalendarIcon, Code2, Heart, Globe, Map } from 'lucide-react';
import SimpleMapComponent from './SimpleMapComponentVer';

type Props = {
    egresado: {
        id: number;
        nombre: string;
        identificacion: string;
        email: string;
        celular: string;
        direccion: string;
        fecha_nacimiento: string;
        formacionAcademica: any[];
        experienciaLaboral: any[];
        habilidades: {
            tecnicas: any[];
            blandas: any[];
        };
    };
};

type DatosEgresado = {
    id: number;
    identificacion_tipo: string;
    identificacion_numero: string;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
    foto_url: string | null;
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
    id: number;
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

export default function DetalleEgresado({ egresado }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('informacion');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Perfiles Egresados',
            href: '/PerfilesEgresados',
        },
        {
            title: egresado?.nombre || 'Detalle de Egresado',
            href: `/Egresados/detalle/${egresado?.id}`,
        },
    ];

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Perfil de ${egresado?.nombre || 'Egresado'}`} />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-100">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                    >
                        <ArrowLeft size={16} />
                        Volver a la lista
                    </Button>
                </div>

                {/* Navegación por pestañas */}
                <div className="bg-white border-b border-gray-200 shadow-sm mb-6 rounded-lg overflow-hidden">
                    <nav className="flex justify-center space-x-8">
                        <button
                            onClick={() => setActiveTab('informacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 ${activeTab === 'informacion' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Información Personal
                        </button>
                        <button
                            onClick={() => setActiveTab('habilidades')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 ${activeTab === 'habilidades' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Habilidades
                        </button>
                        <button
                            onClick={() => setActiveTab('formacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 ${activeTab === 'formacion' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Formación Académica
                        </button>
                        <button
                            onClick={() => setActiveTab('experiencia')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 ${activeTab === 'experiencia' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Experiencia Laboral
                        </button>
                        <button
                            onClick={() => setActiveTab('ubicacion')}
                            className={`px-4 py-4 font-medium text-sm border-b-2 ${activeTab === 'ubicacion' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Ubicación
                        </button>
                    </nav>
                </div>

                {/* Contenido según la pestaña activa */}
                {activeTab === 'informacion' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                                    <img
                                        src="/img/default-avatar.png"
                                        alt="Foto de perfil"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{egresado?.nombre}</h1>
                                    <p className="text-lg opacity-90">{egresado?.identificacion}</p>
                                    <p className="text-sm opacity-75">{egresado?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <User className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nombre completo</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.nombre}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Identificación</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.identificacion}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Correo electrónico</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Celular</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.celular}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Home className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Dirección</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.direccion}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                                        <p className="text-base font-medium text-gray-900">{egresado?.fecha_nacimiento || 'No especificada'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'habilidades' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Habilidades</h3>
                        </div>
                        <div className="px-6 pb-6">
                            {(!egresado?.habilidades?.tecnicas || egresado?.habilidades?.tecnicas?.length === 0) && (!egresado?.habilidades?.blandas || egresado?.habilidades?.blandas?.length === 0) ? (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No se han registrado habilidades.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {egresado?.habilidades?.tecnicas?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                                <Code2 className="h-5 w-5 text-emerald-600" />
                                                Habilidades Técnicas
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {egresado?.habilidades?.tecnicas?.map((habilidad, index) => (
                                                    <Badge key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {egresado?.habilidades?.blandas?.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                                <Heart className="h-5 w-5 text-red-600" />
                                                Habilidades Blandas
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {egresado?.habilidades?.blandas?.map((habilidad, index) => (
                                                    <Badge key={index} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'formacion' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Formación Académica
                            </h3>
                        </div>
                        <div className="p-6">
                            {egresado?.formacionAcademica?.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-gray-500">No se ha registrado formación académica.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {egresado?.formacionAcademica?.map((formacion) => (
                                        <div key={formacion.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col gap-3">
                                                <h4 className="text-lg font-semibold text-gray-900">{formacion.titulo}</h4>
                                                <p className="text-gray-600 flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-gray-400" />
                                                    {formacion.institucion}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                                                        {formacion.tipo}
                                                    </Badge>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formacion.fecha_realizacion || 'No especificada'}
                                                    </span>
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
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                Experiencia Laboral
                            </h3>
                        </div>
                        <div className="p-6">
                            {egresado?.experienciaLaboral?.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-gray-500">No se ha registrado experiencia laboral.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {egresado?.experienciaLaboral?.map((experiencia) => (
                                        <div key={experiencia.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900">{experiencia.nombre_empresa}</h4>
                                                        <p className="text-gray-600 mt-1">{experiencia.tipo_empleo}</p>
                                                    </div>
                                                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                                                        {experiencia.modalidad_trabajo}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(experiencia.fecha_inicio).toLocaleDateString()} -
                                                        {experiencia.fecha_fin ? new Date(experiencia.fecha_fin).toLocaleDateString() : 'Actual'}
                                                    </span>
                                                </div>

                                                {experiencia.descripcion && (
                                                    <p className="text-gray-600 bg-white rounded-lg p-4 border border-gray-100">
                                                        {experiencia.descripcion}
                                                    </p>
                                                )}

                                                {experiencia.servicios && (
                                                    <div className="text-gray-600 bg-white rounded-lg p-4 border border-gray-100">
                                                        <h5 className="font-medium mb-2">Servicios</h5>
                                                        <p>{experiencia.servicios}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    {experiencia.correo_empresa && (
                                                        <a href={`mailto:${experiencia.correo_empresa}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                                            <Mail className="h-4 w-4" />
                                                            {experiencia.correo_empresa}
                                                        </a>
                                                    )}
                                                    {experiencia.url_empresa && (
                                                        <a href={experiencia.url_empresa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                                            <Globe className="h-4 w-4" />
                                                            Sitio web
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'ubicacion' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Map className="h-5 w-5 text-blue-600" />
                                Ubicación
                            </h3>
                        </div>
                        <div className="p-6">
                            <SimpleMapComponent />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}