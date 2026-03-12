<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    // Create Stripe PaymentIntent
    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0.5'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $paymentIntent = PaymentIntent::create([
            'amount' => $request->amount * 100,
            'currency' => 'usd',
        ]);

        return response()->json(['clientSecret' => $paymentIntent->client_secret]);
    }

    // Store payment after Stripe confirmation
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,order_id', // ✅ Added: validate order
            'amount' => 'required|numeric',
            'stripe_payment_id' => 'required|string|unique:payments,stripe_payment_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // ✅ Important: status always set server-side
        $payment = Payment::create([
            'order_id' => $request->order_id,
            'amount' => $request->amount,
            'stripe_payment_id' => $request->stripe_payment_id,
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment
        ], 201);
    }
}


// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Payment;
// use Illuminate\Support\Facades\Validator;
// use Stripe\Stripe;
// use Stripe\PaymentIntent;

// class PaymentController extends Controller
// {
//     // Create Stripe PaymentIntent
//     public function createPaymentIntent(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'amount' => 'required|numeric|min:0.5'
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         Stripe::setApiKey(env('STRIPE_SECRET'));

//         $paymentIntent = PaymentIntent::create([
//             'amount' => $request->amount * 100, // cents
//             'currency' => 'usd',
//         ]);

//         return response()->json(['clientSecret' => $paymentIntent->client_secret]);
//     }

//     // Store payment after Stripe confirmation
//     public function store(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'amount' => 'required|numeric',
//             'stripe_payment_id' => 'required|string|unique:payments,stripe_payment_id',
//             'status' => 'required|in:pending,completed,failed',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         $payment = Payment::create($request->all());

//         return response()->json([
//             'message' => 'Payment created successfully',
//             'payment' => $payment
//         ], 201);
//     }
// }