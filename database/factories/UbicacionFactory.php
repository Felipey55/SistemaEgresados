<?php

namespace Database\Factories;

use App\Models\Ubicacion;
use App\Models\Egresado;
use Illuminate\Database\Eloquent\Factories\Factory;

class UbicacionFactory extends Factory
{
    protected $model = Ubicacion::class;

    public function definition(): array
    {
        return [
            'egresado_id' => Egresado::factory(),
            'latitud' => $this->faker->latitude(),
            'longitud' => $this->faker->longitude()
        ];
    }
}