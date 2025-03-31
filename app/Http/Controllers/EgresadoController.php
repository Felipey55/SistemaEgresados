<?php

namespace App\Http\Controllers;

use App\Models\Egresado;
use App\Models\FormacionAcademica;
use App\Models\ExperienciaLaboral;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EgresadoController extends Controller
{
    public function verificarRegistroCompleto(): JsonResponse
    {
        $user = Auth::user();
        $egresado = Egresado::where('user_id', $user->id)->first();

        if (!$egresado) {
            return response()->json(['registroCompleto' => false]);
        }

        $tieneFormacionAcademica = FormacionAcademica::where('egresado_id', $egresado->id)->exists();
        $tieneExperienciaLaboral = ExperienciaLaboral::where('egresado_id', $egresado->id)->exists();

        return response()->json([
            'registroCompleto' => $tieneFormacionAcademica && $tieneExperienciaLaboral
        ]);
    }

    public function obtenerPerfil(): JsonResponse
    {
        $user = Auth::user();
        $egresado = Egresado::with('user')
            ->where('user_id', $user->id)
            ->firstOrFail();

        $formacionAcademica = FormacionAcademica::where('egresado_id', $egresado->id)->get();
        $experienciaLaboral = ExperienciaLaboral::where('egresado_id', $egresado->id)->get();

        return response()->json([
            'egresado' => $egresado,
            'formacionAcademica' => $formacionAcademica,
            'experienciaLaboral' => $experienciaLaboral
        ]);
    }
}