<?php

namespace Database\Factories;

use App\Models\Noticia;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoticiaFactory extends Factory
{
    protected $model = Noticia::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(),
            'contenido' => $this->faker->paragraphs(3, true),
            'autor_id' => User::factory(),
            'fecha_publicacion' => $this->faker->dateTime()
        ];
    }
}