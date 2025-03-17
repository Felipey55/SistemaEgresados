import { toast } from 'sonner';

export const showSuccessNotification = (message: string = 'Usuario creado exitosamente') => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
    });
};

export const showErrorNotification = (message: string = 'Error al crear el usuario') => {
    toast.error(message, {
        duration: 3000,
        position: 'top-right',
    });
};