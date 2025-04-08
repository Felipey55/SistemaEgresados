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
};

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<NoticiaForm>({
        titulo: '',
        contenido: '',
        fecha_publicacion: '',
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
        post(route('noticias.store'), {
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
            <form className="flex flex-col gap-4 max-w-5xl mx-60 min-h-[calc(100vh-12rem)] justify-center" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                            id="titulo"
                            type="text"
                            required
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            disabled={processing}
                            placeholder="Título de la noticia"
                        />
                        <InputError message={errors.titulo} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contenido">Contenido</Label>
                        <Textarea
                            id="contenido"
                            required
                            value={data.contenido}
                            onChange={(e) => setData('contenido', e.target.value)}
                            disabled={processing}
                            placeholder="Contenido de la noticia"
                            rows={6}
                        />
                        <InputError message={errors.contenido} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fecha_publicacion">Fecha de Publicación</Label>
                        <Input
                            id="fecha_publicacion"
                            type="date"
                            required
                            value={data.fecha_publicacion}
                            onChange={(e) => setData('fecha_publicacion', e.target.value)}
                            disabled={processing}
                            className="appearance-none bg-transparent text-white [&::-webkit-calendar-picker-indicator]:invert"
                        />
                        <InputError message={errors.fecha_publicacion} />
                    </div>
                </div>

                <Button type="submit" className="mt-6 w-full max-w-md mx-auto" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Crear Noticia
                </Button>
            </form>
        </AppLayout>
    );
}