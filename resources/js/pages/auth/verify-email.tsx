import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/fondoP.png")' }}
        >
            <Head title="Verificación de correo electrónico" />

            <div className="relative w-full max-w-lg mt-16">
                {/* Formulario */}
                <form
                    onSubmit={submit}
                    className="w-full flex flex-col gap-4 backdrop-blur-md bg-black/30 px-8 py-16 border border-white/10 text-white shadow-2xl rounded-[2rem]"
                >
                    <h2 className="text-2xl font-semibold text-white text-center mb-2">
                        Verifica tu correo
                    </h2>
                    <p className="text-sm text-center text-gray-300 mb-4">
                        Por favor, verifica tu dirección de correo electrónico haciendo clic en el enlace que te acabamos de enviar.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="text-center text-sm font-medium text-green-400">
                            Se ha enviado un nuevo enlace de verificación a tu correo.
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="mt-4 w-3/4 mx-auto bg-transparent backdrop-blur-xl text-white 
                            hover:bg-white/20 hover:scale-[1.02] 
                            active:bg-white active:text-black active:scale-95 
                            focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200 ease-in-out
                            rounded-3xl border border-white/20 shadow-xl"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Reenviar correo de verificación
                    </Button>

                    <div className="text-center text-sm text-gray-300 mt-4">
                        <TextLink href={route('logout')} method="post" className="text-white hover:underline">
                            Cerrar sesión
                        </TextLink>
                    </div>
                </form>

                {/* Logo sobrepuesto en frente del formulario */}
                <div className="absolute -top-17 left-1/2 transform -translate-x-1/2 z-10">
                    <img
                        src="/logoUniversidadMariana.png"
                        alt="Logo Universidad Mariana"
                        className="mx-auto w-32 h-auto drop-shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}

