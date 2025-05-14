import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Control de usuarios',
        href: '/modUsers',
        icon: LayoutGrid,
    },
    {
        title: 'Informacion egresado',
        href: '/Egresados/perfil',
        icon: LayoutGrid,
    },
    {
        title: 'Noticias',
        href: '/noticias',
        icon: LayoutGrid,
    },
    {
        title: 'Perfiles Egresados',
        href: '/PerfilesEgresados',
        icon: LayoutGrid,
    },
    {
        title: 'Ver Noticias',
        href: '/VerNoticias',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio del proyecto',
        href: 'https://github.com/Felipey55/SistemaEgresados.git',
        icon: Folder,
    },
    {
        title: 'Documentación',
        href: 'https://docs.google.com/document/d/1G5nbTvlxxrLU_3a4KkrTG3-ixVgQGKjQjqYAGb4Sojs/edit?usp=drive_link',
        icon: BookOpen,
    },
];

const getFilteredMenuItems = (roleId: number): NavItem[] => {
    switch (roleId) {
        case 1: // Admin
            return mainNavItems;
        case 2: // Coordinador
            return mainNavItems.filter(item => item.href !== '/modUsers');
        case 3: // Egresado
            return mainNavItems.filter(item => 
                ['/Egresados/perfil', '/VerNoticias'].includes(item.href)
            );
        default:
            return [];
    }
};

export function AppSidebar() {
    const { auth } = usePage().props;
    const { user } = auth as { user: { role_id: number } };
    const filteredItems = getFilteredMenuItems(user.role_id);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
