<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $coordinadorRole = Role::create(['name' => 'Coordinador']);
        $egresadoRole = Role::create(['name' => 'Egresado']);

        // Create permissions
        Permission::create(['name' => 'access.admin.panel']);
        Permission::create(['name' => 'manage.users']);
        Permission::create(['name' => 'access.coordinator.panel']);
        Permission::create(['name' => 'manage.graduates']);
        Permission::create(['name' => 'access.graduate.panel']);
        Permission::create(['name' => 'update.profile']);

        // Assign permissions to roles
        $adminRole->givePermissionTo([
            'access.admin.panel',
            'manage.users',
            'access.coordinator.panel',
            'manage.graduates',
            'access.graduate.panel',
            'update.profile'
        ]);

        $coordinadorRole->givePermissionTo([
            'access.coordinator.panel',
            'manage.graduates',
            'update.profile'
        ]);

        $egresadoRole->givePermissionTo([
            'access.graduate.panel',
            'update.profile'
        ]);
    }
}