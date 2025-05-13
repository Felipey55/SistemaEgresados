import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Calendar, Building2, Globe, Mail, MapPin, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial Laboral',
        href: '/Egresados/historial-laboral',
    },
    {
        title: 'Editar Experiencia',
        href: '#',
    },
];

type ExperienciaForm = {
    tipo_empleo: 'Tiempo Completo' | 'Medio Tiempo' | 'Freelance' | 'Otro';
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string;
    servicios: string;
    correo_empresa: string;
    url_empresa: string;
    modalidad_trabajo: 'Presencial' | 'Remoto' | 'Híbrido';
    descripcion: string;
};

type Props = {
    experiencia: ExperienciaForm;
};

export default function ExperienciaLaboralEdit({ experiencia }: Props) {
    const formatDate = (isoDate: string) => {
        if (!isoDate) return '';
        return new Date(isoDate).toISOString().split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm<ExperienciaForm>({
        tipo_empleo: experiencia.tipo_empleo,
        nombre_empresa: experiencia.nombre_empresa,
        fecha_inicio: formatDate(experiencia.fecha_inicio),
        fecha_fin: formatDate(experiencia.fecha_fin),
        servicios: experiencia.servicios || '',
        correo_empresa: experiencia.correo_empresa || '',
        url_empresa: experiencia.url_empresa || '',
        modalidad_trabajo: experiencia.modalidad_trabajo,
        descripcion: experiencia.descripcion || ''
    });

    const showNotification = (message: string, isSuccess: boolean) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const experienciaId = (experiencia as ExperienciaForm & { id: number }).id;
        if (!experienciaId) {
            showNotification('Error: ID de experiencia no encontrado', false);
            return;
        }
        put(route('experiencia.update', { id: experienciaId }), {
            onSuccess: () => {
                showNotification('Experiencia laboral actualizada exitosamente', true);
                setTimeout(() => {
                    window.location.href = route('egresado.perfil');
                }, 2000);
            },
            onError: (errors) => {
                if (errors.errors) {
                    const firstError = Object.values(errors.errors)[0];
                    showNotification(Array.isArray(firstError) ? firstError[0] : 'Error al actualizar la experiencia laboral', false);
                } else {
                    showNotification('Error al actualizar la experiencia laboral. Verifique los datos.', false);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Experiencia Laboral" />
            <div className="max-w-[90rem] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
                        <h1 className="text-2xl font-bold text-white mb-2">Editar Experiencia Laboral</h1>
                        <p className="text-blue-100 dark:text-blue-200">Actualiza los detalles de tu experiencia profesional</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_empleo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Briefcase className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Tipo de Empleo
                                </Label>
                                <select
                                    id="tipo_empleo"
                                    value={data.tipo_empleo}
                                    onChange={(e) => setData('tipo_empleo', e.target.value as ExperienciaForm['tipo_empleo'])}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                    disabled={processing}
                                    required
                                >
                                    <option value="Tiempo Completo">Tiempo Completo</option>
                                    <option value="Medio Tiempo">Medio Tiempo</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <InputError message={errors.tipo_empleo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nombre_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Building2 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Nombre de la Empresa
                                </Label>
                                <Input
                                    id="nombre_empresa"
                                    type="text"
                                    value={data.nombre_empresa}
                                    onChange={(e) => setData('nombre_empresa', e.target.value)}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    disabled={processing}
                                    required
                                />
                                <InputError message={errors.nombre_empresa} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_inicio" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Fecha de Inicio
                                </Label>
                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    disabled={processing}
                                    required
                                />
                                <InputError message={errors.fecha_inicio} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_fin" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Fecha de Finalización
                                </Label>
                                <Input
                                    id="fecha_fin"
                                    type="date"
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    disabled={processing}
                                />
                                <InputError message={errors.fecha_fin} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modalidad_trabajo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Modalidad de Trabajo
                                </Label>
                                <select
                                    id="modalidad_trabajo"
                                    value={data.modalidad_trabajo}
                                    onChange={(e) => setData('modalidad_trabajo', e.target.value as ExperienciaForm['modalidad_trabajo'])}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                    disabled={processing}
                                    required
                                >
                                    <option value="Presencial">Presencial</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Híbrido">Híbrido</option>
                                </select>
                                <InputError message={errors.modalidad_trabajo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="correo_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Correo de la Empresa
                                </Label>
                                <Input
                                    id="correo_empresa"
                                    type="email"
                                    value={data.correo_empresa}
                                    onChange={(e) => setData('correo_empresa', e.target.value)}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    disabled={processing}
                                    placeholder="correo@empresa.com"
                                />
                                <InputError message={errors.correo_empresa} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Globe className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Sitio Web de la Empresa
                                </Label>
                                <Input
                                    id="url_empresa"
                                    type="url"
                                    value={data.url_empresa}
                                    onChange={(e) => setData('url_empresa', e.target.value)}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    disabled={processing}
                                    placeholder="https://"
                                />
                                <InputError message={errors.url_empresa} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="servicios" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                Servicios/Productos de la Empresa
                            </Label>
                            <Textarea
                                id="servicios"
                                value={data.servicios}
                                onChange={(e) => setData('servicios', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                disabled={processing}
                                rows={3}
                            />
                            <InputError message={errors.servicios} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                Descripción de Actividades
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                disabled={processing}
                                rows={4}
                                required
                            />
                            <InputError message={errors.descripcion} />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-800 dark:hover:from-blue-800 dark:hover:to-indigo-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}