<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienciaLaboral extends Model
{
    use HasFactory;

    protected $table = 'experiencias_laborales';

    protected $fillable = [
        'egresado_id',
        'tipo_empleo',
        'nombre_empresa',
        'fecha_inicio',
        'fecha_fin',
        'servicios',
        'correo_empresa',
        'url_empresa',
        'modalidad_trabajo',
        'descripcion'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date'
    ];

    protected $rules = [
        'tipo_empleo' => 'required|in:Tiempo Completo,Medio Tiempo,Freelance,Otro',
        'nombre_empresa' => 'required|string|max:100',
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'nullable|date|after:fecha_inicio',
        'servicios' => 'nullable|string',
        'correo_empresa' => 'nullable|email|max:100',
        'url_empresa' => 'nullable|url|max:255',
        'modalidad_trabajo' => 'required|in:Presencial,Remoto,Híbrido',
        'descripcion' => 'nullable|string'
    ];

    public function egresado(): BelongsTo
    {
        return $this->belongsTo(Egresado::class);
    }
}