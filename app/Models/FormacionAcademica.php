<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FormacionAcademica extends Model
{
    use HasFactory;
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