<?php

namespace Tests\Unit\Models;

use App\Models\Ubicacion;
use App\Models\Egresado;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UbicacionTest extends TestCase
{
    use RefreshDatabase;

    public function test_ubicacion_belongs_to_egresado()
    {
        $egresado = Egresado::factory()->create();
        $ubicacion = Ubicacion::factory()->create([
            'egresado_id' => $egresado->id
        ]);

        $this->assertInstanceOf(Egresado::class, $ubicacion->egresado);
        $this->assertEquals($egresado->id, $ubicacion->egresado->id);
    }

    public function test_ubicacion_fillable_attributes()
    {
        $fillable = [
            'egresado_id',
            'latitud',
            'longitud'
        ];

        $ubicacion = new Ubicacion();
        $this->assertEquals($fillable, $ubicacion->getFillable());
    }

    public function test_ubicacion_coordinates_can_be_set()
    {
        $ubicacion = Ubicacion::factory()->create([
            'latitud' => 4.570868,
            'longitud' => -74.297333
        ]);

        $this->assertEquals(4.570868, $ubicacion->latitud);
        $this->assertEquals(-74.297333, $ubicacion->longitud);
    }
}