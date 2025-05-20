<?php

namespace Tests\Unit\Models;

use App\Models\ExperienciaLaboral;
use App\Models\Egresado;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExperienciaLaboralTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function experiencia_laboral_belongs_to_egresado()
    {
        $experienciaLaboral = new ExperienciaLaboral();
        $this->assertInstanceOf(Egresado::class, $experienciaLaboral->egresado()->getRelated());
    }

    /** @test */
    public function experiencia_laboral_fillable_attributes()
    {
        $experienciaLaboral = new ExperienciaLaboral();
        $fillable = [
            'egresado_id',
            'tipo_empleo',
            'nombre_empresa',
            'fecha_inicio',
            'fecha_fin',
            'servicios',
            'correo_empresa',
            'url_empresa',
            'modalidad_trabajo',
            'descripcion'
        ];

        $this->assertEquals($fillable, $experienciaLaboral->getFillable());
    }

    /** @test */
    public function fecha_inicio_y_fin_are_cast_to_date()
    {
        $experienciaLaboral = new ExperienciaLaboral();
        $this->assertTrue($experienciaLaboral->hasCast('fecha_inicio', 'date'));
        $this->assertTrue($experienciaLaboral->hasCast('fecha_fin', 'date'));
    }

    /** @test */
    public function it_uses_has_factory()
    {
        $experienciaLaboral = new ExperienciaLaboral();
        $this->assertTrue(in_array('Illuminate\\Database\\Eloquent\\Factories\\HasFactory', class_uses_recursive($experienciaLaboral)));
    }
}