import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Modify Users', href: '/modUsers' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
}

export default function ModUsers({ users }: { users: User[] }) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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
                                        <Button variant="secondary" onClick={() => handleViewClick(user)}>Edit</Button>
                                        <Button variant="destructive" onClick={() => handleUserDelete(user.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent aria-describedby="edit-user-description">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div id="edit-user-description" className="py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role ID</label>
                                    <select
                                        value={editedUser.role_id}
                                        onChange={(e) => setEditedUser({ ...editedUser, role_id: parseInt(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-800 text-white hover:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value={1}>Role 1</option>
                                        <option value={2}>Role 2</option>
                                        <option value={3}>Role 3</option>
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
