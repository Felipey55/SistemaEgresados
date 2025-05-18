<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GraduateRegistrationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ExperienciaLaboralController;
use App\Http\Controllers\RolModController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\FormacionAcademicaController;
use App\Http\Controllers\HabilidadController;
use App\Http\Controllers\PerfilEgresadosController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\AdminReportController;
use App\Models\User;
use App\Models\ExperienciaLaboral;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas de Habilidades
    Route::get('/habilidades', [HabilidadController::class, 'index'])->name('habilidades.index');
    Route::post('/habilidades/agregar', [HabilidadController::class, 'agregarHabilidades'])->name('habilidades.agregar');
    Route::get('/habilidades/obtener', [HabilidadController::class, 'obtenerHabilidades'])->name('habilidades.obtener');
    Route::get('/habilidades/editar', [HabilidadController::class, 'editar'])->name('habilidades.editar');
    Route::post('/habilidades/eliminar', [HabilidadController::class, 'eliminar'])->name('habilidades.eliminar');
    Route::post('/habilidades/actualizar', [HabilidadController::class, 'actualizar'])->name('habilidades.actualizar');

    // Rutas para perfiles de egresados
    Route::get('/PerfilesEgresados', [\App\Http\Controllers\PerfilEgresadosController::class, 'index'])->name('perfiles.egresados');
    Route::get('/Egresados/detalle/{id}', [\App\Http\Controllers\PerfilEgresadosController::class, 'detalle'])->name('egresado.detalle');

    Route::get('/historial-laboral', function () {
        $user = \Illuminate\Support\Facades\Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();

        if (!$egresado) {
            return redirect()->route('register');
        }

        return Inertia::render('Egresados/historial-laboral');
    })->name('historial-laboral');

    Route::post('/experiencia', [ExperienciaLaboralController::class, 'store'])->name('experiencia.store');
    Route::get('dashboard', function () {
        $reportes = app(AdminReportController::class)->index();
        return Inertia::render('dashboard', $reportes);
    })->name('dashboard');

    Route::get('/modUsers', function () {
        return Inertia::render('mod-users', [
            'users' => App\Models\User::all()
        ]);
    })->name('modUsers');

    Route::get('/user-mod/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/user-mod/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/user-mod/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/Egresados/regEgresados', function () {
        return Inertia::render('Egresados/registroEgresado');
    })->name('regEgresados');

    Route::post('/graduate', [GraduateRegistrationController::class, 'store'])->name('graduate.store');

    Route::get('/Egresados/formacion-academica', function () {
        $user = \Illuminate\Support\Facades\Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();

        if (!$egresado) {
            return redirect()->route('register');
        }

        return Inertia::render('Egresados/formacion-academica');
    })->name('formacion-academica');

    Route::get('/Egresados/perfil', function () {
        return Inertia::render('Egresados/perfil-egresado');
    })->name('egresado.perfil');

    Route::get('/formacion-academica/{id}/edit', function ($id) {
        return Inertia::render('Egresados/editar-formacion-academica', ['id' => $id]);
    })->name('formacion-academica.edit');

    Route::get('/experiencia-laboral/{id}/edit', function ($id) {
        $experiencia = ExperienciaLaboral::findOrFail($id);
        return Inertia::render('Egresados/experiencia-laboral-edit', [
            'experiencia' => $experiencia
        ]);
    })->name('experiencia-laboral.edit');



    Route::prefix('api')->group(function () {
        Route::get('/obtener-ubicaciones', [UbicacionController::class, 'obtenerUbicaciones'])->name('api.ubicaciones.obtener');

        Route::prefix('egresado')->group(function () {
            Route::get('/verificar-registro', [\App\Http\Controllers\EgresadoController::class, 'verificarRegistroCompleto'])->name('api.egresado.verificar-registro');
            Route::get('/perfil', [\App\Http\Controllers\EgresadoController::class, 'obtenerPerfil'])->name('api.egresado.perfil');
            Route::get('/datos', [\App\Http\Controllers\EgresadoController::class, 'obtenerDatos'])->name('api.egresado.datos');
            Route::get('/detalle/{id}', [\App\Http\Controllers\EgresadoController::class, 'detalle'])->name('api.egresado.detalle');
        });
    });
    // Ruta para ver noticias
    Route::get('/VerNoticias', [NoticiaController::class, 'verNoticias'])->name('noticias.ver');

    Route::post('/api/guardar-ubicacion', [UbicacionController::class, 'store'])->name('api.ubicacion.store');
    Route::get('/api/verificar-ubicacion', [UbicacionController::class, 'verificarUbicacion'])->name('api.ubicacion.verificar');
    Route::put('/api/actualizar-ubicacion', [UbicacionController::class, 'update'])->name('api.ubicacion.actualizar');

    // Rutas para ubicaciones de egresados
    Route::prefix('ubicaciones')->group(function () {
        Route::get('/', [\App\Http\Controllers\UbicacionController::class, 'index'])->name('ubicaciones.index');
        Route::post('/', [\App\Http\Controllers\UbicacionController::class, 'store'])->name('ubicaciones.store');
        Route::get('/{ubicacion}', [\App\Http\Controllers\UbicacionController::class, 'show'])->name('ubicaciones.show');
        Route::put('/{ubicacion}', [\App\Http\Controllers\UbicacionController::class, 'update'])->name('ubicaciones.update');
        Route::delete('/{ubicacion}', [\App\Http\Controllers\UbicacionController::class, 'destroy'])->name('ubicaciones.destroy');
    });

    Route::get('/Egresados/editar', function () {
        return Inertia::render('Egresados/editar-egresado');
    })->name('regEgresados.edit');

    Route::put('/egresado/update', [\App\Http\Controllers\EgresadoController::class, 'update'])->name('egresado.update');
    Route::put('/experiencia/update/{experienciaLaboral}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'update'])->name('experiencia.update');
    Route::put('/formacion/update/{id}', [\App\Http\Controllers\FormacionAcademicaController::class, 'update'])->name('formacion.update');

    Route::get('/api/experiencia/{id}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'show'])->name('api.experiencia.show');
    Route::get('/api/experiencia/datos/{id}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'obtenerDatos'])->name('api.experiencia.datos');
    Route::get('/api/formacion/datos/{id?}', [\App\Http\Controllers\FormacionAcademicaController::class, 'datos'])->name('api.formacion.datos');

    Route::post('/formacion', [FormacionAcademicaController::class, 'store'])->name('formacion.store');

    // Noticias routes
    Route::resource('noticias', NoticiaController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
