<?php

namespace Database\Factories;

use App\Models\Egresado;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EgresadoFactory extends Factory
{
    protected $model = Egresado::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'identificacion_tipo' => $this->faker->randomElement(['C.C.', 'C.E.']),
            'identificacion_numero' => $this->faker->unique()->numerify('########'),
            'celular' => $this->faker->phoneNumber(),
            'direccion' => $this->faker->address(),
            'fecha_nacimiento' => $this->faker->date()
        ];
    }
}