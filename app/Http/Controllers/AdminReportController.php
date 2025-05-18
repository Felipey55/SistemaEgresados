<?php

namespace App\Http\Controllers;

use App\Models\Egresado;
use App\Models\FormacionAcademica;
use App\Models\ExperienciaLaboral;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    public function index()
    {
        $totalEgresados = Egresado::count();

        $distribucionGenero = Egresado::select('genero', DB::raw('count(*) as total'))
            ->groupBy('genero')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->genero => $item->total];
            });

        $distribucionTipoIdentificacion = Egresado::select('identificacion_tipo', DB::raw('count(*) as total'))
            ->groupBy('identificacion_tipo')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->identificacion_tipo => $item->total];
            });

        $distribucionTipoEmpleo = ExperienciaLaboral::select('tipo_empleo', DB::raw('count(*) as total'))
            ->whereNotNull('tipo_empleo')
            ->groupBy('tipo_empleo')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->tipo_empleo => $item->total];
            });

        $distribucionModalidadTrabajo = ExperienciaLaboral::select('modalidad_trabajo', DB::raw('count(*) as total'))
            ->whereNotNull('modalidad_trabajo')
            ->groupBy('modalidad_trabajo')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->modalidad_trabajo => $item->total];
            });

        $empresasTop = ExperienciaLaboral::select('nombre_empresa', DB::raw('count(*) as total'))
            ->whereNotNull('nombre_empresa')
            ->groupBy('nombre_empresa')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->nombre_empresa => $item->total];
            });

        $distribucionFormacionAcademica = FormacionAcademica::select('titulo', 'institucion', DB::raw('count(*) as total'))
            ->whereNotNull('titulo')
            ->whereNotNull('institucion')
            ->groupBy('titulo', 'institucion')
            ->get()
            ->map(function ($item) {
                return [
                    'titulo' => $item->titulo,
                    'institucion' => $item->institucion,
                    'total' => $item->total
                ];
            });

        $habilidadesTop = DB::table('habilidades')
            ->join('egresado_habilidad', 'habilidades.id', '=', 'egresado_habilidad.habilidad_id')
            ->select('habilidades.nombre', DB::raw('count(*) as total'))
            ->groupBy('habilidades.nombre')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->nombre => $item->total];
            });

        $egresadosPorAnio = Egresado::select(
            DB::raw(DB::connection()->getDriverName() === 'sqlite' 
                ? "strftime('%Y', created_at) as anio"
                : 'YEAR(created_at) as anio'
            ),
            DB::raw('count(*) as total')
        )
            ->groupBy('anio')
            ->orderBy('anio', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->anio => $item->total];
            });

        return [
            'totalEgresados' => $totalEgresados,
            'distribucionGenero' => $distribucionGenero,
            'distribucionTipoIdentificacion' => $distribucionTipoIdentificacion,
            'distribucionTipoEmpleo' => $distribucionTipoEmpleo,
            'distribucionModalidadTrabajo' => $distribucionModalidadTrabajo,
            'empresasTop' => $empresasTop,
            'distribucionFormacionAcademica' => $distribucionFormacionAcademica,
            'habilidadesTop' => $habilidadesTop,
            'egresadosPorAnio' => $egresadosPorAnio
        ];
    }
}
