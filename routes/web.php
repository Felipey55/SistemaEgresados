<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GraduateRegistrationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\RolModController;
use App\Models\User;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/modUsers', function () {
        return Inertia::render('mod-users', [
            'users' => App\Models\User::all()
        ]);
    })->name('modUsers'); 

    Route::get('/user-mod/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/user-mod/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/user-mod/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/regEgresados', function () {
        return Inertia::render('registroEgresado');
    })->name('regEgresados');

    Route::post('/graduate', [GraduateRegistrationController::class, 'store'])->name('graduate.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
