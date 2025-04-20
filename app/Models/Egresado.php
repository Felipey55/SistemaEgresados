<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function formacionAcademica()
    {
        return $this->hasMany(FormacionAcademica::class);
    }

    public function experienciaLaboral()
    {
        return $this->hasMany(ExperienciaLaboral::class);
    }

    public function habilidades(): BelongsToMany
    {
        return $this->belongsToMany(Habilidad::class, 'egresado_habilidad');
    }
}