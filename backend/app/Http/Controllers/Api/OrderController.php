<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    // List all orders
    public function index()
    {
        $orders = Order::with('user')->get();
        return response()->json($orders);
    }

    // Create new order
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'order_date' => 'required|date',
            'status' => 'nullable|string',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
            'phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $order = Order::create($request->all());

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    }

    // Show single order
    public function show($id)
    {
        $order = Order::with('user')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    // Update order
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|required|exists:users,id',
            'order_date' => 'sometimes|required|date',
            'status' => 'nullable|string',
            'total_amount' => 'sometimes|required|numeric',
            'payment_method' => 'sometimes|required|string',
            'shipping_address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $order->update($request->all());

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }

    // Delete order
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}