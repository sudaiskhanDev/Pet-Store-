<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserAuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address
        ]);

        return response()->json([
            'message' => 'User Registered Successfully'
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('user')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        return response()->json([
            'message' => 'Login Successful',
            'token' => $token,
            'user' => auth('user')->user()
        ]);
    }

    // LOGOUT
    public function logout()
    {
        auth('user')->logout();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // GET CURRENT USER
    public function me()
    {
        return response()->json(auth('user')->user());
    }
}