<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('experiencias_laborales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('egresado_id')->constrained('egresados')->onDelete('cascade');
            $table->enum('tipo_empleo', ['Tiempo Completo', 'Medio Tiempo', 'Freelance', 'Otro'])->nullable(false);
            $table->string('nombre_empresa', 100)->nullable(false);
            $table->date('fecha_inicio')->nullable(false);
            $table->date('fecha_fin')->nullable();
            $table->text('servicios')->nullable();
            $table->string('correo_empresa', 100)->nullable();
            $table->string('url_empresa', 255)->nullable();
            $table->enum('modalidad_trabajo', ['Presencial', 'Remoto', 'Híbrido'])->nullable(false);
            $table->text('descripcion')->nullable();
            $table->timestamps();

            $table->index('egresado_id');
            $table->index('tipo_empleo');
            $table->index('modalidad_trabajo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('experiencias_laborales');
    }
};