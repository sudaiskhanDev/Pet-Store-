<?php

use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);       // List all
    Route::get('/{id}', [PaymentController::class, 'show']);    // Single
    Route::delete('/{id}', [PaymentController::class, 'destroy']); // Delete
});