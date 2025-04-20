import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil del Egresado',
        href: '/Egresados/perfil',
    },
    {
        title: 'Editar Habilidades',
        href: '/habilidades/editar',
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

    // Al cargar la página, preseleccionamos las habilidades del egresado
    useEffect(() => {
        if (habilidadesSeleccionadas.length > 0) {
            const preselectedSkills: string[] = [];
            const personalizadas: HabilidadType[] = [];
            
            habilidadesSeleccionadas.forEach(id => {
                const tecnica = habilidadesTecnicas.find(h => h.id === id);
                const blanda = habilidadesBlandas.find(h => h.id === id);
                
                if (tecnica) {
                    // Determinamos el prefijo correcto basado en el nombre de la habilidad
                    if (tecnica.nombre.includes('Java') || tecnica.nombre.includes('Python') || 
                        tecnica.nombre.includes('C#') || tecnica.nombre.includes('PHP') || 
                        tecnica.nombre.includes('JavaScript') || tecnica.nombre.includes('TypeScript') || 
                        tecnica.nombre.includes('Kotlin') || tecnica.nombre.includes('Swift') || 
                        tecnica.nombre.includes('Go') || tecnica.nombre.includes('Rust') || 
                        tecnica.nombre.includes('C / C++')) {
                        preselectedSkills.push(`lang-${tecnica.nombre}`);
                    } else if (tecnica.nombre.includes('HTML') || tecnica.nombre.includes('CSS') || 
                              tecnica.nombre.includes('React') || tecnica.nombre.includes('Angular') || 
                              tecnica.nombre.includes('Vue') || tecnica.nombre.includes('Node.js') || 
                              tecnica.nombre.includes('Laravel') || tecnica.nombre.includes('Django') || 
                              tecnica.nombre.includes('Spring') || tecnica.nombre.includes('Flutter') || 
                              tecnica.nombre.includes('Native') || tecnica.nombre.includes('API') || 
                              tecnica.nombre.includes('GraphQL')) {
                        preselectedSkills.push(`web-${tecnica.nombre}`);
                    } else if (tecnica.nombre.includes('MySQL') || tecnica.nombre.includes('PostgreSQL') || 
                              tecnica.nombre.includes('Oracle') || tecnica.nombre.includes('SQL Server') || 
                              tecnica.nombre.includes('MongoDB') || tecnica.nombre.includes('Firebase') || 
                              tecnica.nombre.includes('Redis') || tecnica.nombre.includes('Cassandra')) {
                        preselectedSkills.push(`db-${tecnica.nombre}`);
                    } else if (tecnica.nombre.includes('Machine Learning') || tecnica.nombre.includes('Deep Learning') || 
                              tecnica.nombre.includes('TensorFlow') || tecnica.nombre.includes('PyTorch') || 
                              tecnica.nombre.includes('scikit-learn') || tecnica.nombre.includes('Análisis con Python') || 
                              tecnica.nombre.includes('Big Data')) {
                        preselectedSkills.push(`ai-${tecnica.nombre}`);
                    } else if (tecnica.nombre.includes('Docker') || tecnica.nombre.includes('Kubernetes') || 
                              tecnica.nombre.includes('AWS') || tecnica.nombre.includes('Azure') || 
                              tecnica.nombre.includes('Google Cloud') || tecnica.nombre.includes('Jenkins') || 
                              tecnica.nombre.includes('GitHub Actions') || tecnica.nombre.includes('Terraform') || 
                              tecnica.nombre.includes('Ansible')) {
                        preselectedSkills.push(`devops-${tecnica.nombre}`);
                    } else {
                        // Si no coincide con ninguna categoría, es una habilidad personalizada
                        personalizadas.push(tecnica);
                    }
                } else if (blanda) {
                    // Verificar si es una habilidad blanda estándar
                    const habilidadesBlandasEstandar = [
                        'Comunicación efectiva', 'Pensamiento lógico', 'Resolución de problemas',
                        'Trabajo en equipo', 'Adaptabilidad', 'Gestión del tiempo', 'Liderazgo',
                        'Empatía', 'Creatividad', 'Ética profesional', 'Aprendizaje continuo',
                        'Proactividad', 'Tolerancia a la presión', 'Organización', 'Negociación',
                        'Visión estratégica', 'Documentación de procesos'
                    ];
                    
                    if (habilidadesBlandasEstandar.includes(blanda.nombre)) {
                        preselectedSkills.push(`soft-${blanda.nombre}`);
                    } else {
                        // Si no es estándar, es una habilidad personalizada
                        personalizadas.push(blanda);
                    }
                }
            });
            
            setSelectedSkills(preselectedSkills);
            setHabilidadesPersonalizadas(personalizadas);
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

    const handleRemoveHabilidad = async (id: number) => {
        try {
            const response = await axios.post(route('habilidades.eliminar'), {
                habilidad_id: id
            });

            // Actualizar la lista de habilidades personalizadas
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
            showNotification('Habilidades actualizadas exitosamente', true);
            
            // Redirigir al perfil del egresado después de guardar exitosamente
            setTimeout(() => {
                window.location.href = route('egresado.perfil');
            }, 2000);
        } catch (error: any) {
            console.error('Error al actualizar habilidades:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Error al actualizar habilidades', 
                type: 'error' 
            });
            showNotification('Error al actualizar las habilidades. Verifique los datos.', false);
        } finally {
            setIsSubmitting(false);
            
            // Desplazar hacia arriba para mostrar el mensaje
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Habilidades" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Editar Habilidades</h1>
                    
                    {message.text && (
                        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    {/* Sección de habilidades personalizadas */}
                    {habilidadesPersonalizadas.length > 0 && (
                        <div className="border border-gray-600 rounded-lg p-6 bg-gray-700 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Habilidades Personalizadas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {habilidadesPersonalizadas.map(habilidad => (
                                    <div key={habilidad.id} className="flex items-center justify-between bg-gray-600 p-3 rounded-md">
                                        <div>
                                            <span className="text-white">{habilidad.nombre}</span>
                                            <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
                                                {habilidad.tipo === 'tecnica' ? 'Técnica' : 'Blanda'}
                                            </span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveHabilidad(habilidad.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            {/* Sección de Habilidades Duras */}
                            <div className="border border-gray-600 rounded-lg p-6 bg-gray-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Habilidades Técnicas</h2>
                                
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
                                    <h3 className="text-lg font-medium text-gray-100 mb-3">Inteligencia Artificial y Ciencia de Datos</h3>
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
                                    <h3 className="text-lg font-medium text-gray-100 mb-3">DevOps y Cloud</h3>
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
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-200">Comunicación efectiva</span>
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
                                        <span className="text-gray-200">Otra habilidad blanda</span>
                                    </label>
                                </div>
                                
                                {showCustomSoftSkill && (
                                    <div className="mt-3">
                                        <input 
                                            type="text" 
                                            value={customSoftSkill}
                                            onChange={(e) => setCustomSoftSkill(e.target.value)}
                                            placeholder="Especifique otra habilidad blanda"
                                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Habilidades'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}