import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const [hovered, setHovered] = useState<string | null>(null);
    const [clicked, setClicked] = useState<string | null>(null);

    const handleMouseEnter = (id: string) => setHovered(id);
    const handleMouseLeave = () => setHovered(null);
    const handleClick = (id: string, routeName: string) => {
        if (hovered === id) {
            setClicked(id);
        }
        window.location.href = route(routeName);
    };

    const getButtonClasses = (id: string) => {
        const isActive = hovered === id && clicked === id;
        return `inline-flex items-center justify-center gap-2 rounded-3xl px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out transform 
            ${isActive 
                ? 'bg-white text-black scale-95 shadow-inner' 
                : hovered === id
                    ? 'bg-white/20 text-white scale-105 shadow-lg'
                    : 'bg-white/10 text-white shadow-xl'
            } 
            hover:bg-white/20 
            active:scale-95 
            active:bg-white 
            active:text-black 
            backdrop-blur-xl 
            border border-white/20`;
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
            </Head>
            <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/fondoP.png")' }}>
                <div className="min-h-screen bg-black/50 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-6xl">
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">
                            <div className="px-6 py-16 mx-auto max-w-4xl flex flex-col items-center text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Sistema de Egresados UNIMAR
                                </h1>
                                
                                <p className="text-gray-300 mb-10 max-w-2xl">
                                    Conecta con la comunidad de egresados, accede a oportunidades laborales y mantente al día con las últimas noticias y eventos de tu alma mater.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {auth.user ? (
                                        <Button
                                            className="bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 active:bg-white/30 transform active:scale-95 transition-all rounded-3xl border border-white/20 shadow-xl"
                                            onClick={() => window.location.href = '/VerNoticias'}
                                        >
                                            Entrar
                                        </Button>
                                    ) : (
                                        <>
                                            <button
                                                onMouseEnter={() => handleMouseEnter('register')}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => handleClick('register', 'register')}
                                                className={getButtonClasses('register')}
                                            >
                                                <span className="relative group">
                                                    Registrarse
                                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                                </span>
                                                <ArrowRight className={`h-4 w-4 transform transition-transform duration-300 ${hovered === 'register' ? 'translate-x-1' : ''}`} />
                                            </button>
                                            
                                            <button
                                                onMouseEnter={() => handleMouseEnter('login')}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => handleClick('login', 'login')}
                                                className={getButtonClasses('login')}
                                            >
                                                <span className="relative group">
                                                    Iniciar sesión
                                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                                </span>
                                                <ArrowRight className={`h-4 w-4 transform transition-transform duration-300 ${hovered === 'login' ? 'translate-x-1' : ''}`} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-center text-sm text-gray-400">
                            <p>Universidad Mariana - Sistema de Egresados</p>
                        </div>
                        
                        {/* Avatares con animación, sombra y escala */}
                        <div className="mt-10 flex justify-center gap-4">
                            {[1, 2, 3, 4].map((i, index) => (
                                <Avatar
                                    key={index}
                                    className="h-12 w-12 border-2 border-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-110"
                                >
                                    <AvatarImage src={`/images/avatar${i}.jpg`} alt={`Avatar ${i}`} />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

