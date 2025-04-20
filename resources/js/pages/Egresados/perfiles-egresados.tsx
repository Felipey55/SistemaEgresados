import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfiles Egresados',
        href: '/PerfilesEgresados',
    },
];

type Egresado = {
    id: number;
    nombre: string;
    identificacion: string;
    email: string;
    celular: string;
    formacion: {
        titulo: string;
        institucion: string;
    } | null;
    experiencia: {
        empresa: string;
        modalidad: string;
    } | null;
    habilidades: {
        tecnicas: string[];
        blandas: string[];
    };
};

type Props = {
    egresados: Egresado[];
};

export default function PerfilesEgresados({ egresados }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filtrar egresados por nombre o cédula
    const filteredEgresados = egresados.filter(egresado => 
        egresado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        egresado.identificacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfiles de Egresados" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-2xl font-bold text-white">Perfiles de Egresados</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-400">Listado de todos los egresados registrados en el sistema</p>
                        
                        {/* Filtro de búsqueda */}
                        <div className="mt-4 flex gap-2">
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o cédula..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md bg-gray-800 text-white border-gray-700"
                            />
                            {searchTerm && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSearchTerm('')}
                                    className="px-3 border-gray-700 text-white hover:bg-gray-800"
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    {filteredEgresados.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-400">No se encontraron egresados con los criterios de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEgresados.map((egresado) => (
                                <Card key={egresado.id} className="overflow-hidden bg-gray-900 text-white border border-gray-700 hover:border-gray-500 transition-colors">
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold">{egresado.nombre}</h2>
                                        <p className="text-gray-300">{egresado.identificacion}</p>
                                        
                                        <div className="mt-4">
                                            <h3 className="text-gray-300">Contacto</h3>
                                            <p className="text-white">{egresado.email}</p>
                                            <p className="text-white">{egresado.celular}</p>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h3 className="text-gray-300">Habilidades</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {egresado.habilidades.tecnicas.map((habilidad, index) => (
                                                    <Badge key={index} className="bg-green-600 text-white border-green-700">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                                {egresado.habilidades.blandas.map((habilidad, index) => (
                                                    <Badge key={index} className="bg-blue-600 text-white border-blue-700">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {egresado.formacion && (
                                            <div className="mt-4">
                                                <h3 className="text-gray-300">Formación</h3>
                                                <p className="text-white">{egresado.formacion.titulo}</p>
                                                <p className="text-gray-400">{egresado.formacion.institucion}</p>
                                            </div>
                                        )}
                                        
                                        {egresado.experiencia && (
                                            <div className="mt-4">
                                                <h3 className="text-gray-300">Experiencia</h3>
                                                <p className="text-white">{egresado.experiencia.empresa}</p>
                                                <p className="text-gray-400">{egresado.experiencia.modalidad}</p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4">
                                            <Link href={route('egresado.detalle', { id: egresado.id })}>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full border-gray-600 text-white hover:bg-gray-800"
                                                >
                                                    Ver Perfil Completo
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}