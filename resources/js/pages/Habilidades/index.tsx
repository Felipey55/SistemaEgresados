import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2, Heart, Briefcase, Database, Brain, Cloud, Plus, X, Save, ArrowLeft, LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Habilidades',
        href: '/habilidades',
    },
];

type HabilidadType = {
    id: number;
    nombre: string;
    tipo: string;
};

type HabilidadesProps = {
    habilidadesTecnicas: HabilidadType[];
    habilidadesBlandas: HabilidadType[];
    habilidadesSeleccionadas: number[];
};

export default function EditarHabilidades({ habilidadesTecnicas, habilidadesBlandas, habilidadesSeleccionadas }: HabilidadesProps) {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [customHardSkill, setCustomHardSkill] = useState('');
    const [customSoftSkill, setCustomSoftSkill] = useState('');
    const [showCustomHardSkill, setShowCustomHardSkill] = useState(false);
    const [showCustomSoftSkill, setShowCustomSoftSkill] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [habilidadesPersonalizadas, setHabilidadesPersonalizadas] = useState<HabilidadType[]>([]);
    
    // Nuevo estado para controlar la animación de los iconos
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    useEffect(() => {
        // Inicializar el estado de habilidades personalizadas sin preseleccionar ninguna habilidad
        const personalizadas: HabilidadType[] = [];
        
        if (habilidadesSeleccionadas.length > 0) {
            habilidadesSeleccionadas.forEach(id => {
                const tecnica = habilidadesTecnicas.find(h => h.id === id);
                const blanda = habilidadesBlandas.find(h => h.id === id);
                
                if (tecnica || blanda) {
                    if (tecnica) {
                        personalizadas.push(tecnica);
                    } else if (blanda) {
                        personalizadas.push(blanda);
                    }
                }
            });
        }
        
        setHabilidadesPersonalizadas(personalizadas);
    }, [habilidadesSeleccionadas, habilidadesTecnicas, habilidadesBlandas]);

    // Función para activar la animación del icono
    const animateIcon = (iconId: string) => {
        setActiveIcon(iconId);
        setTimeout(() => setActiveIcon(null), 2000);
    };

    // Función para obtener la clase de animación
    const getAnimationClass = (iconId: string) => {
        if (activeIcon !== iconId) return '';
        // Ahora todos los iconos tendrán la animación de salto
        return 'animate-bounce transform duration-1000';
    };

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setSelectedSkills([...selectedSkills, value]);
            if (value === 'hard-otra') {
                setShowCustomHardSkill(true);
                animateIcon('hard-otra-icon');
            }
            if (value === 'soft-otra') {
                setShowCustomSoftSkill(true);
                animateIcon('soft-otra-icon');
            }
        } else {
            setSelectedSkills(selectedSkills.filter(skill => skill !== value));
            if (value === 'hard-otra') {
                setShowCustomHardSkill(false);
                setCustomHardSkill('');
            }
            if (value === 'soft-otra') {
                setShowCustomSoftSkill(false);
                setCustomSoftSkill('');
            }
        }
    };

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

    const handleRemoveHabilidad = async (id: number) => {
        try {
            await axios.post(route('habilidades.eliminar'), { habilidad_id: id });
            setHabilidadesPersonalizadas(habilidadesPersonalizadas.filter(h => h.id !== id));
            showNotification('Habilidad eliminada correctamente', true);
        } catch (error: any) {
            console.error('Error al eliminar habilidad:', error);
            showNotification('Error al eliminar la habilidad', false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post(route('habilidades.actualizar'), {
                habilidades: selectedSkills,
                custom_hard_skill: customHardSkill,
                custom_soft_skill: customSoftSkill
            });

            setMessage({ text: response.data.message, type: 'success' });
            showNotification('Habilidades guardadas exitosamente', true);
            
            setTimeout(() => {
                window.location.href = route('egresado.perfil');
            }, 2000);
        } catch (error: any) {
            console.error('Error al guardadas habilidades:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Error al guardadas habilidades', 
                type: 'error' 
            });
            showNotification('Error al guardadas las habilidades. Verifique los datos.', false);
        } finally {
            setIsSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Habilidades" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
                        <h1 className="text-2xl font-bold text-white mb-2">Habilidades</h1>
                        <p className="text-blue-100 dark:text-blue-200">Selecciona y personaliza tus habilidades profesionales</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 dark:bg-gray-800">
                        {/* Habilidades Técnicas */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Code2 
                                    id="code-icon"
                                    className={`h-6 w-6 text-emerald-600 transform transition-transform duration-300 ${getAnimationClass('code-icon')}`}
                                    onMouseOver={() => animateIcon('code-icon')}
                                />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Habilidades Técnicas</h2>
                            </div>

                            {/* Lenguajes de Programación */}
                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code2 
                                        id="lang-icon"
                                        className={`h-5 w-5 text-blue-600 transform transition-transform duration-300 ${getAnimationClass('lang-icon')}`}
                                        onMouseOver={() => animateIcon('lang-icon')}
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Lenguajes de Programación</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Java', 'Python', 'C / C++', 'JavaScript / TypeScript',
                                        'PHP', 'C#', 'Kotlin / Swift', 'Go / Rust'
                                    ].map(lang => (
                                        <label key={lang} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`lang-${lang}`} 
                                                checked={selectedSkills.includes(`lang-${lang}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`lang-${lang}-icon`)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Desarrollo Web */}
                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase 
                                        id="web-icon"
                                        className={`h-5 w-5 text-purple-600 transform transition-transform duration-300 ${getAnimationClass('web-icon')}`}
                                        onMouseOver={() => animateIcon('web-icon')}
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Desarrollo Web y Móvil</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'HTML / CSS', 'React', 'Angular', 'Vue',
                                        'Node.js', 'Laravel', 'Django', 'Spring',
                                        'Flutter', 'React Native', 'REST API', 'GraphQL'
                                    ].map(tech => (
                                        <label key={tech} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`web-${tech}`} 
                                                checked={selectedSkills.includes(`web-${tech}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`web-${tech}-icon`)}
                                                className="h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{tech}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Bases de Datos */}
                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <Database 
                                        id="db-icon"
                                        className={`h-5 w-5 text-amber-600 transform transition-transform duration-300 ${getAnimationClass('db-icon')}`}
                                        onMouseOver={() => animateIcon('db-icon')}
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Bases de Datos</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server',
                                        'MongoDB', 'Firebase', 'Redis', 'Cassandra'
                                    ].map(db => (
                                        <label key={db} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`db-${db}`} 
                                                checked={selectedSkills.includes(`db-${db}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`db-${db}-icon`)}
                                                className="h-4 w-4 text-amber-600 rounded border-gray-300 dark:border-gray-600 focus:ring-amber-500 dark:focus:ring-amber-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{db}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* IA y Machine Learning */}
                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <Brain 
                                        id="ai-icon"
                                        className={`h-5 w-5 text-rose-600 transform transition-transform duration-300 ${getAnimationClass('ai-icon')}`}
                                        onMouseOver={() => animateIcon('ai-icon')}
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">IA y Machine Learning</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Machine Learning', 'Deep Learning', 'TensorFlow',
                                        'PyTorch', 'scikit-learn', 'Análisis con Python', 'Big Data'
                                    ].map(ai => (
                                        <label key={ai} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-rose-500 dark:hover:border-rose-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`ai-${ai}`} 
                                                checked={selectedSkills.includes(`ai-${ai}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`ai-${ai}-icon`)}
                                                className="h-4 w-4 text-rose-600 rounded border-gray-300 dark:border-gray-600 focus:ring-rose-500 dark:focus:ring-rose-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{ai}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* DevOps y Cloud */}
                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-4">
                                    <Cloud 
                                        id="cloud-icon"
                                        className={`h-5 w-5 text-cyan-600 transform transition-transform duration-300 ${getAnimationClass('cloud-icon')}`}
                                        onMouseOver={() => animateIcon('cloud-icon')}
                                    />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">DevOps y Cloud</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Docker', 'Kubernetes', 'AWS', 'Azure',
                                        'Google Cloud', 'Jenkins', 'GitHub Actions',
                                        'Terraform', 'Ansible'
                                    ].map(devops => (
                                        <label key={devops} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`devops-${devops}`} 
                                                checked={selectedSkills.includes(`devops-${devops}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`devops-${devops}-icon`)}
                                                className="h-4 w-4 text-cyan-600 rounded border-gray-300 dark:border-gray-600 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{devops}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Habilidad Técnica Personalizada */}
                            <div className="mt-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all">
                                    <input 
                                        type="checkbox" 
                                        value="hard-otra" 
                                        checked={showCustomHardSkill}
                                        onChange={handleSkillChange}
                                        onFocus={() => animateIcon('hard-otra-icon')}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <span className="text-gray-700 dark:text-gray-200">Agregar otra habilidad técnica</span>
                                </label>
                                {showCustomHardSkill && (
                                    <div className="mt-3 pl-10">
                                        <Input
                                            type="text"
                                            value={customHardSkill}
                                            onChange={(e) => setCustomHardSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad técnica"
                                            className="max-w-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Habilidades Blandas */}
                        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <Heart 
                                    id="heart-icon"
                                    className={`h-6 w-6 text-red-600 transform transition-transform duration-300 ${getAnimationClass('heart-icon')}`}
                                    onMouseOver={() => animateIcon('heart-icon')}
                                />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Habilidades Blandas</h2>
                            </div>

                            <Card className="p-6 dark:bg-gray-700 dark:border-gray-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Comunicación efectiva', 'Pensamiento lógico', 'Resolución de problemas',
                                        'Trabajo en equipo', 'Adaptabilidad', 'Gestión del tiempo', 'Liderazgo',
                                        'Empatía', 'Creatividad', 'Ética profesional', 'Aprendizaje continuo',
                                        'Proactividad', 'Tolerancia a la presión', 'Organización', 'Negociación',
                                        'Visión estratégica', 'Documentación de procesos'
                                    ].map(soft => (
                                        <label key={soft} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`soft-${soft}`} 
                                                checked={selectedSkills.includes(`soft-${soft}`)}
                                                onChange={handleSkillChange}
                                                onFocus={() => animateIcon(`soft-${soft}-icon`)}
                                                className="h-4 w-4 text-red-600 rounded border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-200">{soft}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Habilidad Blanda Personalizada */}
                            <div className="mt-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 cursor-pointer transition-all">
                                    <input 
                                        type="checkbox" 
                                        value="soft-otra" 
                                        checked={showCustomSoftSkill}
                                        onChange={handleSkillChange}
                                        onFocus={() => animateIcon('soft-otra-icon')}
                                        className="h-4 w-4 text-red-600 rounded border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                    />
                                    <span className="text-gray-700 dark:text-gray-200">Agregar otra habilidad blanda</span>
                                </label>
                                {showCustomSoftSkill && (
                                    <div className="mt-3 pl-10">
                                        <Input
                                            type="text"
                                            value={customSoftSkill}
                                            onChange={(e) => setCustomSoftSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad blanda"
                                            className="max-w-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lista de habilidades personalizadas */}
                        {habilidadesPersonalizadas.length > 0 && (
                            <div className="mt-8 space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">Mis habilidades personalizadas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {habilidadesPersonalizadas.map((hab) => (
                                        <Badge 
                                            key={hab.id} 
                                            className="px-3 py-1.5 flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            {hab.nombre}
                                            <button 
                                                onClick={() => handleRemoveHabilidad(hab.id)}
                                                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                type="button"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                            <Button 
                                type="submit" 
                                className="px-6 py-2 bg-gradient-to-r from-blue-700 to-purple-700 text-white 
                                    hover:from-blue-500 hover:to-purple-500 
                                    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                    transform transition-all duration-200 ease-in-out
                                    hover:scale-105 active:scale-95
                                    shadow-lg hover:shadow-blue-500/50
                                    flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin">
                                            <LoaderCircle className="h-5 w-5" />
                                        </span>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Guardar Cambios</span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            →
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}