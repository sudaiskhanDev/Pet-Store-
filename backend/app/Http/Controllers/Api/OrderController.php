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

    
    public function myOrders()
{
    $userId = auth()->id();

    $orders = Order::where('user_id', $userId)
                   ->latest()
                   ->get();

    return response()->json($orders);
}

    // Store a new order
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'order_date' => 'required|date',
            'status' => 'required|string|max:50',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
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

    // Show a single order

    public function show($id)
{
    $order = Order::with(['orderItems.product'])
        ->where('order_id', $id)
        ->first();

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    return response()->json([
        'status' => true,
        'data' => $order
    ]);
}
    // public function show($id)
    // {
    //     $order = Order::with('user')->find($id);
    //     if (!$order) {
    //         return response()->json(['message' => 'Order not found'], 404);
    //     }

    //     return response()->json($order);
    // }

    // Update an order
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'order_date' => 'required|date',
            'status' => 'required|string|max:50',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'phone' => 'required|string|max:20',
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

    // Delete an order
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }



    public function deleteMyOrder($id)
{
    $order = Order::where('order_id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    $order->delete();

    return response()->json([
        'message' => 'Order deleted successfully'
    ]);
}


}