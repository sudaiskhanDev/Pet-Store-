<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|in:cod,card',
            'payment_id' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();

        try {
            // ------------------ STOCK VALIDATION ------------------
            $productTotals = [];
            foreach ($cartItems as $item) {
                if (!$item->product) {
                    DB::rollBack();
                    return response()->json(['message' => "Product ID {$item->product_id} not found"], 400);
                }
                $pid = $item->product_id;
                $productTotals[$pid] = ($productTotals[$pid] ?? 0) + $item->quantity;
            }

            foreach ($productTotals as $pid => $totalQty) {
                $product = $cartItems->firstWhere('product_id', $pid)->product;
                if (!$product) {
                    DB::rollBack();
                    return response()->json(['message' => "Product ID {$pid} not found"], 400);
                }

                if ($totalQty > $product->stock_quantity) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Insufficient stock for '{$product->name}'. Only {$product->stock_quantity} available."
                    ], 400);
                }
            }

            // ------------------ CALCULATE TOTAL ------------------
            $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

            // ------------------ CREATE ORDER ------------------
            $order = Order::create([
                'user_id' => $user->id,
                'order_date' => now(),
                'status' => $request->payment_method === 'cod' ? 'pending' : 'paid',
                'total_amount' => $total,
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
            ]);

            // ------------------ CREATE ORDER ITEMS ------------------
            $orderItems = [];
            foreach ($cartItems as $item) {
                $orderItems[] = [
                    'order_id' => $order->order_id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            OrderItem::insert($orderItems);

            // ------------------ DECREASE PRODUCT STOCK SAFELY ------------------
            foreach ($productTotals as $pid => $totalQty) {
                $product = $cartItems->firstWhere('product_id', $pid)->product;

                if ($product && $totalQty <= $product->stock_quantity) {
                    $product->stock_quantity -= $totalQty;
                    if ($product->stock_quantity <= 0) {
                        $product->stock_quantity = 0;
                        $product->status = 'out_of_stock';
                    }
                    $product->save();
                }
            }

            // ------------------ PAYMENT ------------------
            if ($request->payment_method === 'card' && $request->payment_id) {
                Payment::create([
                    'order_id' => $order->order_id,
                    'amount' => $total,
                    'stripe_payment_id' => $request->payment_id,
                    'status' => 'completed',
                ]);
            }

            // ------------------ CLEAR CART ------------------
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
                'order_items' => $orderItems,
                'total_amount' => $total
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Checkout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}













// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Cart;
// use App\Models\Order;
// use App\Models\OrderItem;
// use App\Models\Payment;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Validator;

// class CheckoutController extends Controller
// {
//     public function checkout(Request $request)
//     {
//         $user = auth()->user();

//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         $validator = Validator::make($request->all(), [
//             'shipping_address' => 'required|string|max:255',
//             'phone' => 'required|string|max:20',
//             'payment_method' => 'required|in:cod,card',
//             'payment_id' => 'nullable|string'
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
//         }

//         // ✅ Load cart items
//         $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
//         if ($cartItems->isEmpty()) {
//             return response()->json(['message' => 'Cart is empty'], 400);
//         }

//         // ✅ Stock validation
//         foreach ($cartItems as $item) {
//             if (!$item->product) {
//                 return response()->json(['message' => "Product {$item->product_id} not found"], 400);
//             }
//             if ($item->quantity > $item->product->stock_quantity) {
//                 return response()->json([
//                     'message' => "Product {$item->product->name} has only {$item->product->stock_quantity} in stock"
//                 ], 400);
//             }
//         }

//         // ✅ Server-side total calculation (avoid frontend tampering)
//         $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

//         DB::beginTransaction();

//         try {
//             // Create order
//             $order = Order::create([
//                 'user_id' => $user->id,
//                 'order_date' => now(),
//                 'status' => $request->payment_method === 'cod' ? 'pending' : 'paid',
//                 'total_amount' => $total,
//                 'payment_method' => $request->payment_method,
//                 'shipping_address' => $request->shipping_address,
//                 'phone' => $request->phone,
//             ]);

//             // Create order items
//             $orderItems = [];
//             foreach ($cartItems as $item) {
//                 $orderItems[] = [
//                     'order_id' => $order->order_id,
//                     'product_id' => $item->product_id,
//                     'quantity' => $item->quantity,
//                     'price' => $item->product->price,
//                     'created_at' => now(),
//                     'updated_at' => now(),
//                 ];
//             }
//             OrderItem::insert($orderItems);

//             // ✅ Decrease stock after order
//             foreach ($cartItems as $item) {
//                 $item->product->decrement('stock_quantity', $item->quantity);

//                 // Optional: mark out-of-stock
//                 if ($item->product->stock_quantity <= 0) {
//                     $item->product->status = 'out_of_stock';
//                     $item->product->save();
//                 }
//             }

//             // ✅ Only store payment if card and payment_id exists
//             if ($request->payment_method === 'card' && $request->payment_id) {
//                 Payment::create([
//                     'order_id' => $order->order_id, // ✅ Link payment to order
//                     'amount' => $total,
//                     'stripe_payment_id' => $request->payment_id,
//                     'status' => 'completed', // ✅ Never trust client
//                 ]);
//             }

//             // Clear cart
//             Cart::where('user_id', $user->id)->delete();

//             DB::commit();

//             return response()->json([
//                 'message' => 'Order placed successfully',
//                 'order' => $order,
//                 'order_items' => $orderItems,
//                 'total_amount' => $total
//             ], 201);

//         } catch (\Exception $e) {
//             DB::rollBack();
//             return response()->json([
//                 'message' => 'Checkout failed',
//                 'error' => $e->getMessage()
//             ], 500);
//         }
//     }
// }






















// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Cart;
// use App\Models\Order;
// use App\Models\OrderItem;
// use App\Models\Payment;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Validator;

// class CheckoutController extends Controller
// {
//     public function checkout(Request $request)
//     {
//         $user = auth()->user();

//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         $validator = Validator::make($request->all(), [
//             'shipping_address' => 'required|string|max:255',
//             'phone' => 'required|string|max:20',
//             'payment_method' => 'required|in:cod,card',
//             'payment_id' => 'nullable|string'
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
//         }

//         // ✅ Load cart items
//         $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
//         if ($cartItems->isEmpty()) {
//             return response()->json(['message' => 'Cart is empty'], 400);
//         }

//         // ✅ Server-side total calculation (avoid frontend tampering)
//         $total = $cartItems->sum(fn($item) => $item->product?->price * $item->quantity ?? 0);

//         DB::beginTransaction();

//         try {
//             // Create order
//             $order = Order::create([
//                 'user_id' => $user->id,
//                 'order_date' => now(),
//                 'status' => $request->payment_method === 'cod' ? 'pending' : 'paid',
//                 'total_amount' => $total,
//                 'payment_method' => $request->payment_method,
//                 'shipping_address' => $request->shipping_address,
//                 'phone' => $request->phone,
//             ]);

//             // Create order items
//             $orderItems = [];
//             foreach ($cartItems as $item) {
//                 $orderItems[] = [
//                     'order_id' => $order->order_id,
//                     'product_id' => $item->product_id,
//                     'quantity' => $item->quantity,
//                     'price' => $item->product?->price ?? 0,
//                     'created_at' => now(),
//                     'updated_at' => now(),
//                 ];
//             }
//             OrderItem::insert($orderItems);

//             // ✅ Only store payment if card and payment_id exists
//             if ($request->payment_method === 'card' && $request->payment_id) {
//                 Payment::create([
//                     'order_id' => $order->order_id, // ✅ Link payment to order
//                     'amount' => $total,
//                     'stripe_payment_id' => $request->payment_id,
//                     'status' => 'completed', // ✅ Never trust client
//                 ]);
//             }

//             // Clear cart
//             Cart::where('user_id', $user->id)->delete();

//             DB::commit();

//             return response()->json([
//                 'message' => 'Order placed successfully',
//                 'order' => $order
//             ], 201);

//         } catch (\Exception $e) {
//             DB::rollBack();
//             return response()->json([
//                 'message' => 'Checkout failed',
//                 'error' => $e->getMessage()
//             ], 500);
//         }
//     }
// } 
