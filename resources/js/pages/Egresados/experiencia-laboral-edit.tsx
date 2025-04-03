import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial Laboral',
        href: '/Egresados/historial-laboral',
    },
    {
        title: 'Editar Experiencia',
        href: '#',
    },
];

type ExperienciaForm = {
    tipo_empleo: 'Tiempo Completo' | 'Medio Tiempo' | 'Freelance' | 'Otro';
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string;
    servicios: string;
    correo_empresa: string;
    url_empresa: string;
    modalidad_trabajo: 'Presencial' | 'Remoto' | 'Híbrido';
    descripcion: string;
};

type Props = {
    experiencia: ExperienciaForm;
};

export default function ExperienciaLaboralEdit({ experiencia }: Props) {
    const formatDate = (isoDate: string) => {
        if (!isoDate) return '';
        return new Date(isoDate).toISOString().split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm<ExperienciaForm>({
        tipo_empleo: experiencia.tipo_empleo,
        nombre_empresa: experiencia.nombre_empresa,
        fecha_inicio: formatDate(experiencia.fecha_inicio),
        fecha_fin: formatDate(experiencia.fecha_fin),
        servicios: experiencia.servicios || '',
        correo_empresa: experiencia.correo_empresa || '',
        url_empresa: experiencia.url_empresa || '',
        modalidad_trabajo: experiencia.modalidad_trabajo,
        descripcion: experiencia.descripcion || ''
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
        const experienciaId = (experiencia as any).id;
        if (!experienciaId) {
            showNotification('Error: ID de experiencia no encontrado', false);
            return;
        }
        put(route('experiencia.update', experienciaId), {
            onSuccess: () => {
                showNotification('Experiencia laboral actualizada exitosamente', true);
                setTimeout(() => {
                    window.location.href = route('historial-laboral');
                }, 2000);
            },
            onError: (errors) => {
                if (errors.errors) {
                    const firstError = Object.values(errors.errors)[0];
                    showNotification(Array.isArray(firstError) ? firstError[0] : 'Error al actualizar la experiencia laboral', false);
                } else {
                    showNotification('Error al actualizar la experiencia laboral. Verifique los datos.', false);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Experiencia Laboral" />
            <form className="flex flex-col gap-4 max-w-7xl mx-9 min-h-[calc(100vh-12rem)] justify-center" onSubmit={submit}>
                <h1 className="text-2xl font-semibold">Editar Experiencia Laboral</h1>
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tipo_empleo">Tipo de Empleo</Label>
                            <select
                                id="tipo_empleo"
                                required
                                value={data.tipo_empleo}

                                onChange={(e) => setData('tipo_empleo', e.target.value as ExperienciaForm['tipo_empleo'])}
                                disabled={processing}
                                className="bg-gray-800 text-white border-gray-600 rounded p-2 hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="Tiempo Completo">Tiempo Completo</option>
                                <option value="Medio Tiempo">Medio Tiempo</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Otro">Otro</option>
                            </select>
                            <InputError message={errors.tipo_empleo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
                            <Input
                                id="nombre_empresa"
                                type="text"
                                required
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre de la empresa"
                            />
                            <InputError message={errors.nombre_empresa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                            <Input
                                id="fecha_inicio"
                                type="date"
                                required
                                value={data.fecha_inicio}
                                onChange={(e) => setData('fecha_inicio', e.target.value)}
                                disabled={processing}
                                className="appearance-none bg-transparent text-white [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <InputError message={errors.fecha_inicio} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha_fin">Fecha de Finalización</Label>
                            <Input
                                id="fecha_fin"
                                type="date"
                                value={data.fecha_fin}
                                onChange={(e) => setData('fecha_fin', e.target.value)}
                                disabled={processing}
                                className="appearance-none bg-transparent text-white [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <InputError message={errors.fecha_fin} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="modalidad_trabajo">Modalidad de Trabajo</Label>
                            <select
                                id="modalidad_trabajo"
                                required
                                value={data.modalidad_trabajo}
                                onChange={(e) => setData('modalidad_trabajo', e.target.value as ExperienciaForm['modalidad_trabajo'])}
                                disabled={processing}
                                className="bg-gray-800 text-white border-gray-600 rounded p-2 hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                            <InputError message={errors.modalidad_trabajo} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="servicios">Servicios/Cargo</Label>
                            <Input
                                id="servicios"
                                type="text"
                                value={data.servicios}
                                onChange={(e) => setData('servicios', e.target.value)}
                                disabled={processing}
                                placeholder="Servicios o cargo desempeñado"
                            />
                            <InputError message={errors.servicios} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="correo_empresa">Correo de la Empresa</Label>
                            <Input
                                id="correo_empresa"
                                type="email"
                                value={data.correo_empresa}
                                onChange={(e) => setData('correo_empresa', e.target.value)}
                                disabled={processing}
                                placeholder="correo@empresa.com"
                            />
                            <InputError message={errors.correo_empresa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="url_empresa">URL de la Empresa</Label>
                            <Input
                                id="url_empresa"
                                type="url"
                                value={data.url_empresa}
                                onChange={(e) => setData('url_empresa', e.target.value)}
                                disabled={processing}
                                placeholder="https://www.empresa.com"
                            />
                            <InputError message={errors.url_empresa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                disabled={processing}
                                placeholder="Describe tus responsabilidades y logros"
                            />
                            <InputError message={errors.descripcion} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={processing}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}