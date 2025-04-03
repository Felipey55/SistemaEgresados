import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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

export default function EditarFormacion() {
    const { data, setData, put, processing, errors } = useForm<FormacionForm>({
        titulo: '',
        institucion: '',
        tipo_formacion: 'Pregrado',
        fecha_realizacion: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axios.get(route('api.formacion.datos'));
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
        put(route('formacion.update'), {
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
            <form className="flex flex-col gap-4 max-w-5xl mx-auto min-h-[calc(100vh-12rem)] items-center justify-center" onSubmit={submit}>
                <h1 className="text-2xl font-semibold text-center w-full">Editar Formación Académica</h1>
                <div className="grid grid-cols-1 gap-10 w-full max-w-2xl">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tipo_formacion">Tipo de Formación</Label>
                            <select
                                id="tipo_formacion"
                                required
                                value={data.tipo_formacion}
                                onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                disabled={processing}
                                className="bg-gray-800 text-white border-gray-600 rounded p-2 hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="Pregrado">Pregrado</option>
                                <option value="Especialización">Especialización</option>
                                <option value="Maestría">Maestría</option>
                                <option value="Doctorado">Doctorado</option>
                            </select>
                            <InputError message={errors.tipo_formacion} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="titulo">Título Obtenido</Label>
                            <Input
                                id="titulo"
                                type="text"
                                required
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                disabled={processing}
                                placeholder="Título obtenido"
                            />
                            <InputError message={errors.titulo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="institucion">Institución Educativa</Label>
                            <Input
                                id="institucion"
                                type="text"
                                required
                                value={data.institucion}
                                onChange={(e) => setData('institucion', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre de la institución"
                            />
                            <InputError message={errors.institucion} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha_realizacion">Fecha de Realización</Label>
                            <Input
                                id="fecha_realizacion"
                                type="date"
                                required
                                value={data.fecha_realizacion}
                                onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                disabled={processing}
                                className="appearance-none bg-transparent text-white [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <InputError message={errors.fecha_realizacion} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full mt-6 max-w-2xl">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-[150px]"
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="w-[150px]" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}