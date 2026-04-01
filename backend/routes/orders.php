<?php
 
 
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);    // list user orders only
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});


// Route::prefix('orders')->group(function () {
//     Route::get('/', [OrderController::class, 'index']);
//     Route::post('/', [OrderController::class, 'store']);
//     Route::get('/{id}', [OrderController::class, 'show']);
//     Route::put('/{id}', [OrderController::class, 'update']);
//     Route::delete('/{id}', [OrderController::class, 'destroy']);
// });
use App\Http\Controllers\Api\CheckoutController;

Route::middleware('auth:api')->group(function(){
    Route::post('/checkout', [CheckoutController::class,'placeOrder']);
});