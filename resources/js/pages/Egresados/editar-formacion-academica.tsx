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
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.backgroundColor = isSuccess ? 'green' : 'red';
        notification.style.color = 'white';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '1000';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
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
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                        <h1 className="text-2xl font-bold text-white mb-2">Editar Formación Académica</h1>
                        <p className="text-blue-100">Actualiza tu información académica</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_formacion" className="flex items-center gap-2 text-gray-700">
                                    <GraduationCap className="h-4 w-4 text-blue-500" />
                                    Tipo de Formación
                                </Label>
                                <select
                                    id="tipo_formacion"
                                    required
                                    value={data.tipo_formacion}
                                    onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="Pregrado">Pregrado</option>
                                    <option value="Especialización">Especialización</option>
                                    <option value="Maestría">Maestría</option>
                                    <option value="Doctorado">Doctorado</option>
                                </select>
                                <InputError message={errors.tipo_formacion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="titulo" className="flex items-center gap-2 text-gray-700">
                                    <Award className="h-4 w-4 text-blue-500" />
                                    Título Obtenido
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    required
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg"
                                    placeholder="Ej: Ingeniero en Sistemas"
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institucion" className="flex items-center gap-2 text-gray-700">
                                    <School className="h-4 w-4 text-blue-500" />
                                    Institución Educativa
                                </Label>
                                <Input
                                    id="institucion"
                                    type="text"
                                    required
                                    value={data.institucion}
                                    onChange={(e) => setData('institucion', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg"
                                    placeholder="Nombre de la institución"
                                />
                                <InputError message={errors.institucion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_realizacion" className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    Fecha de Realización
                                </Label>
                                <Input
                                    id="fecha_realizacion"
                                    type="date"
                                    required
                                    value={data.fecha_realizacion}
                                    onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                    disabled={processing}
                                    className="rounded-lg"
                                />
                                <InputError message={errors.fecha_realizacion} />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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