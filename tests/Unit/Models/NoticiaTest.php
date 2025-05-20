<?php

namespace Tests\Unit\Models;

use App\Models\Noticia;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class NoticiaTest extends TestCase
{
    use RefreshDatabase;

    public function test_noticia_belongs_to_autor()
    {
        $autor = User::factory()->create();
        $noticia = Noticia::factory()->create([
            'autor_id' => $autor->id
        ]);

        $this->assertInstanceOf(User::class, $noticia->autor);
        $this->assertEquals($autor->id, $noticia->autor->id);
    }

    public function test_noticia_fillable_attributes()
    {
        $fillable = [
            'titulo',
            'contenido',
            'fecha_publicacion',
            'autor_id',
            'imagen_path'
        ];

        $noticia = new Noticia();
        $this->assertEquals($fillable, $noticia->getFillable());
    }

    public function test_fecha_publicacion_is_cast_to_datetime()
    {
        $fecha = '2023-01-01 12:00:00';
        $noticia = Noticia::factory()->create([
            'fecha_publicacion' => $fecha
        ]);

        $this->assertInstanceOf(Carbon::class, $noticia->fecha_publicacion);
        $this->assertEquals($fecha, $noticia->fecha_publicacion->format('Y-m-d H:i:s'));
    }
}