import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-end space-x-4 mb-6">
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
                </div>
                {!isRegistered ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">No estás registrado como egresado</h3>
                        <p className="text-gray-600">Para ver tu información, primero debes registrarte como egresado.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid para Información Personal y Habilidades */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Información Personal */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Información Personal</h3>
                                    <div className="flex space-x-2">
                                        {habilidades.length === 0 && (
                                            <Link href={route('habilidades.index')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                                Agrega tus Habilidades
                                            </Link>
                                        )}
                                        <Link href={route('regEgresados.edit')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{datosEgresado?.user.name}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Identificación</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {datosEgresado?.identificacion_tipo} - {datosEgresado?.identificacion_numero}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{datosEgresado?.user.email}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Celular</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{datosEgresado?.celular}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{datosEgresado?.direccion}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Habilidades */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Habilidades</h3>
                                    {habilidades.length > 0 && (
                                        <div className="flex gap-2">
                                            <Link href={route('habilidades.editar')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                                Editar Habilidades
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-200">
                                    {habilidades.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <p className="text-gray-500">No has agregado habilidades aún.</p>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <div className="mb-6">
                                                <h4 className="text-md font-medium text-gray-700 mb-3">Habilidades Técnicas</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {habilidades
                                                        .filter(habilidad => habilidad.tipo === 'tecnica')
                                                        .map(habilidad => (
                                                            <span key={habilidad.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                                {habilidad.nombre}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-md font-medium text-gray-700 mb-3">Habilidades Blandas</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {habilidades
                                                        .filter(habilidad => habilidad.tipo === 'blanda')
                                                        .map(habilidad => (
                                                            <span key={habilidad.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                                {habilidad.nombre}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Formación Académica */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Formación Académica</h3>
                                <div className="flex gap-2">
                                    <Link href={route('formacion-academica')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                        Agregar Nueva
                                    </Link>

                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className={`grid ${formacionAcademica.length > 1 ? 'grid-cols-2 gap-4' : 'grid-cols-1'} p-4`}>
                                {formacionAcademica.map((formacion, index) => (
                                    <div key={formacion.id} className="border rounded-lg overflow-hidden">
                                        <div className="flex justify-end p-2">
                                            <Link href={route('formacion-academica.edit', { id: formacion.id })} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                                                Editar
                                            </Link>
                                        </div>
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Título</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formacion.titulo}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Institución</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formacion.institucion}</dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formacion.tipo}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Fecha de realización</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formacion.fecha_realizacion ? formacion.fecha_realizacion : 'No especificada'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                        
                        {/* Experiencia Laboral */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Experiencia Laboral</h3>
                        <div className="flex gap-2">
                            <Link href={route('historial-laboral')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                Agregar Nueva
                            </Link>

                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className={`grid ${experienciaLaboral.length > 1 ? 'grid-cols-2 gap-4' : 'grid-cols-1'} p-4`}>
                        {experienciaLaboral.map((experiencia, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                                <div className="flex justify-end p-2">
                                    <Link href={route('experiencia-laboral.edit', { id: experiencia.id })} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                                        Editar
                                    </Link>
                                </div>
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Empresa</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{experiencia.nombre_empresa}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Tipo de empleo</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{experiencia.tipo_empleo}</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Período</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {new Date(experiencia.fecha_inicio).toLocaleDateString()} -
                                            {experiencia.fecha_fin ? new Date(experiencia.fecha_fin).toLocaleDateString() : 'Actual'}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Modalidad</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{experiencia.modalidad_trabajo}</dd>
                                    </div>
                                    {experiencia.descripcion && (
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{experiencia.descripcion}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
            </div >
        </AppLayout >
    );
}
