<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No tienes permiso para acceder a esta página.');
        }

        $users = User::all();
        return view('modUsers', compact('users'));
    }

    public function updateRole(Request $request, User $user)
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No tienes permiso para realizar esta acción.');
        }

        $role = Role::where('name', $request->role)->first();
        $user->syncRoles([$role]);

        return redirect()->back()->with('success', 'Rol actualizado correctamente.');
    }

    public function delete(User $user)
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No tienes permiso para realizar esta acción.');
        }

        if ($user->email === 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No puedes eliminar al usuario administrador.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }
}