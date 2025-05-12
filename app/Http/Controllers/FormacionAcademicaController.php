<?php

namespace App\Http\Controllers;

use App\Models\FormacionAcademica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FormacionAcademicaController extends Controller
{
    public function datos(Request $request, $id = null)
    {
        try {
            $egresado = $request->user()->egresado;
            if (!$egresado) {
                return response()->json(['error' => 'Egresado no encontrado'], 404);
            }

            $query = FormacionAcademica::where('egresado_id', $egresado->id);
            
            if ($id) {
                $formacionAcademica = $query->where('id', $id)->first();
            } else {
                $formacionAcademica = $query->latest()->first();
            }

            if (!$formacionAcademica) {
                return response()->json(['message' => 'No se encontró información de formación académica'], 404);
            }

            return response()->json([
                'titulo' => $formacionAcademica->titulo,
                'institucion' => $formacionAcademica->institucion,
                'tipo_formacion' => $formacionAcademica->tipo,
                'fecha_realizacion' => $formacionAcademica->fecha_realizacion->format('Y-m-d')
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:100',
            'institucion' => 'required|string|max:100',
            'tipo_formacion' => 'required|in:Pregrado,Especialización,Maestría,Doctorado',
            'fecha_realizacion' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['egresado_id'] = $request->user()->egresado->id;
        $data['tipo'] = $data['tipo_formacion'];
        unset($data['tipo_formacion']);

        $formacionAcademica = FormacionAcademica::create($data);

        return redirect()->back()->with('success', 'Formación académica registrada exitosamente');
    }

    public function update(Request $request, $id)
    {
        try {
            $egresado = $request->user()->egresado;
            if (!$egresado) {
                return response()->json(['error' => 'Egresado no encontrado'], 404);
            }

            $formacionAcademica = FormacionAcademica::where('egresado_id', $egresado->id)
                ->where('id', $id)
                ->first();

            if (!$formacionAcademica) {
                return response()->json(['message' => 'No se encontró información de formación académica'], 404);
            }

            $validator = Validator::make($request->all(), [
                'titulo' => 'required|string|max:100',
                'institucion' => 'required|string|max:100',
                'tipo_formacion' => 'required|in:Pregrado,Especialización,Maestría,Doctorado',
                'fecha_realizacion' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            $data['tipo'] = $data['tipo_formacion'];
            $data['fecha_realizacion'] = date('Y-m-d', strtotime($data['fecha_realizacion']));
            unset($data['tipo_formacion']);
            
            $formacionAcademica->update($data);
            
            return redirect()->route('egresado.perfil')->with('success', 'Formación académica actualizada exitosamente');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la formación académica'], 500);
        }
    }

    public function destroy(FormacionAcademica $formacionAcademica)
    {
        $formacionAcademica->delete();

        return response()->json(['message' => 'Formación académica eliminada exitosamente']);
    }
}