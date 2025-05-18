<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formacion_academica', function (Blueprint $table) {
            $table->id();
            $table->foreignId('egresado_id')->constrained('egresados')->onDelete('cascade');
            $table->string('titulo', 100);
            $table->string('institucion', 100);
            $table->enum('tipo', ['Pregrado', 'Especialización', 'Maestría', 'Doctorado']);
            $table->date('fecha_realizacion');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formacion_academica');
    }
};