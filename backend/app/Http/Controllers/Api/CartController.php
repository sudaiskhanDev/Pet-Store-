<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    // List all cart items
    public function index()
    {
        $carts = Cart::with(['user', 'product'])->get();
        return response()->json($carts);
    }

    // Add item to cart
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $cart = Cart::create($request->all());

        return response()->json([
            'message' => 'Cart item added successfully',
            'cart' => $cart
        ], 201);
    }

    // Show single cart item
    public function show($id)
    {
        $cart = Cart::with(['user', 'product'])->find($id);
        if (!$cart) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        return response()->json($cart);
    }

    // Update cart item
    public function update(Request $request, $id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'sometimes|integer|min:1',
            'user_id' => 'sometimes|exists:users,id',
            'product_id' => 'sometimes|exists:products,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $cart->update($request->all());

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart' => $cart
        ]);
    }

    // Delete cart item
    public function destroy($id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cart->delete();

        return response()->json(['message' => 'Cart item deleted successfully']);
    }
}