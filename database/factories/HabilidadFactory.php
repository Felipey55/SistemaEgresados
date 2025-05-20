<?php

namespace Database\Factories;

use App\Models\Habilidad;
use Illuminate\Database\Eloquent\Factories\Factory;

class HabilidadFactory extends Factory
{
    protected $model = Habilidad::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->word(),
            'tipo' => $this->faker->randomElement(['tecnica', 'blanda'])
        ];
    }
}