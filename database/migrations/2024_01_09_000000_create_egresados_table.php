<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('egresados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('identificacion_tipo', ['C.C.', 'C.E.'])->nullable(false);
            $table->string('identificacion_numero', 20)->nullable(false);
            $table->string('fotografia')->nullable();
            $table->string('celular', 15)->nullable();
            $table->string('direccion', 255)->nullable();
            $table->date('fecha_nacimiento')->nullable(false);
            $table->timestamps();

            $table->unique(['identificacion_tipo', 'identificacion_numero']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('egresados');
    }
};