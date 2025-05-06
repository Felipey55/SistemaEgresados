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
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                        <h1 className="text-2xl font-bold text-white mb-2">Formación Académica</h1>
                        <p className="text-blue-100">Registra tu formación académica</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_formacion" className="flex items-center gap-2 text-gray-700">
                                    <GraduationCap className="h-4 w-4 text-blue-500" />
                                    Tipo de Formación
                                </Label>
                                <select
                                    id="tipo_formacion"
                                    value={data.tipo_formacion}
                                    onChange={(e) => setData('tipo_formacion', e.target.value as FormacionForm['tipo_formacion'])}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                <Label htmlFor="titulo" className="flex items-center gap-2 text-gray-700">
                                    <Award className="h-4 w-4 text-blue-500" />
                                    Título Obtenido
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className="rounded-lg"
                                    placeholder="Ej: Ingeniero en Sistemas"
                                    required
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institucion" className="flex items-center gap-2 text-gray-700">
                                    <School className="h-4 w-4 text-blue-500" />
                                    Institución Educativa
                                </Label>
                                <Input
                                    id="institucion"
                                    type="text"
                                    value={data.institucion}
                                    onChange={(e) => setData('institucion', e.target.value)}
                                    className="rounded-lg"
                                    placeholder="Nombre de la institución"
                                    required
                                />
                                <InputError message={errors.institucion} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_realizacion" className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    Fecha de Realización
                                </Label>
                                <Input
                                    id="fecha_realizacion"
                                    type="date"
                                    value={data.fecha_realizacion}
                                    onChange={(e) => setData('fecha_realizacion', e.target.value)}
                                    className="rounded-lg"
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
                                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{form.titulo}</h3>
                                    <Badge className="mt-2 bg-blue-100 text-blue-800">{form.tipo_formacion}</Badge>
                                </div>
                                <div className="text-sm text-gray-600">
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