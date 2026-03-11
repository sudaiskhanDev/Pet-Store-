<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    // List all payments
    public function index()
    {
        $payments = Payment::with('order')->get();
        return response()->json($payments);
    }

    // Store a new payment
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric',
            'stripe_payment_id' => 'required|string|unique:payments,stripe_payment_id',
            'status' => 'required|in:pending,completed,failed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment = Payment::create($request->all());

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment
        ], 201);
    }

    // Show a single payment
    public function show($id)
    {
        $payment = Payment::with('order')->find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }
        return response()->json($payment);
    }

    // Update a payment
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric',
            'stripe_payment_id' => 'required|string|unique:payments,stripe_payment_id,'.$id.',id',
            'status' => 'required|in:pending,completed,failed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment->update($request->all());

        return response()->json([
            'message' => 'Payment updated successfully',
            'payment' => $payment
        ]);
    }

    // Delete a payment
    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}