import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Calendar, Tag, ArrowRight, Plus, Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ver Noticias',
        href: '/VerNoticias',
    },
];

interface Noticia {
    id: number;
    titulo: string;
    contenido: string;
    fecha_publicacion: string;
    imagen_path: string | null;
    categoria?: string;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('todas');

    const filteredNoticias = noticias.data.filter(noticia => {
        const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = categoriaFilter === 'todas' || noticia.categoria === categoriaFilter;
        return matchesSearch && matchesCategoria;
    });

    const showNotification = (message: string, isSuccess: boolean) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-card dark:bg-card shadow-lg overflow-hidden sm:rounded-xl border border-input dark:border-input">
                    <div className="px-6 py-8 sm:px-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Noticias y Eventos</h1>
                                <p className="mt-2 text-muted-foreground dark:text-muted-foreground">Mantente informado sobre las últimas novedades y acontecimientos</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 md:space-y-0 md:flex md:gap-4 items-start">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Buscar noticias..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                            
                            <select
                                value={categoriaFilter}
                                onChange={(e) => setCategoriaFilter(e.target.value)}
                                className="bg-background dark:bg-background text-foreground dark:text-foreground border-input dark:border-input rounded-md px-4 py-2 focus:ring-2 focus:ring-ring dark:focus:ring-ring transition-all"
                            >
                                <option value="todas">Todas las categorías</option>
                                <option value="eventos">Eventos</option>
                                <option value="noticias">Noticias</option>
                                <option value="comunicados">Comunicados</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-border dark:border-border">
                        {filteredNoticias.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-muted-foreground">No se encontraron noticias con los criterios de búsqueda.</p>
                            </div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNoticias.map((noticia) => (
                                    <Card key={noticia.id} className="group overflow-hidden bg-card dark:bg-card hover:shadow-lg transition-all duration-300 border border-input dark:border-input hover:border-primary dark:hover:border-primary">
                                        {noticia.imagen_path && (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={`/${noticia.imagen_path}`}
                                                    alt={noticia.titulo}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {noticia.categoria || 'General'}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {noticia.titulo}
                                            </h2>

                                            <p className="text-muted-foreground line-clamp-3">
                                                {noticia.contenido}
                                            </p>

                                            <div className="pt-4 flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Por: {noticia.autor.name}</span>
                                                <Button
                                                    variant="outline"
                                                    className="text-primary hover:bg-primary/10"
                                                    onClick={() => router.visit(`/noticias/${noticia.id}`)}
                                                >
                                                    Leer más
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                        
                        {(noticias.links.prev || noticias.links.next) && (
                            <div className="flex justify-between mt-6 px-6 pb-6">
                                {noticias.links.prev ? (
                                    <Link href={noticias.links.prev}>
                                        <Button variant="outline">Anterior</Button>
                                    </Link>
                                ) : (
                                    <div></div>
                                )}
                                {noticias.links.next && (
                                    <Link href={noticias.links.next}>
                                        <Button variant="outline">Siguiente</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showConfirmDialog && selectedNoticia && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-card dark:bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4 border border-input dark:border-input">
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