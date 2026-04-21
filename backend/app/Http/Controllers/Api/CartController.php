<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    // List all cart items for current user
    public function index()
    {
        $carts = Cart::with('product')
                     ->where('user_id', auth()->id())
                     ->get();

        return response()->json($carts);
    }

    // Add item to cart
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $cart = Cart::firstOrNew([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id
        ]);

        $cart->quantity = ($cart->exists ? $cart->quantity + $request->quantity : $request->quantity);
        $cart->save();

        return response()->json(['message' => 'Cart item added', 'cart' => $cart], 201);
    }

    // Update quantity
    public function update(Request $request, $id)
    {
        $cart = Cart::find($id);
        if (!$cart || $cart->user_id != auth()->id()) return response()->json(['message'=>'Unauthorized'], 403);

        $validator = Validator::make($request->all(), ['quantity'=>'required|integer|min:1']);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json(['message'=>'Cart updated','cart'=>$cart]);
    }

    // Delete cart item
    public function destroy($id)
    {
        $cart = Cart::find($id);
        if (!$cart || $cart->user_id != auth()->id()) return response()->json(['message'=>'Unauthorized'], 403);

        $cart->delete();
        return response()->json(['message'=>'Cart deleted']);
    }
}




 