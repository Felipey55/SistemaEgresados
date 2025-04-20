import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Button 
                        variant="outline" 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-800"
                    >
                        <ArrowLeft size={16} />
                        Volver a la lista
                    </Button>
                </div>

                <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800 mb-6">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{egresado?.nombre}</h1>
                            <p className="text-gray-400">{egresado?.identificacion}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-800">
                        <dl>
                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Nombre completo</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{egresado?.nombre}</dd>
                            </div>
                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Identificación</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                    {egresado?.identificacion}
                                </dd>
                            </div>
                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Correo electrónico</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{egresado?.email}</dd>
                            </div>
                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Celular</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{egresado?.celular}</dd>
                            </div>
                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Dirección</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{egresado?.direccion}</dd>
                            </div>
                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-400">Fecha de nacimiento</dt>
                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                    {egresado?.fecha_nacimiento || 'No especificada'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Habilidades */}
                <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800 mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-white">Habilidades</h3>
                    </div>
                    <div className="border-t border-gray-800">
                        {(!egresado?.habilidades?.tecnicas || egresado?.habilidades?.tecnicas?.length === 0) && (!egresado?.habilidades?.blandas || egresado?.habilidades?.blandas?.length === 0) ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-400">No se han registrado habilidades.</p>
                            </div>
                        ) : (
                            <div className="p-6">
                                {egresado?.habilidades?.tecnicas?.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-300 mb-3">Habilidades Técnicas</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {egresado?.habilidades?.tecnicas?.map((habilidad, index) => (
                                                <Badge key={index} className="bg-green-600 text-white border-green-700">
                                                    {habilidad}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {egresado?.habilidades?.blandas?.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-medium text-gray-300 mb-3">Habilidades Blandas</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {egresado?.habilidades?.blandas?.map((habilidad, index) => (
                                                <Badge key={index} className="bg-blue-600 text-white border-blue-700">
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

                {/* Formación Académica */}
                <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800 mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-white">Formación Académica</h3>
                    </div>
                    <div className="border-t border-gray-800">
                        {egresado?.formacionAcademica?.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-400">No se ha registrado formación académica.</p>
                            </div>
                        ) : (
                            <div className={`grid ${egresado?.formacionAcademica?.length > 1 ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1'} p-4`}>
                                {egresado?.formacionAcademica?.map((formacion) => (
                                    <div key={formacion.id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
                                        <dl>
                                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Título</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{formacion.titulo}</dd>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Institución</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{formacion.institucion}</dd>
                                            </div>
                                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Tipo</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{formacion.tipo}</dd>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Fecha de realización</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                                    {formacion.fecha_realizacion ? formacion.fecha_realizacion : 'No especificada'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Experiencia Laboral */}
                <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-white">Experiencia Laboral</h3>
                    </div>
                    <div className="border-t border-gray-800">
                        {egresado?.experienciaLaboral?.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-gray-400">No se ha registrado experiencia laboral.</p>
                            </div>
                        ) : (
                            <div className={`grid ${egresado?.experienciaLaboral?.length > 1 ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1'} p-4`}>
                                {egresado?.experienciaLaboral?.map((experiencia) => (
                                    <div key={experiencia.id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
                                        <dl>
                                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Empresa</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.nombre_empresa}</dd>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Tipo de empleo</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.tipo_empleo}</dd>
                                            </div>
                                            <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Período</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                                    {new Date(experiencia.fecha_inicio).toLocaleDateString()} -
                                                    {experiencia.fecha_fin ? new Date(experiencia.fecha_fin).toLocaleDateString() : 'Actual'}
                                                </dd>
                                            </div>
                                            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-400">Modalidad</dt>
                                                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.modalidad_trabajo}</dd>
                                            </div>
                                            {experiencia.descripcion && (
                                                <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-400">Descripción</dt>
                                                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.descripcion}</dd>
                                                </div>
                                            )}
                                            {experiencia.servicios && (
                                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-400">Servicios</dt>
                                                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.servicios}</dd>
                                                </div>
                                            )}
                                            {experiencia.correo_empresa && (
                                                <div className="bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-400">Correo de la empresa</dt>
                                                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{experiencia.correo_empresa}</dd>
                                                </div>
                                            )}
                                            {experiencia.url_empresa && (
                                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-400">Sitio web</dt>
                                                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                                        <a href={experiencia.url_empresa} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                            {experiencia.url_empresa}
                                                        </a>
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}