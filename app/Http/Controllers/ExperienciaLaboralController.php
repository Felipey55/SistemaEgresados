<?php

namespace App\Http\Controllers;

use App\Models\ExperienciaLaboral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ExperienciaLaboralController extends Controller
{
    public function obtenerDatos(Request $request, $id)
    {
        try {
            $egresado = $request->user()->egresado;
            if (!$egresado) {
                return response()->json(['error' => 'Egresado no encontrado'], 404);
            }

            $experienciaLaboral = ExperienciaLaboral::where('egresado_id', $egresado->id)
                ->where('id', $id)
                ->first();

            if (!$experienciaLaboral) {
                return response()->json(['error' => 'Experiencia laboral no encontrada'], 404);
            }

            return response()->json([
                'tipo_empleo' => $experienciaLaboral->tipo_empleo,
                'nombre_empresa' => $experienciaLaboral->nombre_empresa,
                'fecha_inicio' => $experienciaLaboral->fecha_inicio->format('Y-m-d'),
                'fecha_fin' => $experienciaLaboral->fecha_fin ? $experienciaLaboral->fecha_fin->format('Y-m-d') : null,
                'servicios' => $experienciaLaboral->servicios,
                'correo_empresa' => $experienciaLaboral->correo_empresa,
                'url_empresa' => $experienciaLaboral->url_empresa,
                'modalidad_trabajo' => $experienciaLaboral->modalidad_trabajo,
                'descripcion' => $experienciaLaboral->descripcion
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos'], 500);
        }
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

        return redirect()->route('egresado.perfil')->with('success', 'Experiencia laboral actualizada exitosamente');
    }

    public function destroy(ExperienciaLaboral $experienciaLaboral)
    {
        $this->authorize('delete', $experienciaLaboral);
        $experienciaLaboral->delete();
        return response()->json(null, 204);
    }
}