<?php

namespace App\Http\Controllers;

use App\Models\FormacionAcademica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FormacionAcademicaController extends Controller
{
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

    public function update(Request $request, FormacionAcademica $formacionAcademica)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:100',
            'institucion' => 'required|string|max:100',
            'tipo' => 'required|in:Pregrado,Especialización,Maestría,Doctorado',
            'fecha_realizacion' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $formacionAcademica->update($validator->validated());

        return response()->json(['message' => 'Formación académica actualizada exitosamente', 'data' => $formacionAcademica]);
    }

    public function destroy(FormacionAcademica $formacionAcademica)
    {
        $formacionAcademica->delete();

        return response()->json(['message' => 'Formación académica eliminada exitosamente']);
    }
}