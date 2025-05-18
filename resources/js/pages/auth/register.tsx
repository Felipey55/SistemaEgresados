import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ArrowRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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

        const emptyFields = Object.entries(data).filter(([_, value]) => !value.trim());
        if (emptyFields.length > 0) {
            showNotification('Faltan datos por completar.', false);
            return;
        }

        post(route('register'), {
            onSuccess: () => {
                showNotification('Cuenta creada exitosamente 🎉', true);
                reset('password', 'password_confirmation');
                setFormSubmitted(false);
                setTimeout(() => {
                    window.location.href = route('dashboard');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al crear la cuenta. Verifique los datos.', false);
            },
        });
    };

    const getInputClass = (field: keyof RegisterForm) =>
        `bg-transparent text-white placeholder:text-gray-400 ${
            formSubmitted && !data[field].trim() ? 'border-red-500' : 'border-white/20'
        }`;

    const showEmptyError = (field: keyof RegisterForm) =>
        formSubmitted && !data[field].trim();

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/fondoP.png")' }}>
            <Head title="Register" />

            <div className="pt-16 px-4 flex justify-center">
                <form
                    className="w-full max-w-lg flex flex-col gap-4 backdrop-blur-md bg-black/30 px-8 py-10 border border-white/10 text-white shadow-2xl rounded-[2rem]"
                    onSubmit={submit}
                >
                    <h2 className="text-2xl font-semibold text-white text-center mb-2">Crear una cuenta</h2>
                    <p className="text-sm text-center text-gray-300 mb-4">
                        Ingrese sus datos a continuación para crear su cuenta
                    </p>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-white">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre completo"
                                className={getInputClass('name')}
                            />
                            {showEmptyError('name') && (
                                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                            )}
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@ejemplo.com"
                                className={getInputClass('email')}
                            />
                            {showEmptyError('email') && (
                                <p className="text-red-500 text-sm mt-1">Faltan datos por completar.</p>
                            )}
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-white">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Contraseña"
                                className={getInputClass('password')}
                            />
                            {showEmptyError('password') && (
                                <p className="text-red-500 text-sm mt-1">Faltan datos por completar.</p>
                            )}
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-white">Confirmar Contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirmar Contraseña"
                                className={getInputClass('password_confirmation')}
                            />
                            {showEmptyError('password_confirmation') && (
                                <p className="text-red-500 text-sm mt-1">Faltan datos por completar.</p>
                            )}
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 w-full bg-transparent backdrop-blur-xl text-white 
                                hover:bg-white/20 hover:scale-[1.02] 
                                active:bg-white active:text-black active:scale-95 
                                focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200 ease-in-out
                                rounded-3xl border border-white/20 shadow-xl"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Crear Cuenta
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-300 mt-4">
                        ¿Ya tienes una cuenta?{' '}
                        <TextLink 
                            href={route('login')} 
                            tabIndex={6} 
                            className="text-white 
                                hover:text-white/80
                                active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-white/50
                                transition-all duration-200 ease-in-out"
                        >
                            Iniciar Sesión
                        </TextLink>
                    </div>
                </form>
            </div>

            <div className="text-center text-sm text-gray-400 mb-6">
                Universidad Mariana - Sistema de Egresados
            </div>
        </div>
    );
}


