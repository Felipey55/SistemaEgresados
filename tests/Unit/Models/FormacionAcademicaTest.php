<?php

namespace Tests\Unit\Models;

use App\Models\FormacionAcademica;
use App\Models\Egresado;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FormacionAcademicaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function formacion_academica_belongs_to_egresado()
    {
        $formacionAcademica = new FormacionAcademica();
        $this->assertInstanceOf(Egresado::class, $formacionAcademica->egresado()->getRelated());
    }

    /** @test */
    public function formacion_academica_fillable_attributes()
    {
        $formacionAcademica = new FormacionAcademica();
        $fillable = [
            'egresado_id',
            'titulo',
            'institucion',
            'tipo',
            'fecha_realizacion',
        ];

        $this->assertEquals($fillable, $formacionAcademica->getFillable());
    }

    /** @test */
    public function fecha_realizacion_is_cast_to_date()
    {
        $formacionAcademica = new FormacionAcademica();
        $this->assertTrue($formacionAcademica->hasCast('fecha_realizacion', 'date'));
    }
}