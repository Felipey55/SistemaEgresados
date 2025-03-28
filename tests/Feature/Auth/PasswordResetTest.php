<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered()
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->post('/forgot-password', [
                'email' => $user->email,
                '_token' => 'test-token'
            ])->assertStatus(302);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset_with_valid_token()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->post('/forgot-password', [
                'email' => $user->email,
                '_token' => 'test-token'
            ])->assertStatus(302);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $this->withSession(['_token' => 'test-token'])
                ->withCookie('XSRF-TOKEN', 'test-token')
                ->post('/reset-password', [
                    'token' => $notification->token,
                    'email' => $user->email,
                    'password' => 'new-password',
                    'password_confirmation' => 'new-password',
                    '_token' => 'test-token'
                ])->assertSessionHasNoErrors()
                  ->assertRedirect('/login');

            return true;
        });
    }
}