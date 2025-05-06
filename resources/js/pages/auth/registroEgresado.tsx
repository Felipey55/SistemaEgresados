import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registrar Egresados',
        href: '/regEgresados',
    },
];

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    identificacion_tipo: 'C.C.' | 'C.E.'; 
    identificacion_numero: string;          
    fotografia: File | null;                
    celular: string;                        
    direccion: string;                      
    fecha_nacimiento: string;               
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        identificacion_tipo: 'C.C.',
        identificacion_numero: '',
        fotografia: null,
        celular: '',
        direccion: '',
        fecha_nacimiento: '',
    });

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                showNotification('Cuenta creada exitosamente', true);
                // Se reinician algunos campos sensibles, incluyendo la fotografía
                reset('password', 'password_confirmation', 'fotografia');

                // Retraso antes de redirigir
                setTimeout(() => {
                    window.location.href = route('dashboard');
                }, 2000);
            },
            onError: () => {
                showNotification('Error al crear la cuenta. Verifique los datos.', false);
            },
        });
    };

    return (
        <AuthLayout title="Crear una cuenta" description="Ingrese sus datos a continuación para crear su cuenta">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
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
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Correo Electrónico */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
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
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Tipo de Identificación */}
                    <div className="grid gap-2">
                        <Label htmlFor="identificacion_tipo">Tipo de Identificación</Label>
                        <select
                            id="identificacion_tipo"
                            required
                            tabIndex={3}
                            value={data.identificacion_tipo}
                            onChange={(e) => setData('identificacion_tipo', e.target.value as 'C.C.' | 'C.E.')}
                            disabled={processing}
                            className="border rounded p-2"
                        >
                            <option value="C.C.">C.C.</option>
                            <option value="C.E.">C.E.</option>
                        </select>
                        <InputError message={errors.identificacion_tipo} />
                    </div>

                    {/* Número de Identificación */}
                    <div className="grid gap-2">
                        <Label htmlFor="identificacion_numero">Número de Identificación</Label>
                        <Input
                            id="identificacion_numero"
                            type="text"
                            required
                            tabIndex={4}
                            value={data.identificacion_numero}
                            onChange={(e) => setData('identificacion_numero', e.target.value)}
                            disabled={processing}
                            placeholder="Número de identificación"
                        />
                        <InputError message={errors.identificacion_numero} />
                    </div>

                    {/* Fotografía */}
                    <div className="grid gap-2">
                        <Label htmlFor="fotografia">Fotografía</Label>
                        <Input
                            id="fotografia"
                            type="file"
                            tabIndex={5}
                            onChange={(e) => setData('fotografia', e.target.files ? e.target.files[0] : null)}
                            disabled={processing}
                        />
                        <InputError message={errors.fotografia} />
                    </div>

                    {/* Celular */}
                    <div className="grid gap-2">
                        <Label htmlFor="celular">Celular</Label>
                        <Input
                            id="celular"
                            type="text"
                            tabIndex={6}
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            disabled={processing}
                            placeholder="Número de celular"
                        />
                        <InputError message={errors.celular} />
                    </div>

                    {/* Dirección */}
                    <div className="grid gap-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                            id="direccion"
                            type="text"
                            tabIndex={7}
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                            disabled={processing}
                            placeholder="Dirección"
                        />
                        <InputError message={errors.direccion} />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="grid gap-2">
                        <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                        <Input
                            id="fecha_nacimiento"
                            type="date"
                            required
                            tabIndex={8}
                            value={data.fecha_nacimiento}
                            onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.fecha_nacimiento} />
                    </div>

                    {/* Contraseña */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={9}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={10}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirmar Contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={11} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Crear Cuenta
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={12}>
                        Iniciar Sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
