import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Camera, MapPin, Phone, Calendar, User } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

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
    genero: string;
};

export default function Dashboard() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        identificacion_tipo: 'C.C.',
        identificacion_numero: '',
        fotografia: null,
        celular: '',
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
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
                window.location.href = route('historial-laboral');
            },
            onError: () => {
                showNotification('Error al registrarse como egresado. Verifique los datos.', false);
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registro Egresado" />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Card className="p-8 shadow-xl rounded-xl bg-white dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                    <form className="flex flex-col gap-8" onSubmit={submit}>
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">Registro como Egresado</h1>
                            <p className="text-gray-600 dark:text-gray-400">Complete el formulario para registrarse en nuestra plataforma</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="identificacion_tipo" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Tipo de Identificación</span>
                                </Label>
                                <select
                                    id="identificacion_tipo"
                                    required
                                    value={data.identificacion_tipo}
                                    onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                                    disabled={processing}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                                >
                                    <option value="C.C.">Cédula de Ciudadanía</option>
                                    <option value="C.E.">Cédula de Extranjería</option>
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
                                    className="px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-blue-500 shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                                />
                                <InputError message={errors.identificacion_numero} />
                            </div>

                            <div className="grid gap-4">
                                <Label htmlFor="fotografia" className="flex items-center gap-2 text-lg font-medium">
                                    <Camera className="h-5 w-5 text-blue-500" />
                                    <span>Fotografía</span>
                                </Label>
                                <div className="relative space-y-4">
                                    <div className="relative group cursor-pointer">
                                        <Input
                                            id="fotografia"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files ? e.target.files[0] : null;
                                                setData('fotografia', file);
                                            }}
                                            disabled={processing}
                                            className="hidden"
                                        />
                                        <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                            {!data.fotografia ? (
                                                <div className="text-center space-y-2">
                                                    <Camera className="h-10 w-10 mx-auto text-gray-400" />
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Haga clic para seleccionar una foto</p>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={URL.createObjectURL(data.fotografia)}
                                                        alt="Vista previa"
                                                        className="w-full h-full object-cover rounded-2xl"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                        <Camera className="h-10 w-10 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.fotografia} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="celular" className="flex items-center gap-2 text-lg font-medium">
                                        <Phone className="h-5 w-5 text-blue-500" />
                                        <span>Celular</span>
                                    </Label>
                                    <Input
                                        id="celular"
                                        type="text"
                                        value={data.celular}
                                        onChange={(e) => setData('celular', e.target.value)}
                                        disabled={processing}
                                        placeholder="Número de celular"
                                        className="px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-blue-500 shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                                    />
                                    <InputError message={errors.celular} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="direccion" className="flex items-center gap-2 text-lg font-medium">
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        <span>Dirección</span>
                                    </Label>
                                    <Input
                                        id="direccion"
                                        type="text"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        disabled={processing}
                                        placeholder="Dirección"
                                        className="px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-blue-500 shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                                    />
                                    <InputError message={errors.direccion} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="fecha_nacimiento" className="flex items-center gap-2 text-lg font-medium">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                        <span>Fecha de Nacimiento</span>
                                    </Label>
                                    <Input
                                        id="fecha_nacimiento"
                                        type="date"
                                        required
                                        value={data.fecha_nacimiento}
                                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                        disabled={processing}
                                        className="px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-blue-500 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                    <InputError message={errors.fecha_nacimiento} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="genero" className="flex items-center gap-2 text-lg font-medium">
                                        <User className="h-5 w-5 text-blue-500" />
                                        <span>Género</span>
                                    </Label>
                                    <select
                                        id="genero"
                                        required
                                        value={data.genero}
                                        onChange={(e) => setData('genero', e.target.value)}
                                        disabled={processing}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                                    >
                                        <option value="">Seleccione un género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="No Binario">No Binario</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <InputError message={errors.genero} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <LoaderCircle className="h-6 w-6 animate-spin" />
                                        <span className="text-lg">Procesando...</span>
                                    </div>
                                ) : (
                                    <span className="text-lg">Registrarse como Egresado</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

        </AppLayout>
    );
}