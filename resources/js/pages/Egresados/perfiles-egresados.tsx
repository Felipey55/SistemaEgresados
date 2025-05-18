import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Briefcase, GraduationCap, Code2, Heart, ArrowRight, Calendar, Tag } from 'lucide-react';

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
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    const animateIcon = (iconId: string) => {
        setActiveIcon(iconId);
        setTimeout(() => setActiveIcon(null), 1000);
    };

    const getAnimationClass = (iconId: string) => {
        return activeIcon === iconId ? 'transform transition-all duration-300 -translate-y-1 scale-125' : '';
    };
    
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
                                <h1 className="text-4xl font-bold text-white mb-3 animate-fade-in">Perfiles de Egresados</h1>
                                <p className="text-lg text-white/90 dark:text-gray-200 animate-slide-up">
                                    Descubre el talento profesional de nuestros egresados
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-8 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="search" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Search 
                                        className={`h-5 w-5 text-blue-500 dark:text-blue-400 ${getAnimationClass('search-icon')}`} 
                                    />
                                    Buscar Egresados
                                </label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="h-6 w-6 text-gray-400 animate-pulse" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Buscar por nombre o identificación..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => animateIcon('search-icon')}
                                        className="pl-12 w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 h-12 text-base"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="filterType" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Tag 
                                        className={`h-5 w-5 text-blue-500 dark:text-blue-400 ${getAnimationClass('filter-icon')}`} 
                                    />
                                    Filtrar por Tipo
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    onFocus={() => animateIcon('filter-icon')}
                                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-300 transform hover:scale-105 w-full text-base"
                                >
                                    <option value="todos">Todos los perfiles</option>
                                    <option value="experiencia">Con experiencia</option>
                                    <option value="formacion">Con formación</option>
                                </select>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="skillFilter" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-lg">
                                    <Code2 
                                        className={`h-5 w-5 text-blue-500 dark:text-blue-400 ${getAnimationClass('skill-icon')}`} 
                                    />
                                    Filtrar por Habilidad
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Filtrar por habilidad..."
                                    value={skillFilter}
                                    onChange={(e) => setSkillFilter(e.target.value)}
                                    onFocus={() => animateIcon('skill-icon')}
                                    className="w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 h-12 text-base"
                                />
                            </div>
                            
                            {(searchTerm || filterType !== 'todos' || skillFilter) && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType('todos');
                                        setSkillFilter('');
                                    }}
                                    className="bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg hover:shadow-blue-500/50 transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>

                        <div className="border-t border-border dark:border-border pt-6">
                            {filteredEgresados.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-muted-foreground">No se encontraron egresados con los criterios de búsqueda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredEgresados.map((egresado) => (
                                        <Card key={egresado.id} className="group overflow-hidden bg-white dark:bg-gray-800
                                            transform transition-all duration-300 ease-in-out hover:scale-[1.02]
                                            hover:shadow-2xl border-2 border-gray-200 dark:border-gray-600 
                                            hover:border-blue-500 dark:hover:border-blue-400 rounded-xl">
                                            <div className="p-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-110 text-sm font-medium">
                                                            <Tag className="h-4 w-4 mr-2" />
                                                            {egresado.experiencia ? 'Con Experiencia' : 'Sin Experiencia'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-2">
                                                    {egresado.nombre}
                                                </h2>
                                                
                                                <div className="space-y-1">
                                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                        <span className="font-medium">Identificación:</span> {egresado.identificacion}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                        <span className="font-medium">Email:</span> {egresado.email}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                        <span className="font-medium">Celular:</span> {egresado.celular}
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <Code2 className="h-5 w-5 text-blue-500" />
                                                        <h3 className="text-lg font-medium">Habilidades Técnicas</h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {egresado.habilidades.tecnicas.map((habilidad, index) => (
                                                            <Badge key={index} className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200 hover:scale-110 text-sm font-medium">
                                                                {habilidad}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <Heart className="h-5 w-5 text-red-500" />
                                                        <h3 className="text-lg font-medium">Habilidades Blandas</h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {egresado.habilidades.blandas.map((habilidad, index) => (
                                                            <Badge key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-110 text-sm font-medium">
                                                                {habilidad}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {egresado.formacion && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                            <GraduationCap className="h-5 w-5 text-indigo-500" />
                                                            <h3 className="text-lg font-medium">Formación</h3>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                            <span className="font-medium">Título:</span> {egresado.formacion.titulo}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                            <span className="font-medium">Institución:</span> {egresado.formacion.institucion}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {egresado.experiencia && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                            <Briefcase className="h-5 w-5 text-amber-500" />
                                                            <h3 className="text-lg font-medium">Experiencia</h3>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                            <span className="font-medium">Empresa:</span> {egresado.experiencia.empresa}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                            <span className="font-medium">Modalidad:</span> {egresado.experiencia.modalidad}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="pt-6 mt-auto border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center justify-end">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => window.location.href = route('egresado.detalle', { id: egresado.id })}
                                                            className="px-6 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transform transition-all duration-300 hover:scale-105 hover:translate-x-1 hover:shadow-lg font-medium text-base flex items-center gap-2"
                                                        >
                                                            Ver Perfil Completo
                                                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}