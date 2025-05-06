import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
            </Head>
            <div className="flex min-h-screen flex-col items-center p-6 text-white lg:justify-center lg:p-8" style={{ backgroundImage: 'url(https://www.boktips.no/content/uploads/2019/06/andrew-neel-308138-unsplash-975x450.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <div className="p-16 rounded-lg flex flex-col items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    <h1 className="text-3xl font-black mb-12 text-center text-white">Bienvenido al Sistema de Egresados</h1>
                    <header className="w-full max-w-[335px] text-base not-has-[nav]:hidden lg:max-w-4xl">
                        <nav className="flex flex-col items-center justify-center gap-12">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border-2 border-white px-8 py-3 text-lg font-extrabold leading-normal text-white hover:text-gray-100 hover:border-gray-100 transition-colors duration-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-8">
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border-2 border-white px-8 py-3 text-lg font-extrabold leading-normal text-white hover:text-gray-100 hover:border-gray-100 transition-colors duration-200"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border-2 border-white px-8 py-3 text-lg font-extrabold leading-normal text-white hover:text-gray-100 hover:border-gray-100 transition-colors duration-200"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </header>
                </div>
            </div>
        </>
    );
}
