import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Noticias',
        href: '/noticias',
    },
];

interface Noticia {
    id: number;
    titulo: string;
    contenido: string;
    fecha_publicacion: string;
    autor: {
        name: string;
    };
}

interface Props {
    noticias: {
        data: Noticia[];
        links: {
            prev: string | null;
            next: string | null;
        };
    };
}

export default function Index({ noticias }: Props) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias" />
            <div className="px-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Noticias</h1>
                    <Link href={route('noticias.create')}>
                        <Button>Crear Noticia</Button>
                    </Link>
                </div>

                <div className="grid gap-6">
                    {noticias.data.map((noticia) => (
                        <div key={noticia.id} className="bg-card p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{noticia.titulo}</h2>
                                <div className="flex gap-2">
                                    <Link href={route('noticias.edit', noticia.id)}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedNoticia(noticia);
                                            setShowConfirmDialog(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-4">{noticia.contenido}</p>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Por: {noticia.autor.name}</span>
                                <span>Fecha: {new Date(noticia.fecha_publicacion).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {(noticias.links.prev || noticias.links.next) && (
                    <div className="flex justify-between mt-6">
                        {noticias.links.prev && (
                            <Link href={noticias.links.prev}>
                                <Button variant="outline">Anterior</Button>
                            </Link>
                        )}
                        {noticias.links.next && (
                            <Link href={noticias.links.next}>
                                <Button variant="outline">Siguiente</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {showConfirmDialog && selectedNoticia && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
                        <p className="text-muted-foreground mb-6">¿Está seguro de que desea eliminar esta noticia?</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setSelectedNoticia(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    router.delete(route('noticias.destroy', selectedNoticia.id), {
                                        onSuccess: () => {
                                            showNotification('Noticia eliminada exitosamente', true);
                                            setShowConfirmDialog(false);
                                            setSelectedNoticia(null);
                                        },
                                        onError: () => {
                                            showNotification('Error al eliminar la noticia', false);
                                            setShowConfirmDialog(false);
                                            setSelectedNoticia(null);
                                        },
                                    });
                                }}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
