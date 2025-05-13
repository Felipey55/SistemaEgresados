import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Noticias',
        href: '/noticias',
    },
    {
        title: 'Editar Noticia',
        href: '#',
    },
];

type NoticiaForm = {
    id?: number;
    titulo: string;
    contenido: string;
    fecha_publicacion: string;
    imagen: File | null;
};

interface Props {
    noticia: NoticiaForm & {
        imagen_path: string | null;
    };
}

export default function Edit({ noticia }: Props) {
    const { data, setData, processing, errors } = useForm<NoticiaForm>({
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        fecha_publicacion: noticia.fecha_publicacion,
        imagen: null,
    });

    const showNotification = (message: string, isSuccess: boolean) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            isSuccess ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
        }`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('titulo', data.titulo);
        formData.append('contenido', data.contenido);
        formData.append('fecha_publicacion', data.fecha_publicacion);
        if (data.imagen) {
            formData.append('imagen', data.imagen);
        }
        router.post(route('noticias.update', noticia.id), formData, {
            onSuccess: () => {
                showNotification('Noticia actualizada exitosamente', true);
                setTimeout(() => {
                    window.location.href = route('noticias.index');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al actualizar la noticia. Verifique los datos.', false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Noticia" />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Card className="bg-card dark:bg-card shadow-lg overflow-hidden sm:rounded-xl border border-input dark:border-input">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                        <h1 className="text-2xl font-bold text-white mb-2">Editar Noticia</h1>
                        <p className="text-blue-100">Actualiza los detalles de la noticia</p>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="titulo" className="text-foreground dark:text-foreground">
                                    Título
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    required
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    disabled={processing}
                                    placeholder="Título de la noticia"
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground"
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contenido" className="text-foreground dark:text-foreground">
                                    Contenido
                                </Label>
                                <Textarea
                                    id="contenido"
                                    required
                                    value={data.contenido}
                                    onChange={(e) => setData('contenido', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contenido de la noticia"
                                    rows={6}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground resize-y min-h-[150px]"
                                />
                                <InputError message={errors.contenido} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fecha_publicacion" className="text-foreground dark:text-foreground">
                                    Fecha de Publicación
                                </Label>
                                <Input
                                    id="fecha_publicacion"
                                    type="date"
                                    required
                                    value={data.fecha_publicacion}
                                    onChange={(e) => setData('fecha_publicacion', e.target.value)}
                                    disabled={processing}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground [&::-webkit-calendar-picker-indicator]:dark:invert"
                                />
                                <InputError message={errors.fecha_publicacion} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="imagen" className="text-foreground dark:text-foreground">
                                    Imagen
                                </Label>
                                <Input
                                    id="imagen"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('imagen', file);
                                    }}
                                    disabled={processing}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground"
                                />
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                    Formatos permitidos: JPG, JPEG, PNG, GIF
                                </p>
                                {(data.imagen || noticia.imagen_path) && (
                                    <div className="mt-4 p-4 bg-background dark:bg-background rounded-lg border border-input dark:border-input">
                                        <img
                                            src={data.imagen ? URL.createObjectURL(data.imagen) : `/${noticia.imagen_path}`}
                                            alt="Vista previa"
                                            className="max-w-full h-auto max-h-[300px] mx-auto rounded-lg object-contain"
                                        />
                                    </div>
                                )}
                                <InputError message={errors.imagen} />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border dark:border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = route('noticias.index')}
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                                Actualizar Noticia
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}