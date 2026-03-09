<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    // ==========================
    // List all cart items for current user
    // ==========================
    public function index()
    {
        $carts = Cart::with('product')
                     ->where('user_id', auth()->id())
                     ->get();

        return response()->json($carts);
    }

    // ==========================
    // Add item to cart with duplicate prevention
    // ==========================
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Check if cart item already exists
        $cart = Cart::firstOrNew([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id
        ]);

        // Increment quantity if exists, otherwise set initial
        $cart->quantity = ($cart->exists ? $cart->quantity + $request->quantity : $request->quantity);
        $cart->save();

        return response()->json([
            'message' => 'Cart item added successfully',
            'cart' => $cart
        ], 201);
    }

    // ==========================
    // Show single cart item (only if it belongs to current user)
    // ==========================
    public function show($id)
    {
        $cart = Cart::with('product')->find($id);

        if (!$cart || $cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Cart item not found or unauthorized'], 404);
        }

        return response()->json($cart);
    }

    // ==========================
    // Update cart item (only quantity)
    // ==========================
    public function update(Request $request, $id)
    {
        $cart = Cart::find($id);

        if (!$cart || $cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Cart item not found or unauthorized'], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart' => $cart
        ]);
    }

    // ==========================
    // Delete cart item (soft delete recommended)
    // ==========================
    public function destroy($id)
    {
        $cart = Cart::find($id);

        if (!$cart || $cart->user_id !== auth()->id()) {
            return response()->json(['message' => 'Cart item not found or unauthorized'], 404);
        }

        $cart->delete();

        return response()->json(['message' => 'Cart item deleted successfully']);
    }
}
























// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Cart;
// use Illuminate\Support\Facades\Validator;

// class CartController extends Controller
// {
//     // List all cart items
//     public function index()
//     {
//        $carts = Cart::with('product')->where('user_id', auth()->id())->get();
//         return response()->json($carts);
//     }

//     // Add item to cart
//     public function store(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'user_id' => 'required|exists:users,id',
//             'product_id' => 'required|exists:products,product_id',
//             'quantity' => 'required|integer|min:1',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         $cart = Cart::create($request->all());

//         return response()->json([
//             'message' => 'Cart item added successfully',
//             'cart' => $cart
//         ], 201);
//     }

//     // Show single cart item
//     public function show($id)
//     {
//         $cart = Cart::with(['user', 'product'])->find($id);
//         if (!$cart) {
//             return response()->json(['message' => 'Cart item not found'], 404);
//         }

//         return response()->json($cart);
//     }

//     // Update cart item
//     public function update(Request $request, $id)
//     {
//         $cart = Cart::find($id);
//         if (!$cart) {
//             return response()->json(['message' => 'Cart item not found'], 404);
//         }

//         $validator = Validator::make($request->all(), [
//             'quantity' => 'sometimes|integer|min:1',
//             'user_id' => 'sometimes|exists:users,id',
//             'product_id' => 'sometimes|exists:products,product_id',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         $cart->update($request->all());

//         return response()->json([
//             'message' => 'Cart item updated successfully',
//             'cart' => $cart
//         ]);
//     }

//     // Delete cart item
//     public function destroy($id)
//     {
//         $cart = Cart::find($id);
//         if (!$cart) {
//             return response()->json(['message' => 'Cart item not found'], 404);
//         }

//         $cart->delete();

//         return response()->json(['message' => 'Cart item deleted successfully']);
//     }
// }