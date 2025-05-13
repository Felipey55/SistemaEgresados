import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, GraduationCap, School, Award } from 'lucide-react';
import InputError from '@/components/input-error';

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

    const [formaciones, setFormaciones] = useState<FormacionForm[]>([]);

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('formacion.store'), {
            onSuccess: () => {
                showNotification('Formación académica registrada exitosamente', true);
                setFormaciones([...formaciones, data]);
                reset();
                setTimeout(() => {
                    window.location.href = route('egresado.perfil');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al registrar la formación académica', false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formación Académica" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
                        <h1 className="text-2xl font-bold text-white mb-2">Formación Académica</h1>
                        <p className="text-blue-100 dark:text-blue-200">Registra tu formación académica</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_formacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <GraduationCap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Tipo de Formación
                                </Label>
                                <select
                                    id="tipo_formacion"
                                    value={data.tipo_formacion}
                                    onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Pregrado">Pregrado</option>
                                    <option value="Especialización">Especialización</option>
                                    <option value="Maestría">Maestría</option>
                                    <option value="Doctorado">Doctorado</option>
                                </select>
                                <InputError message={errors.tipo_formacion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="titulo" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Award className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Título Obtenido
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Ej: Ingeniero en Sistemas"
                                    required
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institucion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <School className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Institución Educativa
                                </Label>
                                <Input
                                    id="institucion"
                                    type="text"
                                    value={data.institucion}
                                    onChange={(e) => setData('institucion', e.target.value)}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Nombre de la institución"
                                    required
                                />
                                <InputError message={errors.institucion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_realizacion" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Fecha de Realización
                                </Label>
                                <Input
                                    id="fecha_realizacion"
                                    type="date"
                                    value={data.fecha_realizacion}
                                    onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                    className="rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    required
                                />
                                <InputError message={errors.fecha_realizacion} />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                                disabled={processing}
                            >
                                {processing ? 'Guardando...' : 'Guardar Formación'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Lista de formaciones */}
                <div className="mt-8 space-y-6">
                    {formaciones.map((form, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg dark:hover:shadow-gray-700/30 transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{form.titulo}</h3>
                                    <Badge className="mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{form.tipo_formacion}</Badge>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="flex items-center gap-2">
                                        <School className="h-4 w-4" />
                                        {form.institucion}
                                    </p>
                                    <p className="flex items-center gap-2 mt-2">
                                        <Calendar className="h-4 w-4" />
                                        {form.fecha_realizacion}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}