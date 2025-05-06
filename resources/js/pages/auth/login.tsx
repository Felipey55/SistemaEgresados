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
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

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
        setTimeout(() => notification.remove(), 3000);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        const emptyFields = Object.entries(data).filter(([key, value]) =>
            key !== 'remember' && !String(value).trim()
        );
        if (emptyFields.length > 0) {
            showNotification('Faltan datos por completar.', false);
            return;
        }

        post(route('login'), {
            onSuccess: () => {
                showNotification('Inicio de sesión exitoso 🎉', true);
                reset('password');
                setFormSubmitted(false);
                setTimeout(() => {
                    window.location.href = route('dashboard');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al iniciar sesión. Verifica tus credenciales.', false);
            },
        });
    };

    const getInputClass = (field: keyof LoginForm) =>
        `bg-transparent text-white placeholder:text-gray-400 ${
            formSubmitted && field !== 'remember' && !String(data[field]).trim() ? 'border-red-500' : 'border-white/20'
        }`;

    const showEmptyError = (field: keyof LoginForm) =>
        formSubmitted && field !== 'remember' && !String(data[field]).trim();

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/fondoP.png")' }}
        >
            <Head title="Log in" />

            <div className="relative w-full max-w-lg mt-16">
                {/* Formulario */}
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

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@ejemplo.com"
                                className={getInputClass('email')}
                            />
                            {showEmptyError('email') && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-white">Contraseña</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-gray-300 hover:text-white" tabIndex={5}>
                                        ¿Has olvidado tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Contraseña"
                                className={getInputClass('password')}
                            />
                            {showEmptyError('password') && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="border-white/20"
                            />
                            <Label htmlFor="remember" className="text-white">Recordarme</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-1/2 mx-auto backdrop-blur-md bg-black/20 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Iniciar sesión
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-300 mt-4">
                        ¿No tienes una cuenta?{' '}
                        <TextLink href={route('register')} tabIndex={5} className="text-white hover:underline">
                            Registrarse
                        </TextLink>
                    </div>

                    {status && <div className="mt-4 text-center text-sm font-medium text-green-400">{status}</div>}
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