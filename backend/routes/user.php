<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;

Route::prefix('user')->group(function () {

    // Public Routes
    Route::post('/register', [UserAuthController::class, 'register']);
    Route::post('/login', [UserAuthController::class, 'login']);

    // Protected Routes (JWT Auth)
    Route::middleware('auth:user')->group(function () {
        Route::get('/me', [UserAuthController::class, 'me']);
        Route::post('/logout', [UserAuthController::class, 'logout']);
    });

});