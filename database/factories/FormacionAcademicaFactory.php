<?php

namespace Database\Factories;

use App\Models\FormacionAcademica;
use App\Models\Egresado;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormacionAcademicaFactory extends Factory
{
    protected $model = FormacionAcademica::class;

    public function definition(): array
    {
        return [
            'egresado_id' => Egresado::factory(),
            'titulo' => $this->faker->sentence(),
            'institucion' => $this->faker->company(),
            'tipo' => $this->faker->randomElement(['Pregrado', 'Maestría', 'Doctorado']),
            'fecha_realizacion' => $this->faker->date()
        ];
    }
}