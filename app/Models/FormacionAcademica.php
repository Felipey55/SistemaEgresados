<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormacionAcademica extends Model
{
    protected $table = 'formacion_academica';

    protected $fillable = [
        'egresado_id',
        'titulo',
        'institucion',
        'tipo',
        'fecha_realizacion',
    ];

    protected $casts = [
        'fecha_realizacion' => 'date',
    ];

    public function egresado(): BelongsTo
    {
        return $this->belongsTo(Egresado::class);
    }
}