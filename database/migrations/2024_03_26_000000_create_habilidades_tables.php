<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('habilidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->enum('tipo', ['tecnica', 'blanda']);
            $table->timestamps();
        });

        Schema::create('egresado_habilidad', function (Blueprint $table) {
            $table->foreignId('egresado_id')->constrained('egresados')->onDelete('cascade');
            $table->foreignId('habilidad_id')->constrained('habilidades')->onDelete('cascade');
            $table->primary(['egresado_id', 'habilidad_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('egresado_habilidad');
        Schema::dropIfExists('habilidades');
    }
};