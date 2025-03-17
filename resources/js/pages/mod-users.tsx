import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modify Users',
        href: '/modUsers',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    role_id: number;
}

export default function ModUsers({ users }: { users: User[] }) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [editedUser, setEditedUser] = useState<{ name: string; email: string; role_id: number }>({ name: '', email: '', role_id: 1 });

    const handleViewClick = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role_id.toString());
        setEditedUser({
            name: user.name,
            email: user.email,
            role_id: user.role_id
        });
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRoleChange = () => {
        if (!selectedUser) {
            setError('No user selected');
            return;
        }

        setError('');
        setSuccess('');

        router.put(`/users/${selectedUser.id}`, {
            role_id: parseInt(selectedRole)
        }, {
            onSuccess: () => {
                setSuccess('User role updated successfully');
                setIsEditDialogOpen(false);
                window.location.reload();
            },
            onError: (errors) => {
                if (typeof errors === 'object' && errors !== null) {
                    setError(Object.values(errors).join('\n'));
                } else {
                    setError('Failed to update user role. Please try again.');
                }
            }
        });
    };

    const handleDeleteConfirm = async () => {
        if (selectedUser) {
            router.delete(`/users/${selectedUser.id}`);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleUserUpdate = () => {
        if (!selectedUser) {
            setError('No user selected');
            return;
        }

        setError('');
        setSuccess('');

        router.put(`/users/${selectedUser.id}`, {
            name: editedUser.name,
            email: editedUser.email,
            role_id: parseInt(selectedRole)
        }, {
            onSuccess: () => {
                setSuccess('User updated successfully');
                setIsViewDialogOpen(false);
                window.location.reload();
            },
            onError: (errors) => {
                if (typeof errors === 'object' && errors !== null) {
                    setError(Object.values(errors).join('\n'));
                } else {
                    setError('Failed to update user. Please try again.');
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modify Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role ID</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role_id}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleViewClick(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User Role</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            {success && <div className="text-green-500 mb-4">{success}</div>}
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role ID" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Role ID: 1</SelectItem>
                                    <SelectItem value="2">Role ID: 2</SelectItem>
                                    <SelectItem value="3">Role ID: 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleRoleChange}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            {success && <div className="text-green-500 mb-4">{success}</div>}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Role ID: 1</SelectItem>
                                            <SelectItem value="2">Role ID: 2</SelectItem>
                                            <SelectItem value="3">Role ID: 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUserUpdate}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}