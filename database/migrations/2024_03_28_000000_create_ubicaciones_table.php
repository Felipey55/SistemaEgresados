<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ubicaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('egresado_id')->unique()->constrained('egresados')->onDelete('cascade');
            $table->decimal('latitud', 10, 8)->nullable(false);
            $table->decimal('longitud', 11, 8)->nullable(false);
            $table->timestamps();

            $table->index('egresado_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ubicaciones');
    }
};