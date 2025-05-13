import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, BookOpen, Calendar, GraduationCap, School, Award } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Formación Académica',
        href: '/Egresados/editar-formacion',
    },
];

type FormacionForm = {
    titulo: string;
    institucion: string;
    tipo_formacion: 'Pregrado' | 'Especialización' | 'Maestría' | 'Doctorado';
    fecha_realizacion: string;
};

type Props = {
    id: number;
};

export default function EditarFormacion({ id }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormacionForm>({
        titulo: '',
        institucion: '',
        tipo_formacion: 'Pregrado',
        fecha_realizacion: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axios.get(route('api.formacion.datos', { id }));
                const datos = response.data;
                setData({
                    titulo: datos.titulo,
                    institucion: datos.institucion,
                    tipo_formacion: datos.tipo_formacion,
                    fecha_realizacion: datos.fecha_realizacion,
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        cargarDatos();
    }, [setData]);

    const showNotification = (message: string, isSuccess: boolean) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'} text-white`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('formacion.update', { id }), {
            onSuccess: () => {
                showNotification('Información actualizada correctamente', true);
                setTimeout(() => {
                    window.location.href = route('egresado.perfil');
                }, 2000);
            },
            onError: (errors) => {
                if (errors.errors) {
                    Object.keys(errors.errors).forEach(key => {
                        const errorMessages = errors.errors[key as keyof typeof errors.errors];
                        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                            showNotification(errorMessages[0], false);
                        }
                    });
                } else {
                    showNotification('Error al actualizar la formación académica', false);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Formación Académica" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
                        <h1 className="text-2xl font-bold text-white mb-2">Editar Formación Académica</h1>
                        <p className="text-blue-100 dark:text-blue-200">Actualiza tu información académica</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_formacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <GraduationCap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Tipo de Formación
                                </Label>
                                <select
                                    id="tipo_formacion"
                                    required
                                    value={data.tipo_formacion}
                                    onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                >
                                    <option value="Pregrado">Pregrado</option>
                                    <option value="Especialización">Especialización</option>
                                    <option value="Maestría">Maestría</option>
                                    <option value="Doctorado">Doctorado</option>
                                </select>
                                <InputError message={errors.tipo_formacion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="titulo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Award className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Título Obtenido
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    required
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Ej: Ingeniero en Sistemas"
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institucion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <School className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Institución Educativa
                                </Label>
                                <Input
                                    id="institucion"
                                    type="text"
                                    required
                                    value={data.institucion}
                                    onChange={(e) => setData('institucion', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Nombre de la institución"
                                />
                                <InputError message={errors.institucion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_realizacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Fecha de Realización
                                </Label>
                                <Input
                                    id="fecha_realizacion"
                                    type="date"
                                    required
                                    value={data.fecha_realizacion}
                                    onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 [&::-webkit-calendar-picker-indicator]:dark:invert"
                                />
                                <InputError message={errors.fecha_realizacion} />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
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