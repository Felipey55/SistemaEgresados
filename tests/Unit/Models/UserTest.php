<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Egresado;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_one_egresado()
    {
        $user = User::factory()->create();
        $egresado = Egresado::factory()->create([
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(Egresado::class, $user->egresado);
        $this->assertEquals($egresado->id, $user->egresado->id);
    }

    public function test_user_fillable_attributes()
    {
        $fillable = [
            'name',
            'email',
            'password',
            'role_id'
        ];

        $user = new User();
        $this->assertEquals($fillable, $user->getFillable());
    }

    public function test_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => 'password123'
        ]);

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_hidden_attributes()
    {
        $hidden = [
            'password',
            'remember_token'
        ];

        $user = new User();
        $this->assertEquals($hidden, $user->getHidden());
    }
}