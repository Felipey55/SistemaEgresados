<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

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

    public function store(Request $request)
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return response()->json(['error' => 'No tienes permiso para realizar esta acción.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
            
        ]);

        $role = Role::findById($request->role_id);
        $user->assignRole($role);

        return response()->json(['message' => 'Usuario creado correctamente', 'user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No tienes permiso para realizar esta acción.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' =>'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', $validator->errors()->first());
        }

        try {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'role_id' => $request->role_id
            ]);

            return redirect()->back()->with('message', 'Usuario actualizado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar el usuario.');
        }
    }

    public function destroy(User $user)
    {
        if (Auth::user()->email !== 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No tienes permiso para realizar esta acción.');
        }

        if ($user->email === 'admin@gmail.com') {
            return redirect()->back()->with('error', 'No puedes eliminar al usuario administrador.');
        }

        try {
            $user->delete();
            return redirect()->back()->with('message', 'Usuario eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar el usuario.');
        }
    }
}