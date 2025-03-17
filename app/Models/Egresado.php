<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Egresado extends Model
{
    use HasFactory;

    protected $table = 'egresados';

    protected $fillable = [
        'user_id',
        'identificacion_tipo',
        'identificacion_numero',
        'fotografia',
        'celular',
        'direccion',
        'fecha_nacimiento'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}