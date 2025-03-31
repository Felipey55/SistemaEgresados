import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Formación Académica',
        href: '/Egresados/formacion-academica',
    },
];

type FormacionForm = {
    titulo: string;
    institucion: string;
    tipo_formacion: 'Pregrado' | 'Especialización' | 'Maestría' | 'Doctorado';
    fecha_realizacion: string;
};

export default function FormacionAcademica() {
    const { data, setData, post, processing, errors, reset } = useForm<FormacionForm>({
        titulo: '',
        institucion: '',
        tipo_formacion: 'Pregrado',
        fecha_realizacion: ''
    });

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
        post(route('formacion.store'), {
            onSuccess: () => {
                showNotification('Formación académica registrada exitosamente', true);
                reset();
                setTimeout(() => {
                    window.location.href = route('noticias.index');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al registrar la formación académica. Verifique los datos.', false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formación Académica" />
            <form className="flex flex-col gap-4 max-w-5xl mx-auto min-h-[calc(100vh-12rem)] items-center justify-center" onSubmit={submit}>
                <h1 className="text-2xl font-semibold text-center w-full">Registro de Formación Académica</h1>
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

                <div className="flex justify-center w-full mt-6">
                    <Button type="submit" className="w-full max-w-md" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Registrar Formación Académica
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}