import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Briefcase, Calendar, Building2, Globe, Mail, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial Laboral',
        href: '/Egresados/historial-laboral',
    },
];

type ExperienciaLaboral = {
    tipo_empleo: string;
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string;
    servicios: string;
    correo_empresa: string;
    url_empresa: string;
    modalidad_trabajo: string;
    descripcion: string;
};

export default function HistorialLaboral() {
    const { data, setData, post, processing, errors, reset } = useForm<ExperienciaLaboral>({
        tipo_empleo: 'Tiempo Completo',
        nombre_empresa: '',
        fecha_inicio: '',
        fecha_fin: '',
        servicios: '',
        correo_empresa: '',
        url_empresa: '',
        modalidad_trabajo: 'Presencial',
        descripcion: ''
    });

    const [experiencias, setExperiencias] = useState<ExperienciaLaboral[]>([]);

    const showNotification = (message: string, isSuccess: boolean) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('experiencia.store'), {
            onSuccess: () => {
                showNotification('Experiencia laboral registrada exitosamente', true);
                reset();
                // Actualizar la lista de experiencias y redirigir
                setExperiencias([...experiencias, data]);
                setTimeout(() => {
                    window.location.href = route('formacion-academica');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al registrar la experiencia laboral', false);
            },
        });
    };

    // Nuevo estado para controlar la animación de los iconos
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    // Función para activar la animación del icono
    const animateIcon = (iconId: string) => {
        setActiveIcon(iconId);
        setTimeout(() => setActiveIcon(null), 2000);
    };

    // Función para obtener la clase de animación
    const getAnimationClass = (iconId: string) => {
        if (activeIcon !== iconId) return '';
        // Ahora todos los iconos tendrán la animación de salto
        return 'animate-bounce transform duration-1000';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial Laboral" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div 
                        className="p-6 sm:p-8 relative overflow-hidden"
                        style={{
                            backgroundImage: 'url(/images/fondoDash.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold text-white mb-2 text-shadow hover:scale-105 transition-transform duration-300">Historial Laboral</h1>
                            <p className="text-white text-shadow hover:scale-105 transition-transform duration-300">Registra tu experiencia profesional</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_empleo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Briefcase 
                                        id="briefcase-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('briefcase-icon')}`}
                                    />
                                    Tipo de Empleo
                                </Label>
                                <select
                                    id="tipo_empleo"
                                    value={data.tipo_empleo}
                                    onChange={(e) => setData('tipo_empleo', e.target.value)}
                                    onFocus={() => animateIcon('briefcase-icon')}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Tiempo Completo">Tiempo Completo</option>
                                    <option value="Medio Tiempo">Medio Tiempo</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Contrato">Contrato</option>
                                    <option value="Prácticas">Prácticas</option>
                                </select>
                                <InputError message={errors.tipo_empleo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nombre_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Building2 
                                        id="building-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('building-icon')}`}
                                    />
                                    Nombre de la Empresa
                                </Label>
                                <Input
                                    id="nombre_empresa"
                                    type="text"
                                    value={data.nombre_empresa}
                                    onChange={(e) => setData('nombre_empresa', e.target.value)}
                                    onFocus={() => animateIcon('building-icon')}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    required
                                />
                                <InputError message={errors.nombre_empresa} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_inicio" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar 
                                        id="calendar-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('calendar-icon')}`}
                                    />
                                    Fecha de Inicio
                                </Label>
                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    onFocus={() => animateIcon('calendar-icon')}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    required
                                />
                                <InputError message={errors.fecha_inicio} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_fin" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar 
                                        id="calendar-fin-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('calendar-fin-icon')}`}
                                    />
                                    Fecha de Finalización
                                </Label>
                                <Input
                                    id="fecha_fin"
                                    type="date"
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    onFocus={() => animateIcon('calendar-fin-icon')}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <InputError message={errors.fecha_fin} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modalidad_trabajo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <MapPin 
                                        id="map-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('map-icon')}`}
                                    />
                                    Modalidad de Trabajo
                                </Label>
                                <select
                                    id="modalidad_trabajo"
                                    value={data.modalidad_trabajo}
                                    onChange={(e) => setData('modalidad_trabajo', e.target.value)}
                                    onFocus={() => animateIcon('map-icon')}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Seleccione una modalidad</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Híbrido">Híbrido</option>
                                </select>
                                <InputError message={errors.modalidad_trabajo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="correo_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Mail 
                                        id="mail-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('mail-icon')}`}
                                    />
                                    Correo de la Empresa
                                </Label>
                                <Input
                                    id="correo_empresa"
                                    type="email"
                                    value={data.correo_empresa}
                                    onChange={(e) => setData('correo_empresa', e.target.value)}
                                    onFocus={() => animateIcon('mail-icon')}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="correo@empresa.com"
                                />
                                <InputError message={errors.correo_empresa} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url_empresa" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Globe 
                                        id="globe-icon"
                                        className={`h-4 w-4 text-blue-500 transform transition-transform duration-300 ${getAnimationClass('globe-icon')}`}
                                    />
                                    Sitio Web de la Empresa
                                </Label>
                                <Input
                                    id="url_empresa"
                                    type="url"
                                    value={data.url_empresa}
                                    onChange={(e) => setData('url_empresa', e.target.value)}
                                    onFocus={() => animateIcon('globe-icon')}
                                    className="rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="https://"
                                />
                                <InputError message={errors.url_empresa} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="servicios" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                Servicios/Productos de la Empresa
                            </Label>
                            <Textarea
                                id="servicios"
                                value={data.servicios}
                                onChange={(e) => setData('servicios', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                rows={3}
                            />
                            <InputError message={errors.servicios} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                Descripción de Actividades
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                rows={4}
                                required
                            />
                            <InputError message={errors.descripcion} />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = route('egresado.perfil')}
                                className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:border-red-500 active:border-red-700 focus:border-red-500"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-700 to-purple-700 text-white 
                                    hover:from-blue-500 hover:to-purple-500 
                                    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                    transform transition-all duration-200 ease-in-out
                                    hover:scale-105 active:scale-95
                                    shadow-lg hover:shadow-blue-500/50
                                    flex items-center gap-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="animate-spin">
                                            <LoaderCircle className="h-5 w-5" />
                                        </span>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Guardar Experiencia</span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            →
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Lista de experiencias */}
                <div className="mt-8 space-y-6">
                    {experiencias.map((exp, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.nombre_empresa}</h3>
                                    <Badge className="mt-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">{exp.tipo_empleo}</Badge>
                                </div>
                                <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{exp.modalidad_trabajo}</Badge>
                            </div>
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 dark:text-gray-400" />
                                    {exp.fecha_inicio} - {exp.fecha_fin || 'Actual'}
                                </p>
                                <p className="mt-2">{exp.descripcion}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}