import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Users, CreditCard, Phone, MapPin, Calendar, UserCircle2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
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
    fotografia: File | null;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
    genero: string;
};

export default function EditarEgresado() {
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    // Función para activar la animación del icono
    const animateIcon = (iconId: string) => {
        setActiveIcon(iconId);
        setTimeout(() => setActiveIcon(null), 2000);
    };

    // Función para obtener la clase de animación según el icono
    const getAnimationClass = (iconId: string) => {
        if (activeIcon !== iconId) return '';
        return 'animate-bounce duration-1000';
    };

    const { data, setData, put, processing, errors } = useForm<EditForm>({
        identificacion_tipo: 'C.C.',
        identificacion_numero: '',
        fotografia: null,
        celular: '',
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await axios.get(route('api.egresado.datos'));
                const datos = response.data;
                const fecha = datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento).toISOString().split('T')[0] : '';
                setData({
                    identificacion_tipo: datos.identificacion_tipo,
                    identificacion_numero: datos.identificacion_numero,
                    fotografia: null,
                    celular: datos.celular,
                    direccion: datos.direccion,
                    fecha_nacimiento: fecha,
                    genero: datos.genero || '',
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
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'} text-white`;

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
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div 
                        className="p-6 sm:p-8 relative overflow-hidden"
                        style={{
                            backgroundImage: 'url(/images/fondoDash.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold text-white mb-2 text-shadow hover:scale-105 transition-transform duration-300">Editar Información Personal</h1>
                            <p className="text-white text-shadow hover:scale-105 transition-transform duration-300">Actualiza tus datos personales</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="identificacion_tipo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <CreditCard 
                                            id="credit-card-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('credit-card-icon')}`} 
                                        />
                                    Tipo de Identificación
                                </Label>
                                <select
                                    id="identificacion_tipo"
                                    required
                                    value={data.identificacion_tipo}
                                    onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                                    onFocus={() => animateIcon('credit-card-icon')}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                >
                                    <option value="C.C.">C.C.</option>
                                    <option value="C.E.">C.E.</option>
                                </select>
                                <InputError message={errors.identificacion_tipo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="identificacion_numero" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <UserCircle2 
                                            id="user-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('user-icon')}`} 
                                        />
                                    Número de Identificación
                                </Label>
                                <Input
                                    id="identificacion_numero"
                                    type="text"
                                    required
                                    value={data.identificacion_numero}
                                    onChange={(e) => setData('identificacion_numero', e.target.value)}
                                    onFocus={() => animateIcon('user-icon')}
                                    disabled={processing}
                                    placeholder="Número de identificación"
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <InputError message={errors.identificacion_numero} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fotografia" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Users 
                                            id="photo-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('photo-icon')}`} 
                                        />
                                    Fotografía
                                </Label>
                                <Input
                                    id="fotografia"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData('fotografia', file);
                                    }}
                                    onFocus={() => animateIcon('photo-icon')}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                                />
                                {data.fotografia && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-center">
                                            <img
                                                src={URL.createObjectURL(data.fotografia)}
                                                alt="Vista previa"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                                            />
                                        </div>
                                    </div>
                                )}
                                <InputError message={errors.fotografia} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="celular" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Phone 
                                            id="phone-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('phone-icon')}`} 
                                        />
                                    Celular
                                </Label>
                                <Input
                                    id="celular"
                                    type="text"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value)}
                                    onFocus={() => animateIcon('phone-icon')}
                                    disabled={processing}
                                    placeholder="Número de celular"
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <InputError message={errors.celular} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <MapPin 
                                            id="map-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('map-icon')}`} 
                                        />
                                    Dirección
                                </Label>
                                <Input
                                    id="direccion"
                                    type="text"
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    onFocus={() => animateIcon('map-icon')}
                                    disabled={processing}
                                    placeholder="Dirección"
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <InputError message={errors.direccion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_nacimiento" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar 
                                            id="calendar-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('calendar-icon')}`} 
                                        />
                                    Fecha de Nacimiento
                                </Label>
                                <Input
                                    id="fecha_nacimiento"
                                    type="date"
                                    required
                                    value={data.fecha_nacimiento}
                                    onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                    onFocus={() => animateIcon('calendar-icon')}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400 [&::-webkit-calendar-picker-indicator]:dark:invert"
                                />
                                <InputError message={errors.fecha_nacimiento} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="genero" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Users 
                                            id="gender-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('gender-icon')}`} 
                                        />
                                    Género
                                </Label>
                                <select
                                    id="genero"
                                    value={data.genero}
                                    onChange={(e) => setData('genero', e.target.value)}
                                    onFocus={() => animateIcon('gender-icon')}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
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

                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-500 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-800 to-purple-900 dark:from-blue-900 dark:to-purple-950 text-white hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 transform hover:scale-105 active:scale-95 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 dark:focus:ring-blue-700 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}