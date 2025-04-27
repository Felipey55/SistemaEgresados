import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LoaderCircle, Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gestión de Usuarios', href: '/mod-users' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    created_at: string;
    status: 'active' | 'inactive';
}

export default function ModUsers({ users }: { users: User[] }) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [loading, setLoading] = useState(false);
    const [editedUser, setEditedUser] = useState<{ name: string; email: string; role_id: number }>({
        name: '', email: '', role_id: 1
    });

    const handleViewClick = (user: User) => {
        setSelectedUser(user);
        setEditedUser({ name: user.name, email: user.email, role_id: user.role_id });
        setIsViewDialogOpen(true);
    };

    const handleUserUpdate = () => {
        if (!selectedUser) return;

        router.put(`/user-mod/${selectedUser.id}`, editedUser, {
            preserveScroll: true,
            onSuccess: () => {
                setIsViewDialogOpen(false);
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error updating user:', errors);
            }
        });
    };

    const handleUserDelete = (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        router.delete(`/user-mod/${userId}`, {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error deleting user:', errors);
            }
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role_id === (selectedRole === 'admin' ? 1 : selectedRole === 'coord' ? 2 : 3);
        return matchesSearch && matchesRole;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Encabezado con gradiente */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                    <p className="text-blue-100 mt-2">Administra los usuarios del sistema</p>
                </div>

                {/* Barra de herramientas */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 flex gap-4">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700"
                            >
                                <option value="all">Todos los roles</option>
                                <option value="admin">Administrador</option>
                                <option value="coord">Coordinador</option>
                                <option value="egresado">Egresado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center">
                                            <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                            <span className="text-xl text-white">{user.name[0].toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role_id === 1 ? 'bg-purple-100 text-purple-800' : 
                                                    user.role_id === 2 ? 'bg-blue-100 text-blue-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role_id === 1 ? 'Administrador' :
                                                     user.role_id === 2 ? 'Coordinador' :
                                                     'Egresado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    onClick={() => handleViewClick(user)}
                                                    variant="ghost"
                                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleUserDelete(user.id)}
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent aria-describedby="edit-user-description">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div id="edit-user-description" className="py-6 px-4 w-full max-w-2xl mx-auto">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role ID</label>
                                    <select
                                        value={editedUser.role_id}
                                        onChange={(e) => setEditedUser({ ...editedUser, role_id: parseInt(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border border-white shadow-sm bg-gray-800 text-white hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500 p-2"
                                    >
                                        <option value={1}>Administrador</option>
                                        <option value={2}>Coordinador</option>
                                        <option value={3}>Egresado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleUserUpdate}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}