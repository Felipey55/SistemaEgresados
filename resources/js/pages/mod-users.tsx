
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LoaderCircle, Search, UserPlus, Edit2, Trash2, User, Shield, UserCog, GraduationCap } from 'lucide-react';
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [loading, setLoading] = useState(false);
    const [trashAnimation, setTrashAnimation] = useState<number | null>(null);
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

    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const handleUserDelete = () => {
        if (!userToDelete) return;
        
        // Iniciar animación
        setTrashAnimation(userToDelete);
        
        setTimeout(() => {
            router.delete(`/user-mod/${userToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error deleting user:', errors);
                    setTrashAnimation(null);
                }
            });
        }, 800); // Dar tiempo a la animación antes de eliminar
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
                <div 
                    className="relative rounded-lg shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden"
                    style={{
                        backgroundImage: 'url("/images/gestionUsuarios.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {/* Capa de superposición para mejor legibilidad del texto */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    {/* Contenido */}
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2 drop-shadow-lg">
                            <User className="w-8 h-8" /> Gestión de Usuarios
                        </h1>
                        <p className="text-white/90 mt-3 text-lg drop-shadow-md">Administra los usuarios del sistema de manera eficiente</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 flex gap-4">
                            <div className="relative flex-1 group">
                                <Input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 transition-all duration-300 border-2 focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 cursor-pointer" />
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-white border-2 border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform active:scale-95 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100"
                            >
                                <option value="all" className="py-3 px-4 bg-white hover:bg-blue-50 transition-all duration-300 cursor-pointer hover:text-blue-600">
                                    Todos los roles
                                </option>
                                <option value="admin" className="py-3 px-4 bg-white hover:bg-violet-50 transition-all duration-300 cursor-pointer hover:text-violet-600">
                                    Administrador
                                </option>
                                <option value="coord" className="py-3 px-4 bg-white hover:bg-emerald-50 transition-all duration-300 cursor-pointer hover:text-emerald-600">
                                    Coordinador
                                </option>
                                <option value="egresado" className="py-3 px-4 bg-white hover:bg-sky-50 transition-all duration-300 cursor-pointer hover:text-sky-600">
                                    Egresado
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
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
                                            <div className="flex flex-col items-center py-6">
                                                <Search className="h-12 w-12 text-gray-400 mb-3" />
                                                <p className="text-lg font-medium">No se encontraron usuarios</p>
                                                <p className="text-sm text-gray-400">Intenta con otros criterios de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className={`hover:bg-blue-50 transition-colors duration-200 ${trashAnimation === user.id ? 'opacity-50 animate-pulse' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 group cursor-pointer">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 ${
                                                            user.role_id === 1 
                                                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 group-hover:from-fuchsia-500 group-hover:to-pink-600' 
                                                                : user.role_id === 2 
                                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 group-hover:from-green-400 group-hover:to-emerald-600' 
                                                                : 'bg-gradient-to-br from-sky-400 to-blue-500 group-hover:from-cyan-400 group-hover:to-sky-600'
                                                        }`}>
                                                            {user.role_id === 1 ? (
                                                                <Shield className="h-5 w-5 text-white transform transition-transform group-hover:rotate-12" />
                                                            ) : user.role_id === 2 ? (
                                                                <UserCog className="h-5 w-5 text-white transform transition-transform group-hover:rotate-90" />
                                                            ) : (
                                                                <GraduationCap className="h-5 w-5 text-white transform transition-transform group-hover:-translate-y-1" />
                                                            )}
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                            {user.role_id === 1 ? 'Administrador' : user.role_id === 2 ? 'Coordinador' : 'Egresado'}
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
                                                    user.role_id === 1 
                                                        ? 'bg-violet-100 text-violet-800' 
                                                        : user.role_id === 2 
                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                        : 'bg-sky-100 text-sky-800'
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
                                                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 mr-2 rounded-lg shadow-md hover:shadow-blue-200 border border-transparent hover:border-blue-300 group"
                                                >
                                                    <Edit2 className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:text-blue-700" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(user.id)}
                                                    variant="ghost"
                                                    className={`text-red-600 hover:text-red-900 hover:bg-red-100 transition-all duration-300 transform hover:scale-110 rounded-lg shadow-md hover:shadow-red-200 border border-transparent hover:border-red-300 group ${
                                                        trashAnimation === user.id ? 'animate-bounce' : ''
                                                    }`}
                                                >
                                                    <Trash2 className={`h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:text-red-700 ${
                                                        trashAnimation === user.id ? 'animate-ping' : ''
                                                    }`} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dialog para editar usuario */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="sm:max-w-md transform transition-all duration-300" aria-describedby="edit-user-description">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Editar Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="py-6 px-4">
                            <div className="space-y-6">
                                <div className="transition-all duration-300 focus-within:scale-[1.02]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2"
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
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} 
                                className="hover:bg-gray-100 transition-colors duration-200">
                                Cancelar
                            </Button>
                            <Button onClick={handleUserUpdate}
                                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para confirmar eliminación de usuario */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-md transform transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Trash2 className="h-6 w-6 text-red-500 animate-bounce" />
                                Confirmar Eliminación
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-6 px-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                                <p className="text-red-800 font-medium text-center">
                                    ¿Estás seguro que deseas eliminar este usuario?
                                </p>
                                <p className="text-gray-600 text-sm text-center mt-2">
                                    Esta acción no se puede deshacer y eliminará toda la información asociada al usuario.
                                </p>
                            </div>
                            
                            {selectedUser && userToDelete && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-700 text-center">
                                        <span className="font-semibold">Usuario: </span>
                                        {users.find(u => u.id === userToDelete)?.name}
                                    </p>
                                    <p className="text-gray-700 text-center">
                                        <span className="font-semibold">Email: </span>
                                        {users.find(u => u.id === userToDelete)?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} 
                                className="hover:bg-gray-100 transition-colors duration-200 flex-1">
                                Cancelar
                            </Button>
                            <Button onClick={handleUserDelete}
                                className="bg-red-600 hover:bg-red-700 transition-colors duration-200 flex-1 group">
                                <Trash2 className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                                Eliminar Usuario
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}