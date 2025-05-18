<?php

namespace App\Http\Controllers;

use App\Models\Egresado;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GraduateRegistrationController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        $egresado = $user->egresado;

        if ($egresado) {
            return redirect()->back()->with('error', 'Ya has registrado tu información de egresado.');
        }

        return Inertia::render('graduate-registration');
    }

    public function store(Request $request)
    {
        $request->validate([
            'identificacion_tipo' => 'required|in:C.C.,C.E.',
            'identificacion_numero' => 'required|string|max:20|unique:egresados,identificacion_numero',
            'fotografia' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'celular' => 'nullable|string|max:15',
            'direccion' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'required|date',
        ]);

        $data = $request->except('fotografia');
        if ($request->hasFile('fotografia')) {
            $imagen = $request->file('fotografia');
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $imagen->move(public_path('images/perfil'), $nombreImagen);
            $data['fotografia'] = 'images/perfil/' . $nombreImagen;
        }

        $data['user_id'] = Auth::id();

        Egresado::create($data);

        return redirect()->back()->with('success', 'Información de egresado guardada exitosamente.');
    }
}
