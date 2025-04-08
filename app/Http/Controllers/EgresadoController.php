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
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $egresado = Egresado::with(['formacionAcademica', 'experienciaLaboral', 'user'])
                ->where('user_id', $user->id)
                ->first();

            if (!$egresado) {
                return response()->json([
                    'success' => true,
                    'egresadoRegistrado' => false,
                    'datosEgresado' => null
                ]);
            }

            $formacionAcademica = $egresado->formacionAcademica ?? [];
            $experienciaLaboral = $egresado->experienciaLaboral ?? [];

            return response()->json([
                'success' => true,
                'egresadoRegistrado' => true,
                'datosEgresado' => [
                    'identificacion_tipo' => $egresado->identificacion_tipo,
                    'identificacion_numero' => $egresado->identificacion_numero,
                    'celular' => $egresado->celular,
                    'direccion' => $egresado->direccion,
                    'fecha_nacimiento' => $egresado->fecha_nacimiento,
                    'user' => [
                        'name' => $egresado->user->name,
                        'email' => $egresado->user->email,
                    ],
                    'formacionAcademica' => $formacionAcademica,
                    'experienciaLaboral' => $experienciaLaboral
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al verificar el registro: ' . $e->getMessage()
            ], 500);
        }
    }

    public function obtenerPerfil(): JsonResponse
    {
        $user = Auth::user();
        $egresado = Egresado::with(['user', 'formacionAcademica', 'experienciaLaboral'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json([
            'egresado' => $egresado,
            'formacionAcademica' => $egresado->formacionAcademica,
            'experienciaLaboral' => $egresado->experienciaLaboral
        ]);
    }

    public function obtenerDatos(): JsonResponse
    {
        try {
            $user = Auth::user();
            $egresado = Egresado::where('user_id', $user->id)->firstOrFail();

            return response()->json([
                'identificacion_tipo' => $egresado->identificacion_tipo,
                'identificacion_numero' => $egresado->identificacion_numero,
                'celular' => $egresado->celular,
                'direccion' => $egresado->direccion,
                'fecha_nacimiento' => $egresado->fecha_nacimiento
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos'], 500);
        }
    }

    public function update(\Illuminate\Http\Request $request)
    {
        try {
            $user = Auth::user();
            $egresado = Egresado::where('user_id', $user->id)->firstOrFail();

            $egresado->update([
                'identificacion_tipo' => $request->identificacion_tipo,
                'identificacion_numero' => $request->identificacion_numero,
                'celular' => $request->celular,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento
            ]);

            return redirect('/Egresados/perfil')
                ->with('message', 'Datos actualizados correctamente');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Error al actualizar los datos');
        }
    }
}