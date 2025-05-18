import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

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
    noticia: Noticia;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Noticias',
        href: '/noticias',
    },
    {
        title: 'Detalle de Noticia',
        href: '#',
    },
];

export default function Show({ noticia }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={noticia.titulo} />
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
                <div className="mb-6">
                    <Link href="/VerNoticias">
                        <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Noticias
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl">
                    {noticia.imagen_path && (
                        <div className="w-full h-96 relative overflow-hidden">
                            <img
                                src={`/${noticia.imagen_path}`}
                                alt={noticia.titulo}
                                className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 text-sm flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                {noticia.categoria || 'General'}
                            </Badge>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(noticia.fecha_publicacion).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {noticia.titulo}
                        </h1>

                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span>Por</span>
                            <span className="font-semibold">{noticia.autor.name}</span>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}