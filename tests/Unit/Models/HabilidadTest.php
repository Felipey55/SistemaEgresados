<?php

namespace Tests\Unit\Models;

use App\Models\Habilidad;
use App\Models\Egresado;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HabilidadTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function habilidad_belongs_to_many_egresados()
    {
        $habilidad = new Habilidad();
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\BelongsToMany', $habilidad->egresados());
        $this->assertInstanceOf(Egresado::class, $habilidad->egresados()->getRelated());
    }

    /** @test */
    public function habilidad_fillable_attributes()
    {
        $habilidad = new Habilidad();
        $fillable = [
            'nombre',
            'tipo'
        ];

        $this->assertEquals($fillable, $habilidad->getFillable());
    }

    /** @test */
    public function it_uses_correct_table_name()
    {
        $habilidad = new Habilidad();
        $this->assertEquals('habilidades', $habilidad->getTable());
    }

    /** @test */
    public function it_uses_correct_pivot_table()
    {
        $habilidad = new Habilidad();
        $this->assertEquals('egresado_habilidad', $habilidad->egresados()->getTable());
    }
}