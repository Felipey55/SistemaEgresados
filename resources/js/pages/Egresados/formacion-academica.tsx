import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, BookOpen, Calendar, GraduationCap, School, Award } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agregar Formación Académica',
        href: '/Egresados/formacion-academica',
    },
];

type FormacionForm = {
    titulo: string;
    institucion: string;
    tipo_formacion: 'Pregrado' | 'Especialización' | 'Maestría' | 'Doctorado';
    fecha_realizacion: string;
};

export default function AgregarFormacion() {
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

    const { data, setData, post, processing, errors } = useForm<FormacionForm>({
        titulo: '',
        institucion: '',
        tipo_formacion: 'Pregrado',
        fecha_realizacion: '',
    });

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
        post(route('formacion.store'), {
            onSuccess: () => {
                showNotification('Información académica agregada exitosamente', true);
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
                    showNotification('Error al agregar la formación académica. Verifique los datos.', false);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agregar Formación Académica" />
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
                            <h1 className="text-2xl font-bold text-white mb-2 text-shadow hover:scale-105 transition-transform duration-300">Agregar Formación Académica</h1>
                            <p className="text-white text-shadow hover:scale-105 transition-transform duration-300">Registra tu información académica</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_formacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <GraduationCap 
                                        id="graduation-icon"
                                        className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('graduation-icon')}`} 
                                    />
                                    Tipo de Formación
                                </Label>
                                <select
                                    id="tipo_formacion"
                                    value={data.tipo_formacion}
                                    onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                    onFocus={() => animateIcon('graduation-icon')}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                                    <Award 
                                        id="award-icon"
                                        className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('award-icon')}`} 
                                    />
                                    Título Obtenido
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    onFocus={() => animateIcon('award-icon')}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Ej: Ingeniero en Sistemas"
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institucion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <School 
                                        id="school-icon"
                                        className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('school-icon')}`} 
                                    />
                                    Institución
                                </Label>
                                <Input
                                    id="institucion"
                                    type="text"
                                    value={data.institucion}
                                    onChange={(e) => setData('institucion', e.target.value)}
                                    onFocus={() => animateIcon('school-icon')}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Nombre de la institución"
                                />
                                <InputError message={errors.institucion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_realizacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar 
                                        id="calendar-icon"
                                        className={`h-4 w-4 text-blue-500 dark:text-blue-400 transform transition-transform duration-300 hover:scale-125 hover:rotate-12 ${getAnimationClass('calendar-icon')}`} 
                                    />
                                    Fecha de Realización
                                </Label>
                                <Input
                                    id="fecha_realizacion"
                                    type="date"
                                    required
                                    value={data.fecha_realizacion}
                                    onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                    onFocus={() => animateIcon('calendar-icon')}
                                    disabled={processing}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 focus:ring-blue-500 dark:focus:ring-blue-400 [&::-webkit-calendar-picker-indicator]:dark:invert"
                                />
                                <InputError message={errors.fecha_realizacion} />
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
                                Guardar Formación
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}