import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!data.email.trim() || !data.password.trim()) return;

        post(route('login'), {
            onSuccess: () => {
                window.location.href = '/VerNoticias';
            }
        });
    };

    const getInputClass = (field: keyof LoginForm) =>
        `bg-transparent text-white placeholder:text-gray-400 ${
            formSubmitted && field !== 'remember' && !String(data[field]).trim()
                ? 'border-red-500'
                : 'border-white/20'
        }`;

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/fondoP.png")' }}
        >
            <Head title="Log in" />

            <div className="relative w-full max-w-lg mt-16">
                <form
                    className="w-full flex flex-col gap-4 backdrop-blur-md bg-black/30 px-8 py-16 border border-white/10 text-white shadow-2xl rounded-[2rem]"
                    onSubmit={submit}
                >
                    <h2 className="text-2xl font-semibold text-white text-center mb-2">
                        Inicia sesión en tu cuenta
                    </h2>
                    <p className="text-sm text-center text-gray-300 mb-4">
                        Ingrese su correo electrónico y contraseña a continuación para iniciar sesión
                    </p>

                    {status && (
                        <div className="text-center text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    <div className="grid gap-4">
                        {/* Email */}
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
                                className={getInputClass('email')}
                                disabled={processing}
                            />
                            {formSubmitted && !data.email.trim() && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-white">Contraseña</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-gray-300 hover:text-white">
                                        ¿Has olvidado tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Contraseña"
                                className={getInputClass('password')}
                                disabled={processing}
                            />
                            {formSubmitted && !data.password.trim() && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                className="border-white/20"
                            />
                            <Label htmlFor="remember" className="text-white">Recordarme</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-1/2 mx-auto backdrop-blur-md bg-black/20 border border-white/10 text-white 
                                hover:bg-white/20 hover:scale-[1.02] 
                                active:bg-white active:text-black active:scale-95 
                                focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200 ease-in-out
                                rounded-3xl shadow-xl"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Iniciar sesión
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-300 mt-4">
                        ¿No tienes una cuenta?{' '}
                        <TextLink href={route('register')} className="text-white hover:underline">
                            Registrarse
                        </TextLink>
                    </div>
                </form>

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
