<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('email', 'carpipesr@gmail.com')->first();
        $role = Role::where('name', 'Admin')->first();

        if ($user && $role) {
            $user->assignRole($role);
            echo "Rol 'Admin' asignado correctamente.\n";
        } else {
            echo "No se encontró el usuario o el rol.\n";
        }
    }
}
