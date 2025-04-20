import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

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

export default function Habilidades({ habilidadesTecnicas, habilidadesBlandas, habilidadesSeleccionadas }: HabilidadesProps) {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [customHardSkill, setCustomHardSkill] = useState('');

    const [customSoftSkill, setCustomSoftSkill] = useState('');
    const [showCustomHardSkill, setShowCustomHardSkill] = useState(false);
    const [showCustomSoftSkill, setShowCustomSoftSkill] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Al cargar la página, no preseleccionamos ninguna habilidad
    // Solo cargamos las habilidades seleccionadas si hay un parámetro específico
    useEffect(() => {
        // Si no hay habilidades seleccionadas o si el usuario está regresando a la página,
        // dejamos el array vacío para que nada esté seleccionado
        if (window.location.search.includes('mostrar_seleccionadas=true') && habilidadesSeleccionadas.length > 0) {
            const preselectedSkills: string[] = [];
            
            habilidadesSeleccionadas.forEach(id => {
                const tecnica = habilidadesTecnicas.find(h => h.id === id);
                const blanda = habilidadesBlandas.find(h => h.id === id);
                
                if (tecnica) {
                    preselectedSkills.push(`lang-${tecnica.nombre}`);
                } else if (blanda) {
                    preselectedSkills.push(`soft-${blanda.nombre}`);
                }
            });
            
            setSelectedSkills(preselectedSkills);
        }
    }, [habilidadesSeleccionadas, habilidadesTecnicas, habilidadesBlandas]);

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setSelectedSkills([...selectedSkills, value]);
            
            // Si selecciona "Otra", mostrar el campo de entrada personalizado
            if (value === 'hard-otra') {
                setShowCustomHardSkill(true);
            } else if (value === 'soft-otra') {
                setShowCustomSoftSkill(true);
            }
        } else {
            setSelectedSkills(selectedSkills.filter(skill => skill !== value));
            
            // Si deselecciona "Otra", ocultar el campo de entrada personalizado
            if (value === 'hard-otra') {
                setShowCustomHardSkill(false);
                setCustomHardSkill('');
            } else if (value === 'soft-otra') {
                setShowCustomSoftSkill(false);
                setCustomSoftSkill('');
            }
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post(route('habilidades.agregar'), {
                habilidades: selectedSkills,
                custom_hard_skill: customHardSkill,
                custom_soft_skill: customSoftSkill
            });

            setMessage({ text: response.data.message, type: 'success' });
            showNotification('Habilidades guardadas exitosamente', true);
            
            // Limpiar campos personalizados después de enviar
            setCustomHardSkill('');
            setCustomSoftSkill('');
            setShowCustomHardSkill(false);
            setShowCustomSoftSkill(false);
            
            // Redirigir al perfil del egresado después de guardar exitosamente
            setTimeout(() => {
                window.location.href = route('egresado.perfil');
            }, 2000);
        } catch (error: any) {
            console.error('Error al guardar habilidades:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Error al guardar habilidades', 
                type: 'error' 
            });
            showNotification('Error al guardar las habilidades. Verifique los datos.', false);
        } finally {
            setIsSubmitting(false);
            
            // Desplazar hacia arriba para mostrar el mensaje
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Módulo de Habilidades" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Módulo de Habilidades</h1>
                    
                    {message.text && (
                        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            {/* Sección de Habilidades Duras */}
                            <div className="border border-gray-600 rounded-lg p-6 bg-gray-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Habilidades Duras</h2>
                                
                                {/* Grupo: Lenguajes de Programación */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-100 mb-3">Lenguajes de Programación</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-Java" 
                                                checked={selectedSkills.includes('lang-Java')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Java</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-Python" 
                                                checked={selectedSkills.includes('lang-Python')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Python</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-C / C++" 
                                                checked={selectedSkills.includes('lang-C / C++')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">C / C++</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-JavaScript / TypeScript" 
                                                checked={selectedSkills.includes('lang-JavaScript / TypeScript')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">JavaScript / TypeScript</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-PHP" 
                                                checked={selectedSkills.includes('lang-PHP')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">PHP</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-C#" 
                                                checked={selectedSkills.includes('lang-C#')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">C#</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-Kotlin / Swift" 
                                                checked={selectedSkills.includes('lang-Kotlin / Swift')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Kotlin / Swift</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="lang-Go / Rust" 
                                                checked={selectedSkills.includes('lang-Go / Rust')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Go / Rust</span>
                                        </label>

                                    </div>
                                    {showCustomHardSkill && (
                                        <div className="mt-3">
                                            <input 
                                                type="text" 
                                                value={customHardSkill}
                                                onChange={(e) => setCustomHardSkill(e.target.value)}
                                                placeholder="Especifique otra habilidad técnica"
                                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Grupo: Desarrollo Web y Móvil */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-100 mb-3">Desarrollo Web y Móvil</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="web-HTML / CSS" 
                                                checked={selectedSkills.includes('web-HTML / CSS')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">HTML / CSS</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="web-React / Angular / Vue.js" 
                                                checked={selectedSkills.includes('web-React / Angular / Vue.js')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">React / Angular / Vue.js</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="web-Node.js / Laravel / Django / Spring Boot" 
                                                checked={selectedSkills.includes('web-Node.js / Laravel / Django / Spring Boot')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Node.js / Laravel / Django / Spring Boot</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="web-Flutter / React Native" 
                                                checked={selectedSkills.includes('web-Flutter / React Native')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Flutter / React Native</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="web-RESTful APIs / GraphQL" 
                                                checked={selectedSkills.includes('web-RESTful APIs / GraphQL')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">RESTful APIs / GraphQL</span>
                                        </label>

                                    </div>

                                </div>
                                
                                {/* Grupo: Bases de Datos */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-100 mb-3">Bases de Datos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="db-MySQL / PostgreSQL" 
                                                checked={selectedSkills.includes('db-MySQL / PostgreSQL')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">MySQL / PostgreSQL</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="db-Oracle / SQL Server" 
                                                checked={selectedSkills.includes('db-Oracle / SQL Server')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Oracle / SQL Server</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="db-MongoDB / Firebase" 
                                                checked={selectedSkills.includes('db-MongoDB / Firebase')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">MongoDB / Firebase</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="db-Redis / Cassandra" 
                                                checked={selectedSkills.includes('db-Redis / Cassandra')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Redis / Cassandra</span>
                                        </label>

                                    </div>

                                </div>
                                
                                {/* Grupo: Inteligencia Artificial y Ciencia de Datos */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">Inteligencia Artificial y Ciencia de Datos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="ai-Machine Learning / Deep Learning" 
                                                checked={selectedSkills.includes('ai-Machine Learning / Deep Learning')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Machine Learning / Deep Learning</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="ai-TensorFlow / PyTorch / scikit-learn" 
                                                checked={selectedSkills.includes('ai-TensorFlow / PyTorch / scikit-learn')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">TensorFlow / PyTorch / scikit-learn</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="ai-Análisis con Python o R" 
                                                checked={selectedSkills.includes('ai-Análisis con Python o R')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Análisis con Python o R</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="ai-Big Data: Hadoop / Spark" 
                                                checked={selectedSkills.includes('ai-Big Data: Hadoop / Spark')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Big Data: Hadoop / Spark</span>
                                        </label>

                                    </div>

                                </div>
                                
                                {/* Grupo: DevOps y Cloud */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">DevOps y Cloud</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="devops-Docker / Kubernetes" 
                                                checked={selectedSkills.includes('devops-Docker / Kubernetes')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Docker / Kubernetes</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="devops-AWS / Azure / Google Cloud" 
                                                checked={selectedSkills.includes('devops-AWS / Azure / Google Cloud')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">AWS / Azure / Google Cloud</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="devops-Jenkins / GitHub Actions" 
                                                checked={selectedSkills.includes('devops-Jenkins / GitHub Actions')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Jenkins / GitHub Actions</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                value="devops-Terraform / Ansible" 
                                                checked={selectedSkills.includes('devops-Terraform / Ansible')}
                                                onChange={handleSkillChange}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-gray-200">Terraform / Ansible</span>
                                        </label>

                                    </div>

                                </div>
                                
                                {/* Opción "Otra" para Habilidades Duras */}
                                <div className="mt-6">
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="hard-otra" 
                                            checked={selectedSkills.includes('hard-otra')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Otra habilidad técnica</span>
                                    </label>
                                    {showCustomHardSkill && (
                                        <div className="mt-3">
                                            <input 
                                                type="text" 
                                                value={customHardSkill}
                                                onChange={(e) => setCustomHardSkill(e.target.value)}
                                                placeholder="Especifique otra habilidad técnica"
                                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Sección de Habilidades Blandas */}
                            <div className="border border-gray-600 rounded-lg p-6 bg-gray-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Habilidades Blandas</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Comunicación efectiva" 
                                            checked={selectedSkills.includes('soft-Comunicación efectiva')}
                                            onChange={handleSkillChange}
                                            className="rounded"
                                        />
                                        <span>Comunicación efectiva</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Pensamiento lógico" 
                                            checked={selectedSkills.includes('soft-Pensamiento lógico')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Pensamiento lógico</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Resolución de problemas" 
                                            checked={selectedSkills.includes('soft-Resolución de problemas')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Resolución de problemas</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Trabajo en equipo" 
                                            checked={selectedSkills.includes('soft-Trabajo en equipo')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Trabajo en equipo</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Adaptabilidad" 
                                            checked={selectedSkills.includes('soft-Adaptabilidad')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Adaptabilidad</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Gestión del tiempo" 
                                            checked={selectedSkills.includes('soft-Gestión del tiempo')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Gestión del tiempo</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Liderazgo" 
                                            checked={selectedSkills.includes('soft-Liderazgo')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Liderazgo</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Empatía" 
                                            checked={selectedSkills.includes('soft-Empatía')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Empatía</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Creatividad" 
                                            checked={selectedSkills.includes('soft-Creatividad')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Creatividad</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Ética profesional" 
                                            checked={selectedSkills.includes('soft-Ética profesional')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Ética profesional</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Aprendizaje continuo" 
                                            checked={selectedSkills.includes('soft-Aprendizaje continuo')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Aprendizaje continuo</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Proactividad" 
                                            checked={selectedSkills.includes('soft-Proactividad')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Proactividad</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Tolerancia a la presión" 
                                            checked={selectedSkills.includes('soft-Tolerancia a la presión')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Tolerancia a la presión</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Organización" 
                                            checked={selectedSkills.includes('soft-Organización')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Organización</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Negociación" 
                                            checked={selectedSkills.includes('soft-Negociación')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Negociación</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Visión estratégica" 
                                            checked={selectedSkills.includes('soft-Visión estratégica')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Visión estratégica</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-Documentación de procesos" 
                                            checked={selectedSkills.includes('soft-Documentación de procesos')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Documentación de procesos</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value="soft-otra" 
                                            checked={selectedSkills.includes('soft-otra')}
                                            onChange={handleSkillChange}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Otra</span>
                                    </label>
                                </div>
                                {showCustomSoftSkill && (
                                    <div className="mt-3">
                                        <input 
                                            type="text" 
                                            value={customSoftSkill}
                                            onChange={(e) => setCustomSoftSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad blanda"
                                            className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Habilidades'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}