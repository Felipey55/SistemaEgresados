<?php

namespace App\Policies;

use App\Models\ExperienciaLaboral;
use App\Models\User;

class ExperienciaLaboralPolicy
{
    public function view(User $user, ExperienciaLaboral $experienciaLaboral): bool
    {
        return $user->egresado && $user->egresado->id === $experienciaLaboral->egresado_id;
    }

    public function update(User $user, ExperienciaLaboral $experienciaLaboral): bool
    {
        return $user->egresado && $user->egresado->id === $experienciaLaboral->egresado_id;
    }

    public function delete(User $user, ExperienciaLaboral $experienciaLaboral): bool
    {
        return $user->egresado && $user->egresado->id === $experienciaLaboral->egresado_id;
    }
}