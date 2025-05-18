import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Camera, MapPin, Phone, Calendar, User, Mail, GraduationCap } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
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

    // Estado para controlar qué icono está animado
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    // Función para activar la animación del icono
    const animateIcon = (iconId: string) => {
        setActiveIcon(iconId);
        // Aumentar el tiempo de la animación a 2 segundos
        setTimeout(() => setActiveIcon(null), 2000);
    };

    // Función para obtener la clase de animación según el icono
    const getAnimationClass = (iconId: string) => {
        if (activeIcon !== iconId) return '';
        
        switch (iconId) {
            // Añadir la clase 'duration-1000' para hacer las animaciones más lentas
            case 'user-icon': return 'animate-bounce duration-1000';
            case 'graduation-icon': return 'animate-ping duration-1000';
            case 'phone-icon': return 'animate-spin duration-1000';
            case 'map-icon': return 'animate-pulse duration-1000';
            case 'camera-icon': return 'animate-spin duration-1000';
            case 'calendar-icon': return 'animate-bounce duration-1000';
            case 'gender-icon': return 'animate-pulse duration-1000';
            default: return '';
        }
    };

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
            <div className="max-w-7xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200 mt-0">
                    <div 
                        className="p-8 sm:p-10 relative overflow-hidden group" 
                        style={{
                            backgroundImage: 'url(/images/fondoDash.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: 'translateZ(0)',
                        }}
                    >
                        <div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                            style={{
                                mixBlendMode: 'overlay',
                            }}
                        ></div>
                        <div className="relative z-10 transform transition-all duration-500 group-hover:translate-y-[-5px]">
                            <h1 className="text-3xl font-bold text-white mb-3 text-shadow animate-fade-in">Registro como Egresado</h1>
                            <p className="text-lg text-white text-shadow animate-slide-up">Complete el formulario para registrarse en nuestra plataforma</p>
                        </div>
                        <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-500 group-hover:opacity-40"></div>
                    </div>
                    <form className="p-8 sm:p-10 flex flex-col gap-10" onSubmit={submit}>
                        
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Columna izquierda */}
                            <div className="space-y-8">
                                <div className="grid gap-4">
                                    <Label htmlFor="identificacion_tipo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <User 
                                            id="user-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('user-icon')}`} 
                                        />
                                        <span>Tipo de Identificación</span>
                                    </Label>
                                    <select
                                        id="identificacion_tipo"
                                        required
                                        value={data.identificacion_tipo}
                                        onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                                        onFocus={() => animateIcon('user-icon')}
                                        disabled={processing}
                                        className={`w-full px-4 py-2 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${errors.identificacion_tipo ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400'}`}
                                    >
                                        <option value="C.C.">Cédula de Ciudadanía</option>
                                        <option value="C.E.">Cédula de Extranjería</option>
                                    </select>
                                    <InputError message={errors.identificacion_tipo} />
                                </div>

                                <div className="grid gap-4">
                                    <Label htmlFor="identificacion_numero" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <GraduationCap 
                                            id="graduation-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:-translate-y-1 ${getAnimationClass('graduation-icon')}`} 
                                        />
                                        <span>Número de Identificación</span>
                                    </Label>
                                    <Input
                                        id="identificacion_numero"
                                        type="text"
                                        required
                                        value={data.identificacion_numero}
                                        onChange={(e) => setData('identificacion_numero', e.target.value)}
                                        onFocus={() => animateIcon('graduation-icon')}
                                        disabled={processing}
                                        placeholder="Número de identificación"
                                        className={`rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${errors.identificacion_numero ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400'}`}
                                    />
                                    <InputError message={errors.identificacion_numero} />
                                </div>
                                
                                <div className="grid gap-4">
                                    <Label htmlFor="celular" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Phone 
                                            id="phone-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-[-12deg] ${getAnimationClass('phone-icon')}`} 
                                        />
                                        <span>Celular</span>
                                    </Label>
                                    <Input
                                        id="celular"
                                        type="tel"
                                        value={data.celular}
                                        onChange={(e) => setData('celular', e.target.value)}
                                        onFocus={() => animateIcon('phone-icon')}
                                        disabled={processing}
                                        placeholder="Número de celular"
                                        className={`rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${errors.celular ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400'}`}
                                    />
                                    <InputError message={errors.celular} />
                                </div>
                                
                                <div className="grid gap-4">
                                    <Label htmlFor="direccion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <MapPin 
                                            id="map-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:bounce ${getAnimationClass('map-icon')}`} 
                                        />
                                        <span>Dirección</span>
                                    </Label>
                                    <Input
                                        id="direccion"
                                        type="text"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        onFocus={() => animateIcon('map-icon')}
                                        disabled={processing}
                                        placeholder="Dirección completa"
                                        className={`rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${errors.direccion ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400'}`}
                                    />
                                    <InputError message={errors.direccion} />
                                </div>
                            </div>
                            
                            {/* Columna derecha */}
                            <div className="space-y-8">
                                <div className="grid gap-4">
                                    <Label htmlFor="fotografia" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Camera 
                                            id="camera-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-180 ${getAnimationClass('camera-icon')}`} 
                                        />
                                        <span>Fotografía</span>
                                    </Label>
                                    <div className="relative">
                                        <label 
                                            htmlFor="fotografia" 
                                            className="relative group cursor-pointer block"
                                            onClick={() => animateIcon('camera-icon')}
                                        >
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
                                            <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-700/50">
                                                {!data.fotografia ? (
                                                    <div className="text-center space-y-3">
                                                        <Camera className="h-16 w-16 mx-auto text-blue-500 dark:text-blue-400 animate-pulse" />
                                                        <p className="text-gray-600 dark:text-gray-300">Haga clic para seleccionar una foto</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Formatos aceptados: JPG, PNG</p>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={URL.createObjectURL(data.fotografia)}
                                                            alt="Vista previa"
                                                            className="w-full h-full object-cover rounded-2xl"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                            <Camera className="h-16 w-16 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <InputError message={errors.fotografia} />
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <Label htmlFor="fecha_nacimiento" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Calendar 
                                            id="calendar-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-[360deg] ${getAnimationClass('calendar-icon')}`} 
                                        />
                                        <span>Fecha de Nacimiento</span>
                                    </Label>
                                    <Input
                                        id="fecha_nacimiento"
                                        type="date"
                                        required
                                        value={data.fecha_nacimiento}
                                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                        onFocus={() => animateIcon('calendar-icon')}
                                        disabled={processing}
                                        className={`px-4 py-3 rounded-xl border-2 bg-gray-800 text-white shadow-sm [&::-webkit-calendar-picker-indicator]:invert disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${errors.fecha_nacimiento ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    <InputError message={errors.fecha_nacimiento} />
                                </div>

                                <div className="grid gap-4">
                                    <Label htmlFor="genero" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <User 
                                            id="gender-icon"
                                            className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:pulse ${getAnimationClass('gender-icon')}`} 
                                        />
                                        <span>Género</span>
                                    </Label>
                                    <select
                                        id="genero"
                                        required
                                        value={data.genero}
                                        onChange={(e) => setData('genero', e.target.value)}
                                        onFocus={() => animateIcon('gender-icon')}
                                        disabled={processing}
                                        className={`w-full px-4 py-2 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${errors.genero ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400'}`}
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
                        
                        <div className="mt-12">
                            <Button
                                type="submit"
                                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white 
                                hover:from-blue-500 hover:to-purple-600 
                                active:from-blue-700 active:to-purple-800 
                                focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 
                                dark:focus:ring-blue-300 transition-all duration-300 
                                transform hover:scale-[1.02] hover:shadow-lg 
                                active:scale-[0.98] rounded-lg"
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