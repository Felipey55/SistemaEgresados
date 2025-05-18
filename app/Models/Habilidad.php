<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Habilidad extends Model
{
    protected $table = 'habilidades';
    
    protected $fillable = [
        'nombre',
        'tipo'
    ];

    public function egresados(): BelongsToMany
    {
        return $this->belongsToMany(Egresado::class, 'egresado_habilidad');
    }
}