<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ubicacion extends Model
{
    protected $table = 'ubicaciones';

    protected $fillable = [
        'egresado_id',
        'latitud',
        'longitud'
    ];

    /**
     * Obtiene el egresado asociado a esta ubicación.
     */
    public function egresado(): BelongsTo
    {
        return $this->belongsTo(Egresado::class);
    }
}