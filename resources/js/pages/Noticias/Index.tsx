import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Calendar, Tag, ArrowRight, Plus, Pencil, Trash2, FileText, Filter, Info } from 'lucide-react';

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
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias" />
            <div className="max-w-[100rem] mx-auto py-12 px-6 lg:px-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
                    <div 
                        className="p-8 sm:p-10 relative"
                        style={{
                            backgroundImage: 'url("/images/fondoDash.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-purple-900/85"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="transform transition-all duration-500 hover:translate-x-2">
                                <h1 className="text-3xl font-bold text-white mb-3 animate-fade-in">Noticias y Eventos</h1>
                                <p className="text-lg text-white/90 dark:text-gray-200 animate-slide-up">
                                    Mantente informado sobre las últimas novedades y acontecimientos
                                </p>
                            </div>
                            
                            <Link href={route('noticias.create')}>
                                <Button
                                    className="px-8 py-3 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white dark:bg-gray-800/95 dark:text-white dark:hover:bg-gray-700 flex items-center gap-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform text-base"
                                >
                                    <Plus className="h-6 w-6 animate-bounce" />
                                    Nueva Noticia
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-8 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="search" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Search className="h-5 w-5 text-blue-500 dark:text-blue-400 transform transition-all duration-700" />
                                    Buscar Noticias
                                </label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Buscar noticias..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.currentTarget.parentElement?.previousElementSibling?.querySelector('svg');
                                            if (icon) {
                                                icon.classList.add('scale-125', 'rotate-12', 'animate-bounce');
                                                setTimeout(() => icon.classList.remove('scale-125', 'rotate-12', 'animate-bounce'), 1000);
                                            }
                                        }}
                                        className="pl-12 w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 h-12 text-base"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="categoria" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Filter className="h-5 w-5 text-blue-500 dark:text-blue-400 transform transition-all duration-700" />
                                    Filtrar por Categoría
                                </label>
                                <select
                                    value={categoriaFilter}
                                    onChange={(e) => setCategoriaFilter(e.target.value)}
                                    onFocus={(e) => {
                                        const icon = e.currentTarget.parentElement?.querySelector('svg');
                                        if (icon) {
                                            icon.classList.add('scale-125', '-rotate-12', 'animate-bounce');
                                            setTimeout(() => icon.classList.remove('scale-125', '-rotate-12', 'animate-bounce'), 1000);
                                        }
                                    }}
                                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-300 transform hover:scale-105 w-full text-base"
                                >
                                    <option value="todas">Todas las categorías</option>
                                    <option value="eventos">Eventos</option>
                                    <option value="noticias">Noticias</option>
                                    <option value="comunicados">Comunicados</option>
                                </select>
                            </div>
                        </div>

                        {filteredNoticias.length === 0 ? (
                            <div className="p-10 text-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-100 dark:border-gray-600">
                                <Info className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No se encontraron noticias</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No hay resultados para los criterios de búsqueda seleccionados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {filteredNoticias.map((noticia) => (
                                    <Card key={noticia.id} className="group overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                                        {noticia.imagen_path && (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={`/${noticia.imagen_path}`}
                                                    alt={noticia.titulo}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors px-4 py-2 text-sm">
                                                        <Tag className="h-4 w-4 mr-2" />
                                                        {noticia.categoria || 'General'}
                                                    </Badge>
                                                    <span className="text-base text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Link href={route('noticias.show', noticia.id)}>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-10 w-10 p-0 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700 transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg active:scale-95 active:translate-y-1 hover:animate-bounce focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300"
                                                        >
                                                            <FileText className="h-5 w-5 transition-transform duration-700 group-hover:animate-pulse hover:animate-bounce" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('noticias.edit', noticia.id)}>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-10 w-10 p-0 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg active:scale-95 active:translate-y-1 hover:animate-bounce focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300"
                                                        >
                                                            <Pencil className="h-5 w-5 transition-transform duration-700 group-hover:animate-pulse hover:animate-bounce" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transform transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-lg active:scale-95"
                                                        onClick={() => {
                                                            setSelectedNoticia(noticia);
                                                            setShowConfirmDialog(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-5 w-5 transition-transform duration-700 group-hover:animate-bounce" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                                                {noticia.titulo}
                                            </h2>

                                            <p className="text-gray-600 dark:text-gray-300 line-clamp-5 text-lg leading-relaxed">
                                                {noticia.contenido}
                                            </p>

                                            <div className="pt-6 flex items-center justify-between">
                                                <span className="text-base text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Por: {noticia.autor.name}
                                                </span>
                                                {noticia.contenido.length > 300 && (
                                                    <Button
                                                        variant="outline"
                                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                        onClick={() => router.visit(`/noticias/${noticia.id}`)}
                                                    >
                                                        Leer más
                                                        <ArrowRight className="h-5 w-5 animate-pulse" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                        
                        {(noticias.links.prev || noticias.links.next) && (
                            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                                {noticias.links.prev ? (
                                    <Link href={noticias.links.prev}>
                                        <Button 
                                            variant="outline"
                                            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                                        >
                                            Anterior
                                        </Button>
                                    </Link>
                                ) : (
                                    <div></div>
                                )}
                                {noticias.links.next && (
                                    <Link href={noticias.links.next}>
                                        <Button 
                                            variant="outline"
                                            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                                        >
                                            Siguiente
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showConfirmDialog && selectedNoticia && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-xl w-full mx-4">
                        <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">Confirmar eliminación</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">¿Está seguro de que desea eliminar esta noticia?</p>
                        <div className="flex justify-end space-x-5">
                            <Button
                                variant="outline"
                                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setSelectedNoticia(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors text-base"
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