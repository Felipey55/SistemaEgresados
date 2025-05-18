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
        title: 'Noticias',
        href: '/noticias',
    },
];

type NoticiaForm = {
    titulo: string;
    contenido: string;
    fecha_publicacion: string;
    imagen: File | null;
};

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<NoticiaForm>({
        titulo: '',
        contenido: '',
        fecha_publicacion: '',
        imagen: null,
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
        const formData = new FormData();
        formData.append('titulo', data.titulo);
        formData.append('contenido', data.contenido);
        formData.append('fecha_publicacion', data.fecha_publicacion);
        if (data.imagen) {
            formData.append('imagen', data.imagen);
        }
        post(route('noticias.store'), {
            ...formData,
            onSuccess: () => {
                showNotification('Noticia creada exitosamente', true);
                reset();
                setTimeout(() => {
                    window.location.href = route('noticias.index');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al crear la noticia. Verifique los datos.', false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Noticia" />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div 
                        className="p-6 sm:p-8 relative overflow-hidden"
                        style={{
                            backgroundImage: 'url("/images/fondoDash.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold text-white mb-2 text-shadow transform transition-all duration-300 ease-in-out hover:scale-110 hover:translate-x-2 cursor-default">Crear Noticia</h1>
                            <p className="text-white/90 text-shadow transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-1 cursor-default">Registra una nueva noticia</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">

                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="titulo" className="text-foreground dark:text-foreground">Título</Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    required
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    disabled={processing}
                                    placeholder="Título de la noticia"
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground
                                        transform transition-all duration-300 ease-in-out
                                        hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500
                                        hover:scale-[1.01] hover:shadow-md
                                        focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:shadow-lg
                                        active:scale-[0.99]
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <InputError message={errors.titulo} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contenido" className="text-foreground dark:text-foreground">Contenido</Label>
                                <Textarea
                                    id="contenido"
                                    required
                                    value={data.contenido}
                                    onChange={(e) => setData('contenido', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contenido de la noticia"
                                    rows={6}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground resize-y min-h-[150px]
                                        transform transition-all duration-300 ease-in-out
                                        hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500
                                        hover:scale-[1.005] hover:shadow-md
                                        focus:scale-[1.01] focus:ring-2 focus:ring-blue-500 focus:shadow-lg
                                        active:scale-[0.995]
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <InputError message={errors.contenido} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="imagen" className="text-foreground dark:text-foreground">Imagen</Label>
                                <Input
                                    id="imagen"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('imagen', file);
                                    }}
                                    disabled={processing}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground
                                        transform transition-all duration-300 ease-in-out
                                        hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500
                                        hover:scale-[1.01] hover:shadow-md
                                        focus:ring-2 focus:ring-blue-500 focus:shadow-lg
                                        active:scale-[0.99]
                                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                        file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                                        file:transition-colors file:duration-200
                                        hover:file:bg-blue-100
                                        dark:file:bg-blue-900 dark:file:text-blue-200
                                        dark:hover:file:bg-blue-800"
                                />
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                    Formatos permitidos: JPG, JPEG, PNG, GIF
                                </p>
                                {data.imagen && (
                                    <div className="mt-4 p-4 bg-background dark:bg-background rounded-lg border border-input dark:border-input">
                                        <img
                                            src={URL.createObjectURL(data.imagen)}
                                            alt="Vista previa"
                                            className="max-w-full h-auto max-h-[300px] mx-auto rounded-lg object-contain"
                                        />
                                    </div>
                                )}
                                <InputError message={errors.imagen} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fecha_publicacion" className="text-foreground dark:text-foreground">Fecha de Publicación</Label>
                                <Input
                                    id="fecha_publicacion"
                                    type="date"
                                    required
                                    value={data.fecha_publicacion}
                                    onChange={(e) => setData('fecha_publicacion', e.target.value)}
                                    disabled={processing}
                                    className="bg-background dark:bg-background text-foreground dark:text-foreground [&::-webkit-calendar-picker-indicator]:dark:invert
                                        transform transition-all duration-300 ease-in-out
                                        hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500
                                        hover:scale-[1.01] hover:shadow-md
                                        focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:shadow-lg
                                        active:scale-[0.99]
                                        cursor-pointer"
                                />
                                <InputError message={errors.fecha_publicacion} />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border dark:border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.href = route('noticias.index')}
                                disabled={processing}
                                className="w-full sm:w-auto transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg hover:shadow-blue-500/50 transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                                Crear Noticia
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}