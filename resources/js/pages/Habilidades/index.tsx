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
import { Code2, Heart, Briefcase, Database, Brain, Cloud, Plus, X, Save, ArrowLeft } from 'lucide-react';

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

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setSelectedSkills([...selectedSkills, value]);
            if (value === 'hard-otra') setShowCustomHardSkill(true);
            if (value === 'soft-otra') setShowCustomSoftSkill(true);
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
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                        <h1 className="text-2xl font-bold text-white mb-2">Habilidades</h1>
                        <p className="text-blue-100">Selecciona y personaliza tus habilidades profesionales</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Habilidades Técnicas */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Code2 className="h-6 w-6 text-emerald-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Habilidades Técnicas</h2>
                            </div>

                            {/* Lenguajes de Programación */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code2 className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-medium text-gray-900">Lenguajes de Programación</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Java', 'Python', 'C / C++', 'JavaScript / TypeScript',
                                        'PHP', 'C#', 'Kotlin / Swift', 'Go / Rust'
                                    ].map(lang => (
                                        <label key={lang} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`lang-${lang}`} 
                                                checked={selectedSkills.includes(`lang-${lang}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Desarrollo Web */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-medium text-gray-900">Desarrollo Web y Móvil</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'HTML / CSS', 'React', 'Angular', 'Vue',
                                        'Node.js', 'Laravel', 'Django', 'Spring',
                                        'Flutter', 'React Native', 'REST API', 'GraphQL'
                                    ].map(tech => (
                                        <label key={tech} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`web-${tech}`} 
                                                checked={selectedSkills.includes(`web-${tech}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                            />
                                            <span className="text-gray-700">{tech}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Bases de Datos */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Database className="h-5 w-5 text-amber-600" />
                                    <h3 className="text-lg font-medium text-gray-900">Bases de Datos</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server',
                                        'MongoDB', 'Firebase', 'Redis', 'Cassandra'
                                    ].map(db => (
                                        <label key={db} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`db-${db}`} 
                                                checked={selectedSkills.includes(`db-${db}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                                            />
                                            <span className="text-gray-700">{db}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* IA y Machine Learning */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Brain className="h-5 w-5 text-rose-600" />
                                    <h3 className="text-lg font-medium text-gray-900">IA y Machine Learning</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Machine Learning', 'Deep Learning', 'TensorFlow',
                                        'PyTorch', 'scikit-learn', 'Análisis con Python', 'Big Data'
                                    ].map(ai => (
                                        <label key={ai} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`ai-${ai}`} 
                                                checked={selectedSkills.includes(`ai-${ai}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                                            />
                                            <span className="text-gray-700">{ai}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* DevOps y Cloud */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Cloud className="h-5 w-5 text-cyan-600" />
                                    <h3 className="text-lg font-medium text-gray-900">DevOps y Cloud</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Docker', 'Kubernetes', 'AWS', 'Azure',
                                        'Google Cloud', 'Jenkins', 'GitHub Actions',
                                        'Terraform', 'Ansible'
                                    ].map(devops => (
                                        <label key={devops} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`devops-${devops}`} 
                                                checked={selectedSkills.includes(`devops-${devops}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                                            />
                                            <span className="text-gray-700">{devops}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Habilidad Técnica Personalizada */}
                            <div className="mt-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                    <input 
                                        type="checkbox" 
                                        value="hard-otra" 
                                        checked={showCustomHardSkill}
                                        onChange={handleSkillChange}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Agregar otra habilidad técnica</span>
                                </label>
                                {showCustomHardSkill && (
                                    <div className="mt-3 pl-10">
                                        <Input
                                            type="text"
                                            value={customHardSkill}
                                            onChange={(e) => setCustomHardSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad técnica"
                                            className="max-w-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Habilidades Blandas */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <Heart className="h-6 w-6 text-red-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Habilidades Blandas</h2>
                            </div>

                            <Card className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        'Comunicación efectiva', 'Pensamiento lógico', 'Resolución de problemas',
                                        'Trabajo en equipo', 'Adaptabilidad', 'Gestión del tiempo', 'Liderazgo',
                                        'Empatía', 'Creatividad', 'Ética profesional', 'Aprendizaje continuo',
                                        'Proactividad', 'Tolerancia a la presión', 'Organización', 'Negociación',
                                        'Visión estratégica', 'Documentación de procesos'
                                    ].map(soft => (
                                        <label key={soft} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                            <input 
                                                type="checkbox" 
                                                value={`soft-${soft}`} 
                                                checked={selectedSkills.includes(`soft-${soft}`)}
                                                onChange={handleSkillChange}
                                                className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="text-gray-700">{soft}</span>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            {/* Habilidad Blanda Personalizada */}
                            <div className="mt-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                                    <input 
                                        type="checkbox" 
                                        value="soft-otra" 
                                        checked={showCustomSoftSkill}
                                        onChange={handleSkillChange}
                                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="text-gray-700">Agregar otra habilidad blanda</span>
                                </label>
                                {showCustomSoftSkill && (
                                    <div className="mt-3 pl-10">
                                        <Input
                                            type="text"
                                            value={customSoftSkill}
                                            onChange={(e) => setCustomSoftSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad blanda"
                                            className="max-w-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-8 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                            <Button 
                                type="submit" 
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}