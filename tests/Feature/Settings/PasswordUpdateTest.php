<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->put('/settings/password', [
                'current_password' => 'password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
                '_token' => 'test-token'
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_correct_password_must_be_provided_to_update_password()
    {
        $user = User::factory()->create();
        $oldPassword = $user->password;

        $response = $this->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->withCookie('XSRF-TOKEN', 'test-token')
            ->put('/settings/password', [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
                '_token' => 'test-token'
            ]);

        $response->assertSessionHasErrors();
        $this->assertTrue(Hash::check('password', $user->fresh()->password));
        $this->assertEquals($oldPassword, $user->fresh()->password);
    }
}
