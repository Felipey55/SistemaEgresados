<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UbicacionController extends Controller
{
    /**
     * Verifica si el egresado ya tiene una ubicación registrada.
     */
    public function verificarUbicacion(): JsonResponse
    {
        $user = auth('web')->user();
        $egresado = $user->egresado;

        if (!$egresado) {
            return response()->json(['error' => 'Usuario no registrado como egresado'], 403);
        }

        $ubicacion = Ubicacion::where('egresado_id', $egresado->id)->first();

        if ($ubicacion) {
            return response()->json([
                'existe' => true,
                'ubicacion' => [
                    'latitud' => $ubicacion->latitud,
                    'longitud' => $ubicacion->longitud
                ]
            ]);
        }

        return response()->json(['existe' => false]);
    }

    /**
     * Almacena una nueva ubicación para un egresado.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth('web')->user();
        $egresado = $user->egresado;

        if (!$egresado) {
            return response()->json(['error' => 'Usuario no registrado como egresado'], 403);
        }

        $ubicacion = Ubicacion::updateOrCreate(
            ['egresado_id' => $egresado->id],
            [
                'latitud' => $request->latitude,
                'longitud' => $request->longitude
            ]
        );

        return response()->json($ubicacion, 201);
    }

    /**
     * Actualiza la ubicación de un egresado específico.
     */
    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitud' => 'required|numeric|between:-90,90',
            'longitud' => 'required|numeric|between:-180,180'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth('web')->user();
        $egresado = $user->egresado;

        if (!$egresado) {
            return response()->json(['error' => 'Usuario no registrado como egresado'], 403);
        }

        $ubicacion = Ubicacion::where('egresado_id', $egresado->id)->first();

        if (!$ubicacion) {
            return response()->json(['error' => 'Ubicación no encontrada'], 404);
        }

        $ubicacion->update($validator->validated());

        return response()->json($ubicacion);
    }

    /**
     * Obtiene la ubicación de un egresado específico.
     */
    public function show(Ubicacion $ubicacion): JsonResponse
    {
        return response()->json($ubicacion);
    }

    /**
     * Elimina la ubicación de un egresado específico.
     */
    public function destroy(Ubicacion $ubicacion): JsonResponse
    {
        $ubicacion->delete();
        return response()->json(null, 204);
    }

    /**
     * Obtiene todas las ubicaciones de los egresados.
     */
    public function obtenerUbicaciones(): JsonResponse
    {
        $ubicaciones = Ubicacion::with('egresado.user')->get()->map(function ($ubicacion) {
            return [
                'id' => $ubicacion->id,
                'latitud' => $ubicacion->latitud,
                'longitud' => $ubicacion->longitud,
                'egresado' => [
                    'id' => $ubicacion->egresado->id,
                    'nombre' => $ubicacion->egresado->user->name,
                    'email' => $ubicacion->egresado->user->email
                ]
            ];
        });

        return response()->json($ubicaciones);
    }
}