<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Tests\TestCase;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
                '_token' => 'test-token'
            ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/dashboard');
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->post('/logout', ['_token' => 'test-token']);

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}