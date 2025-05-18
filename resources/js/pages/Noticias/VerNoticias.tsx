
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('todas');
    const [searchIconActive, setSearchIconActive] = useState(false);
    const [categoryIconActive, setCategoryIconActive] = useState(false);

    const filteredNoticias = noticias.data.filter(noticia => {
        const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = categoriaFilter === 'todas' || noticia.categoria === categoriaFilter;
        return matchesSearch && matchesCategoria;
    });



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias" />
            <div className="max-w-[100rem] mx-auto py-12 px-6 lg:px-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
                    <div 
                        className="p-8 sm:p-10 relative overflow-hidden"
                        style={{
                            backgroundImage: 'url("/images/fondoDash.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-purple-900/85"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="transform transition-all duration-500 hover:translate-x-2">
                                <h1 className="text-4xl font-bold text-white mb-3 animate-fade-in">Noticias y Eventos</h1>
                                <p className="text-lg text-white/90 dark:text-gray-200 animate-slide-up">
                                    Mantente informado sobre las últimas novedades y acontecimientos
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-8 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="search" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Search className={`h-5 w-5 text-blue-500 dark:text-blue-400 ${searchIconActive ? 'animate-bounce' : ''}`} />
                                    Buscar Noticias
                                </label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="h-6 w-6 text-gray-400 animate-pulse" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Buscar noticias..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => {
                                            setSearchIconActive(true);
                                            setTimeout(() => setSearchIconActive(false), 1000);
                                        }}
                                        className="pl-12 w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 h-12 text-base"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="categoria" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Tag className={`h-5 w-5 text-blue-500 dark:text-blue-400 ${categoryIconActive ? 'animate-bounce' : ''}`} />
                                    Filtrar por Categoría
                                </label>
                                <select
                                    value={categoriaFilter}
                                    onChange={(e) => setCategoriaFilter(e.target.value)}
                                    onFocus={() => {
                                        setCategoryIconActive(true);
                                        setTimeout(() => setCategoryIconActive(false), 1000);
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

                        <div className="border-t border-border dark:border-border pt-6">
                            {filteredNoticias.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-muted-foreground">No se encontraron noticias con los criterios de búsqueda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredNoticias.map((noticia) => (
                                        <Card key={noticia.id} className="group overflow-hidden bg-white dark:bg-gray-800
                                            transform transition-all duration-300 ease-in-out hover:scale-[1.02]
                                            hover:shadow-2xl border-2 border-gray-200 dark:border-gray-600 
                                            hover:border-blue-500 dark:hover:border-blue-400 rounded-xl">
                                            {noticia.imagen_path && (
                                                <div className="aspect-video overflow-hidden rounded-t-xl">
                                                    <img
                                                        src={`/${noticia.imagen_path}`}
                                                        alt={noticia.titulo}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-8 space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-110 text-sm font-medium">
                                                        <Tag className="h-4 w-4 mr-2" />
                                                        {noticia.categoria || 'General'}
                                                    </Badge>
                                                    <span className="text-base text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-2">
                                                    {noticia.titulo}
                                                </h2>

                                                <p className="text-gray-600 dark:text-gray-300 line-clamp-4 text-lg leading-relaxed mb-6">
                                                    {noticia.contenido}
                                                </p>

                                                <div className="pt-6 mt-auto border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-base text-gray-600 dark:text-gray-400 font-medium">Por: {noticia.autor.name}</span>
                                                        {noticia.contenido.length > 200 && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => router.visit(route('noticias.show', noticia.id))}
                                                                className="px-6 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transform transition-all duration-300 hover:scale-105 hover:translate-x-1 hover:shadow-lg font-medium text-base flex items-center gap-2"
                                                            >
                                                                Leer más
                                                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            
                            {(noticias.links.prev || noticias.links.next) && (
                                <div className="flex justify-between mt-6 pt-6 border-t border-border dark:border-border">
                                    {noticias.links.prev ? (
                                        <Link href={noticias.links.prev}>
                                            <Button 
                                                variant="outline"
                                                className="transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                                                className="transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
            </div>


        </AppLayout>
    );
}