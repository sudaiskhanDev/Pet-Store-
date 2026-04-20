<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Validator;

class OrderItemController extends Controller
{
    // List all order items
    public function index()
{
    $items = OrderItem::with(['order', 'product'])->get();

    return response()->json([
        'status' => true,
        'data' => $items
    ]);
}
//     public function index()
//     {
//         $items = OrderItem::with('order')->get();
//         return response()->json($items);

//         $items = OrderItem::with('product')->get();

// return response()->json([
//     'status' => true,
//     'data' => OrderItem::with('product')->get()
// ]);
//     }

    // Store new order item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,order_id',
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $item = OrderItem::create($request->all());

        return response()->json([
            'message' => 'Order item created successfully',
            'item' => $item
        ], 201);
    }

    // Show single item
    public function show($id)
    {
        $item = OrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Order item not found'], 404);
        }

        return response()->json($item);
    }

    // Update item
    public function update(Request $request, $id)
    {
        $item = OrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Order item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,order_id',
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $item->update($request->all());

        return response()->json([
            'message' => 'Order item updated successfully',
            'item' => $item
        ]);
    }

    // Delete item
    public function destroy($id)
    {
        $item = OrderItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Order item not found'], 404);
        }

        $item->delete();

        return response()->json([
            'message' => 'Order item deleted successfully'
        ]);
    }
}