<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    // Checkout page / place order
    public function checkout(Request $request)
    {
        $user = auth()->user();

        // Load cart items
        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Calculate total amount
        $total = $cartItems->sum(function($item){
            return $item->product->price * $item->quantity;
        });

        // Begin transaction
        DB::beginTransaction();
        try {
            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_date' => now(),
                'status' => 'pending',
                'total_amount' => $total,
                'payment_method' => $request->payment_method ?? 'cod',
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
            ]);

            // Create Order Items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);
            }

            // Optionally, create payment record if using online payment
            if ($request->payment_id) {
                Payment::create([
                    'order_id' => $order->order_id,
                    'amount' => $total,
                    'stripe_payment_id' => $request->payment_id,
                    'status' => 'paid',
                ]);
            }

            // Clear user's cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed', 'error' => $e->getMessage()], 500);
        }
    }
}