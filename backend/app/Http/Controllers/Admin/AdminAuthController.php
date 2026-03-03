<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = auth('admin')->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token
        ]);
    }

    public function me()
    {
        return response()->json(auth('admin')->user());
    }

    public function logout()
    {
        auth('admin')->logout();
        return response()->json(['message' => 'Logged out']);
    }
}