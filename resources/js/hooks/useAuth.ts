import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { User } from '@/types';

interface AuthUser extends User {
    roles: string[];
    permissions: string[];
}



export function useAuth() {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;

    const roles = useMemo(() => auth.user?.roles || [], [auth.user]);
    const permissions = useMemo(() => auth.user?.permissions || [], [auth.user]);

    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const canAccessRoute = (route: string): boolean => {
        // Rutas permitidas para egresados
        const egresadoRoutes = [
            'dashboard',
            'Noticias/Index',
            'perfiles.egresados',
            'egresado.detalle',
            'historial-laboral',
            'formacion-academica'
        ];

        // Rutas restringidas para coordinador
        const coordinadorRestrictedRoutes = ['modUsers'];

        if (hasRole('Admin')) {
            return true;
        }

        if (hasRole('Coordinador')) {
            return !coordinadorRestrictedRoutes.includes(route);
        }

        if (hasRole('Egresado')) {
            return egresadoRoutes.includes(route);
        }

        return false;
    };

    return {
        user: auth.user,
        roles,
        permissions,
        hasRole,
        hasPermission,
        canAccessRoute,
        isAuthenticated: !!auth.user,
    };
}