import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Users } from 'lucide-react';
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
    fotografia: File | null;
    celular: string;
    direccion: string;
    fecha_nacimiento: string;
    genero: string;
};

export default function EditarEgresado() {
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
            <div className="max-w-5xl mx-auto p-6">
                <form className="bg-white rounded-lg shadow-lg p-6" onSubmit={submit}>
                    <h1 className="text-2xl font-semibold mb-6">Editar Información Personal</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="identificacion_tipo">Tipo de Identificación</Label>
                                <select
                                    id="identificacion_tipo"
                                    required
                                    value={data.identificacion_tipo}
                                    onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                    className="rounded-lg"
                                />
                                <InputError message={errors.identificacion_numero} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fotografia">Fotografía</Label>
                                <Input
                                    id="fotografia"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData('fotografia', file);
                                    }}
                                    disabled={processing}
                                    className="rounded-lg"
                                />
                                {data.fotografia && (
                                    <div className="mt-2 flex justify-center">
                                        <img
                                            src={URL.createObjectURL(data.fotografia)}
                                            alt="Vista previa"
                                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                                        />
                                    </div>
                                )}
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
                                    className="rounded-lg"
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
                                    className="rounded-lg"
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
                                    className="rounded-lg"
                                />
                                <InputError message={errors.fecha_nacimiento} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="genero" className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    Género
                                </Label>
                                <select
                                    id="genero"
                                    value={data.genero}
                                    onChange={(e) => setData('genero', e.target.value)}
                                    disabled={processing}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

                    <div className="flex justify-end space-x-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
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
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}