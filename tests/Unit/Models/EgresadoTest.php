<?php

namespace Tests\Unit\Models;

use App\Models\Egresado;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EgresadoTest extends TestCase
{
    use RefreshDatabase;

    public function test_egresado_belongs_to_user()
    {
        $user = User::factory()->create();
        $egresado = Egresado::factory()->create([
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(User::class, $egresado->user);
        $this->assertEquals($user->id, $egresado->user->id);
    }

    public function test_egresado_fillable_attributes()
    {
        $fillable = [
            'user_id',
            'identificacion_tipo',
            'identificacion_numero',
            'fotografia',
            'celular',
            'direccion',
            'fecha_nacimiento',
            'genero'
        ];

        $egresado = new Egresado();
        $this->assertEquals($fillable, $egresado->getFillable());
    }

    public function test_fecha_nacimiento_is_cast_to_date()
    {
        $egresado = Egresado::factory()->create([
            'fecha_nacimiento' => '1990-01-01'
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $egresado->fecha_nacimiento);
        $this->assertEquals('1990-01-01', $egresado->fecha_nacimiento->toDateString());
    }
}