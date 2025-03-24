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
        title: 'Registro de Egresados',
        href: '/regEgresados',
    },
];

type RegisterForm = {
    identificacion_tipo: 'C.C.' | 'C.E.';
    identificacion_numero: string;
    fotografia: File | null;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
};

export default function Dashboard() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        identificacion_tipo: 'C.C.',
        identificacion_numero: '',
        fotografia: null,
        celular: '',
        direccion: '',
        fecha_nacimiento: '',
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
        post(route('graduate.store'), {
            onSuccess: () => {
                showNotification('Registro exitoso', true);
                reset('fotografia');
                setTimeout(() => {
                    window.location.href = route('dashboard');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al registrarse como egresado. Verifique los datos.', false);
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registro Egresado" />
            <form className="flex flex-col gap-4 max-w-5xl mx-auto min-h-[calc(100vh-12rem)] justify-center" onSubmit={submit}>
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

                        <div className="grid gap-2">
                            <Label htmlFor="fotografia">Fotografía</Label>
                            <Input
                                id="fotografia"
                                type="file"
                                onChange={(e) => setData('fotografia', e.target.files ? e.target.files[0] : null)}
                                disabled={processing}
                            />
                            <InputError message={errors.fotografia} />
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
                <Button type="submit" className="mt-6 w-full max-w-md mx-auto" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Registrarse como Egresado
                </Button>
            </form>

        </AppLayout>
    );
}
