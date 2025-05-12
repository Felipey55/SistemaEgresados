import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!data.email.trim()) return;

        post(route('password.email'));
    };

    const getInputClass = () =>
        `bg-transparent text-white placeholder:text-gray-400 ${formSubmitted && !data.email.trim() ? 'border-red-500' : 'border-white/20'}`;

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/fondoP.png")' }}
        >
            <Head title="Forgot Password" />

            <div className="relative w-full max-w-lg mt-16">
                {/* Formulario */}
                <form
                    className="w-full flex flex-col gap-4 backdrop-blur-md bg-black/30 px-8 py-16 border border-white/10 text-white shadow-2xl rounded-[2rem]"
                    onSubmit={submit}
                >
                    <h2 className="text-2xl font-semibold text-white text-center mb-2">
                        ¿Olvidaste tu contraseña?
                    </h2>
                    <p className="text-sm text-center text-gray-300 mb-4">
                        Se enviará un enlace de restablecimiento si la cuenta existe
                    </p>

                    {status && (
                        <div className="text-center text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoFocus
                                autoComplete="off"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@ejemplo.com"
                                className={getInputClass()}
                                disabled={processing}
                            />
                            {formSubmitted && !data.email.trim() && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-1/2 mx-auto bg-transparent backdrop-blur-xl text-white 
                                hover:bg-white/20 hover:scale-[1.02] 
                                active:bg-white active:text-black active:scale-95 
                                focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200 ease-in-out
                                rounded-3xl border border-white/20 shadow-xl"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            <span className="relative group">
                                Enviar enlace
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </span>
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-300 mt-4">
                        ¿Recuerdas tu contraseña?{' '}
                        <TextLink href={route('login')} className="text-white hover:underline">
                            Inicia sesión
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

