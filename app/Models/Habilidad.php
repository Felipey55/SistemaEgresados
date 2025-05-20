<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Habilidad extends Model
{
    use HasFactory;
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