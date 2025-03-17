<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleAndAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $coordinadorRole = Role::firstOrCreate(['name' => 'coordinador']);
        $egresadoRole = Role::firstOrCreate(['name' => 'egresado']);

        // Create admin user if it doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'role_id' => 1  // Explicitly set role_id to 1 for admin
            ]
        );

        // Assign admin role to admin user
        $admin->assignRole($adminRole);
    }
}