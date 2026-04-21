<?php
 
 
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});


Route::middleware('auth:api')->get('/my-orders', [OrderController::class, 'myOrders']);
Route::middleware('auth:api')->delete('/my-orders/{id}', [OrderController::class, 'deleteMyOrder']);

use App\Http\Controllers\Api\CheckoutController;

Route::middleware('auth:api')->group(function(){
    Route::post('/checkout', [CheckoutController::class,'placeOrder']);
    Route::middleware('auth:api')->delete('/my-orders/{id}', [OrderController::class, 'deleteMyOrder']);
});