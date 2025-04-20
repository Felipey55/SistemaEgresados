<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Habilidad;
use App\Models\Egresado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HabilidadController extends Controller
{
    public function index()
    {
        $habilidadesTecnicas = Habilidad::where('tipo', 'tecnica')->get();
        $habilidadesBlandas = Habilidad::where('tipo', 'blanda')->get();
        
        $egresado = Auth::user()->egresado;
        $habilidadesSeleccionadas = $egresado->habilidades->pluck('id')->toArray();

        return Inertia::render('Habilidades/index', [
            'habilidadesTecnicas' => $habilidadesTecnicas,
            'habilidadesBlandas' => $habilidadesBlandas,
            'habilidadesSeleccionadas' => $habilidadesSeleccionadas
        ]);
    }

    public function agregarHabilidades(Request $request)
    {
        try {
            $request->validate([
                'habilidades' => 'present|array',
                'habilidades.*' => 'string',
                'custom_hard_skill' => 'nullable|string|max:255',
                'custom_soft_skill' => 'nullable|string|max:255'
            ]);

            $egresado = Auth::user()->egresado;
            
            if (!$egresado) {
                return response()->json(['message' => 'No se encontró el perfil de egresado'], 404);
            }
            
            // Procesar habilidades seleccionadas
            $habilidadesIds = [];
            
            if ($request->has('habilidades') && is_array($request->habilidades)) {
                foreach ($request->habilidades as $skillId) {
                    // Extraer el tipo y nombre de la habilidad del ID
                    $parts = explode('-', $skillId, 2); // Dividir solo en la primera ocurrencia de '-'
                    if (count($parts) < 2) {
                        continue; // Saltar si el formato no es válido
                    }
                    
                    $prefix = $parts[0]; // Prefijo (lang, web, soft, etc.)
                    $skillName = $parts[1]; // Nombre de la habilidad
                    
                    // Si es la opción "otra", saltarla (se maneja por separado con custom_hard_skill y custom_soft_skill)
                    if ($skillName === 'otra') {
                        continue;
                    }
                    
                    // Determinar el tipo de habilidad basado en el prefijo
                    $tipo = 'tecnica'; // Por defecto para prefijos como lang, web, db, ai, devops
                    if ($prefix === 'soft') {
                        $tipo = 'blanda';
                    }
                    
                    // Buscar si la habilidad ya existe
                    $habilidad = Habilidad::where('nombre', $skillName)
                        ->where('tipo', $tipo)
                        ->first();
                        
                    // Si no existe, crearla
                    if (!$habilidad) {
                        $habilidad = Habilidad::create([
                            'nombre' => $skillName,
                            'tipo' => $tipo
                        ]);
                    }
                    
                    $habilidadesIds[] = $habilidad->id;
                }
            }
            
            // Agregar nuevas habilidades sin reemplazar las anteriores
            if (!empty($habilidadesIds)) {
                $egresado->habilidades()->attach($habilidadesIds);
            }
            
            // Procesar habilidades personalizadas
            if ($request->has('custom_hard_skill') && !empty($request->custom_hard_skill)) {
                // Crear nueva habilidad dura personalizada
                $nuevaHabilidad = Habilidad::create([
                    'nombre' => $request->custom_hard_skill,
                    'tipo' => 'tecnica'
                ]);
                
                // Asociar al egresado
                $egresado->habilidades()->attach($nuevaHabilidad->id);
            }
            
            if ($request->has('custom_soft_skill') && !empty($request->custom_soft_skill)) {
                // Crear nueva habilidad blanda personalizada
                $nuevaHabilidad = Habilidad::create([
                    'nombre' => $request->custom_soft_skill,
                    'tipo' => 'blanda'
                ]);
                
                // Asociar al egresado
                $egresado->habilidades()->attach($nuevaHabilidad->id);
            }

            return response()->json(['message' => 'Habilidades agregadas correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al agregar habilidades: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerHabilidades()
    {
        $egresado = Auth::user()->egresado;
        return response()->json([
            'habilidades' => $egresado->habilidades
        ]);
    }
    
    public function editar()
    {
        $habilidadesTecnicas = Habilidad::where('tipo', 'tecnica')->get();
        $habilidadesBlandas = Habilidad::where('tipo', 'blanda')->get();
        
        $egresado = Auth::user()->egresado;
        $habilidadesSeleccionadas = $egresado->habilidades->pluck('id')->toArray();

        return Inertia::render('Habilidades/editar', [
            'habilidadesTecnicas' => $habilidadesTecnicas,
            'habilidadesBlandas' => $habilidadesBlandas,
            'habilidadesSeleccionadas' => $habilidadesSeleccionadas
        ]);
    }
    
    public function eliminar(Request $request)
    {
        try {
            $request->validate([
                'habilidad_id' => 'required|integer|exists:habilidades,id'
            ]);
            
            $egresado = Auth::user()->egresado;
            $habilidadId = $request->habilidad_id;
            
            // Desasociar la habilidad del egresado
            $egresado->habilidades()->detach($habilidadId);
            
            return response()->json(['message' => 'Habilidad eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar la habilidad: ' . $e->getMessage()], 500);
        }
    }
    
    public function actualizar(Request $request)
    {
        try {
            $request->validate([
                'habilidades' => 'present|array',
                'habilidades.*' => 'string',
                'custom_hard_skill' => 'nullable|string|max:255',
                'custom_soft_skill' => 'nullable|string|max:255'
            ]);

            $egresado = Auth::user()->egresado;
            
            if (!$egresado) {
                return response()->json(['message' => 'No se encontró el perfil de egresado'], 404);
            }
            
            // Eliminar todas las habilidades actuales del egresado
            $egresado->habilidades()->detach();
            
            // Procesar habilidades seleccionadas
            $habilidadesIds = [];
            
            if ($request->has('habilidades') && is_array($request->habilidades)) {
                foreach ($request->habilidades as $skillId) {
                    // Extraer el tipo y nombre de la habilidad del ID
                    $parts = explode('-', $skillId, 2); // Dividir solo en la primera ocurrencia de '-'
                    if (count($parts) < 2) {
                        continue; // Saltar si el formato no es válido
                    }
                    
                    $prefix = $parts[0]; // Prefijo (lang, web, soft, etc.)
                    $skillName = $parts[1]; // Nombre de la habilidad
                    
                    // Si es la opción "otra", saltarla (se maneja por separado con custom_hard_skill y custom_soft_skill)
                    if ($skillName === 'otra') {
                        continue;
                    }
                    
                    // Determinar el tipo de habilidad basado en el prefijo
                    $tipo = 'tecnica'; // Por defecto para prefijos como lang, web, db, ai, devops
                    if ($prefix === 'soft') {
                        $tipo = 'blanda';
                    }
                    
                    // Buscar si la habilidad ya existe
                    $habilidad = Habilidad::where('nombre', $skillName)
                        ->where('tipo', $tipo)
                        ->first();
                        
                    // Si no existe, crearla
                    if (!$habilidad) {
                        $habilidad = Habilidad::create([
                            'nombre' => $skillName,
                            'tipo' => $tipo
                        ]);
                    }
                    
                    $habilidadesIds[] = $habilidad->id;
                }
            }
            
            // Asociar las habilidades seleccionadas al egresado
            if (!empty($habilidadesIds)) {
                $egresado->habilidades()->attach($habilidadesIds);
            }
            
            // Procesar habilidades personalizadas
            if ($request->has('custom_hard_skill') && !empty($request->custom_hard_skill)) {
                // Crear nueva habilidad dura personalizada
                $nuevaHabilidad = Habilidad::create([
                    'nombre' => $request->custom_hard_skill,
                    'tipo' => 'tecnica'
                ]);
                
                // Asociar al egresado
                $egresado->habilidades()->attach($nuevaHabilidad->id);
            }
            
            if ($request->has('custom_soft_skill') && !empty($request->custom_soft_skill)) {
                // Crear nueva habilidad blanda personalizada
                $nuevaHabilidad = Habilidad::create([
                    'nombre' => $request->custom_soft_skill,
                    'tipo' => 'blanda'
                ]);
                
                // Asociar al egresado
                $egresado->habilidades()->attach($nuevaHabilidad->id);
            }

            return response()->json(['message' => 'Habilidades actualizadas correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar habilidades: ' . $e->getMessage()], 500);
        }
    }
}