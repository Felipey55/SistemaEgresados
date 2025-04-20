<?php

namespace App\Http\Controllers;

use App\Models\Egresado;
use App\Models\User;
use App\Models\FormacionAcademica;
use App\Models\ExperienciaLaboral;
use App\Models\Habilidad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerfilEgresadosController extends Controller
{
    public function index()
    {
        // Obtener todos los egresados con sus relaciones
        $egresados = Egresado::with(['user', 'formacionAcademica', 'experienciaLaboral', 'habilidades'])
            ->get()
            ->map(function ($egresado) {
                // Obtener la formación académica más reciente
                $formacionReciente = $egresado->formacionAcademica->sortByDesc('fecha_realizacion')->first();
                
                // Obtener la experiencia laboral más reciente
                $experienciaReciente = $egresado->experienciaLaboral->sortByDesc('fecha_inicio')->first();
                
                // Separar habilidades por tipo
                $habilidadesTecnicas = $egresado->habilidades->where('tipo', 'tecnica');
                $habilidadesBlandas = $egresado->habilidades->where('tipo', 'blanda');
                
                return [
                    'id' => $egresado->id,
                    'nombre' => $egresado->user->name,
                    'identificacion' => $egresado->identificacion_tipo . ' - ' . $egresado->identificacion_numero,
                    'email' => $egresado->user->email,
                    'celular' => $egresado->celular,
                    'formacion' => $formacionReciente ? [
                        'titulo' => $formacionReciente->titulo,
                        'institucion' => $formacionReciente->institucion
                    ] : null,
                    'experiencia' => $experienciaReciente ? [
                        'empresa' => $experienciaReciente->nombre_empresa,
                        'modalidad' => $experienciaReciente->modalidad_trabajo
                    ] : null,
                    'habilidades' => [
                        'tecnicas' => $habilidadesTecnicas->pluck('nombre'),
                        'blandas' => $habilidadesBlandas->pluck('nombre')
                    ]
                ];
            });

        return Inertia::render('Egresados/perfiles-egresados', [
            'egresados' => $egresados
        ]);
    }

    public function detalle($id)
    {
        try {
            // Obtener el egresado con todas sus relaciones
            $egresado = Egresado::with(['user', 'formacionAcademica', 'experienciaLaboral', 'habilidades'])
                ->findOrFail($id);
            
            // Separar habilidades por tipo y obtener solo los nombres
            $habilidadesTecnicas = $egresado->habilidades->where('tipo', 'tecnica')->pluck('nombre');
            $habilidadesBlandas = $egresado->habilidades->where('tipo', 'blanda')->pluck('nombre');
            
            // Preparar datos para la vista
            $datosEgresado = [
                'id' => $egresado->id,
                'nombre' => $egresado->user->name,
                'identificacion' => $egresado->identificacion_tipo . ' - ' . $egresado->identificacion_numero,
                'email' => $egresado->user->email,
                'celular' => $egresado->celular,
                'direccion' => $egresado->direccion,
                'fecha_nacimiento' => $egresado->fecha_nacimiento->format('d/m/Y'),
                'formacionAcademica' => $egresado->formacionAcademica,
                'experienciaLaboral' => $egresado->experienciaLaboral,
                'habilidades' => [
                    'tecnicas' => $habilidadesTecnicas,
                    'blandas' => $habilidadesBlandas
                ]
            ];
            
            return Inertia::render('Egresados/detalle-egresado', [
                'egresado' => $datosEgresado
            ]);
        } catch (\Exception $e) {
            return redirect()->route('perfiles.egresados')
                ->with('error', 'No se pudo encontrar el perfil del egresado solicitado.');
        }
    }
}