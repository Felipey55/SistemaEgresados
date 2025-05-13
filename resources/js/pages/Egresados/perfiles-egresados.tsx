import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Briefcase, GraduationCap, Code2, Heart } from 'lucide-react';
import { Select } from '@/components/ui/select';

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
    const [filterType, setFilterType] = useState('todos');
    const [skillFilter, setSkillFilter] = useState('');
    
    // Filtrar egresados por múltiples criterios
    const filteredEgresados = egresados.filter(egresado => {
        const matchesSearch = egresado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             egresado.identificacion.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'todos' ||
            (filterType === 'experiencia' && egresado.experiencia) ||
            (filterType === 'formacion' && egresado.formacion);

        const matchesSkill = !skillFilter ||
            egresado.habilidades.tecnicas.some(h => h.toLowerCase().includes(skillFilter.toLowerCase())) ||
            egresado.habilidades.blandas.some(h => h.toLowerCase().includes(skillFilter.toLowerCase()));

        return matchesSearch && matchesType && matchesSkill;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfiles de Egresados" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden sm:rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:hover:shadow-blue-500/10">
                    <div className="px-6 py-8 sm:px-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/50 dark:to-indigo-900/50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Perfiles de Egresados</h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">Descubre el talento profesional de nuestros egresados</p>
                            </div>
                        </div>
                        
                        {/* Filtros avanzados */}
                        <div className="mt-8 space-y-4 md:space-y-0 md:flex md:gap-4 items-start backdrop-blur-sm p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre o identificación..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 w-full focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-4">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="bg-white/75 dark:bg-gray-800/75 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all hover:bg-white dark:hover:bg-gray-800"
                                >
                                    <option value="todos">Todos los perfiles</option>
                                    <option value="experiencia">Con experiencia</option>
                                    <option value="formacion">Con formación</option>
                                </select>
                                
                                <Input
                                    type="text"
                                    placeholder="Filtrar por habilidad..."
                                    value={skillFilter}
                                    onChange={(e) => setSkillFilter(e.target.value)}
                                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                
                                {(searchTerm || filterType !== 'todos' || skillFilter) && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterType('todos');
                                            setSkillFilter('');
                                        }}
                                        className="px-4 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {filteredEgresados.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">No se encontraron egresados con los criterios de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEgresados.map((egresado) => (
                                <Card key={egresado.id} className="group overflow-hidden bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm transform hover:-translate-y-1">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">{egresado.nombre}</h2>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">{egresado.identificacion}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{egresado.email}</p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{egresado.celular}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Code2 className="h-4 w-4" />
                                                <h3 className="text-sm font-medium">Habilidades Técnicas</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {egresado.habilidades.tecnicas.map((habilidad, index) => (
                                                    <Badge key={index} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-sm">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-gray-700 mt-3">
                                                <Heart className="h-4 w-4" />
                                                <h3 className="text-sm font-medium">Habilidades Blandas</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {egresado.habilidades.blandas.map((habilidad, index) => (
                                                    <Badge key={index} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-sm">
                                                        {habilidad}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {egresado.formacion && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <GraduationCap className="h-4 w-4" />
                                                    <h3 className="text-sm font-medium">Formación</h3>
                                                </div>
                                                <p className="text-gray-900 dark:text-white text-sm">{egresado.formacion.titulo}</p>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">{egresado.formacion.institucion}</p>
                                            </div>
                                        )}
                                        
                                        {egresado.experiencia && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Briefcase className="h-4 w-4" />
                                                    <h3 className="text-sm font-medium">Experiencia</h3>
                                                </div>
                                                <p className="text-gray-900 dark:text-white text-sm">{egresado.experiencia.empresa}</p>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">{egresado.experiencia.modalidad}</p>
                                            </div>
                                        )}
                                        
                                        <div className="pt-4">
                                            <Link href={route('egresado.detalle', { id: egresado.id })}>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 border-0 rounded-xl shadow-lg hover:shadow-blue-500/20 transform hover:scale-[1.02]"
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