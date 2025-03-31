<?php

namespace App\Http\Controllers;

use App\Models\ExperienciaLaboral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ExperienciaLaboralController extends Controller
{
    public function index(Request $request)
    {
        $experiencias = ExperienciaLaboral::where('egresado_id', $request->user()->egresado->id)
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json($experiencias);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tipo_empleo' => 'required|in:Tiempo Completo,Medio Tiempo,Freelance,Otro',
            'nombre_empresa' => 'required|string|max:100',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after:fecha_inicio',
            'servicios' => 'nullable|string',
            'correo_empresa' => 'nullable|email|max:100',
            'url_empresa' => 'nullable|url|max:255',
            'modalidad_trabajo' => 'required|in:Presencial,Remoto,Híbrido',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $experiencia = new ExperienciaLaboral($request->all());
        $experiencia->egresado_id = $request->user()->egresado->id;
        $experiencia->save();

        return redirect()->back()->with('success', 'Experiencia laboral creada exitosamente');
    }

    public function show(ExperienciaLaboral $experienciaLaboral)
    {
        $this->authorize('view', $experienciaLaboral);
        return response()->json($experienciaLaboral);
    }

    public function update(Request $request, ExperienciaLaboral $experienciaLaboral)
    {
        $this->authorize('update', $experienciaLaboral);

        $validator = Validator::make($request->all(), [
            'tipo_empleo' => 'required|in:Tiempo Completo,Medio Tiempo,Freelance,Otro',
            'nombre_empresa' => 'required|string|max:100',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after:fecha_inicio',
            'servicios' => 'nullable|string',
            'correo_empresa' => 'nullable|email|max:100',
            'url_empresa' => 'nullable|url|max:255',
            'modalidad_trabajo' => 'required|in:Presencial,Remoto,Híbrido',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $experienciaLaboral->update($request->all());
        return response()->json($experienciaLaboral);
    }

    public function destroy(ExperienciaLaboral $experienciaLaboral)
    {
        $this->authorize('delete', $experienciaLaboral);
        $experienciaLaboral->delete();
        return response()->json(null, 204);
    }
}