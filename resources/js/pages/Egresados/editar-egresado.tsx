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
        title: 'Editar Información Personal',
        href: '/Egresados/editar',
    },
];

type EditForm = {
    identificacion_tipo: 'C.C.' | 'C.E.';
    identificacion_numero: string;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
};

export default function EditarEgresado() {
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        identificacion_tipo: 'C.C.',
        identificacion_numero: '',
        celular: '',
        direccion: '',
        fecha_nacimiento: '',
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axios.get(route('api.egresado.datos'));
                const datos = response.data;
                // Format the date to YYYY-MM-DD before setting it in the form
                const fecha = datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento).toISOString().split('T')[0] : '';
                setData({
                    identificacion_tipo: datos.identificacion_tipo,
                    identificacion_numero: datos.identificacion_numero,
                    celular: datos.celular,
                    direccion: datos.direccion,
                    fecha_nacimiento: fecha,
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        cargarDatos();
    }, []);

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
        put(route('egresado.update'), {
            onSuccess: () => {
                showNotification('Información actualizada exitosamente', true);
                setTimeout(() => {
                    window.location.href = '/Egresados/perfil';
                }, 2000);
            },
            onError: () => {
                showNotification('Error al actualizar la información. Verifique los datos.', false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Información Personal" />
            <form className="flex flex-col gap-4 max-w-5xl mx-auto min-h-[calc(100vh-12rem)] justify-center" onSubmit={submit}>
                <h1 className="text-2xl font-semibold">Editar Información Personal</h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="identificacion_tipo">Tipo de Identificación</Label>
                            <select
                                id="identificacion_tipo"
                                required
                                value={data.identificacion_tipo}
                                onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                                disabled={processing}
                                className="bg-gray-800 text-white border-gray-600 rounded p-2 hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="C.C.">C.C.</option>
                                <option value="C.E.">C.E.</option>
                            </select>
                            <InputError message={errors.identificacion_tipo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="identificacion_numero">Número de Identificación</Label>
                            <Input
                                id="identificacion_numero"
                                type="text"
                                required
                                value={data.identificacion_numero}
                                onChange={(e) => setData('identificacion_numero', e.target.value)}
                                disabled={processing}
                                placeholder="Número de identificación"
                            />
                            <InputError message={errors.identificacion_numero} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="celular">Celular</Label>
                            <Input
                                id="celular"
                                type="text"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                disabled={processing}
                                placeholder="Número de celular"
                            />
                            <InputError message={errors.celular} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                type="text"
                                value={data.direccion}
                                onChange={(e) => setData('direccion', e.target.value)}
                                disabled={processing}
                                placeholder="Dirección"
                            />
                            <InputError message={errors.direccion} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                            <Input
                                id="fecha_nacimiento"
                                type="date"
                                required
                                value={data.fecha_nacimiento}
                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                disabled={processing}
                                className="appearance-none bg-transparent text-white [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <InputError message={errors.fecha_nacimiento} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full mt-6">
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