<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // List all products with category and animal names
    public function index()
{
    $products = Product::with(['category','animal'])->get()->map(function($product) {
        return [
            'product_id'    => $product->product_id,
            'name'          => $product->name,
            'description'   => $product->description ?? 'NA',
            'price'         => $product->price,
            'stock_quantity'=> $product->stock_quantity ?? 'NA',
            'image'         => $product->image ?? 'NA',
            'category_id'   => $product->category_id,
            'category_name' => $product->category?->category_name ?? 'NA',
            'animal_id'     => $product->animal_id,
            'animal_name'   => $product->animal?->animal_name ?? 'NA',
            'created_at'    => $product->created_at,
            'updated_at'    => $product->updated_at,
        ];
    });

    return response()->json([
        'status' => true,
        'products' => $products
    ]);
}
   
   public function latestProducts()
{
    $products = Product::with(['category', 'animal'])
        ->latest('created_at')   // clearly define sorting
        ->take(5)
        ->get();

    $data = $products->map(function ($product) {
        return [
            'product_id'     => $product->product_id,
            'name'           => $product->name,
            'description'    => $product->description ?? 'NA',
            'price'          => $product->price,
            'stock_quantity' => $product->stock_quantity ?? 0,
            'image'          => $product->image 
                                ? asset('storage/' . $product->image)
                                : null,

            'category_id'    => $product->category_id,
            'category_name'  => $product->category?->category_name ?? 'NA',

            'animal_id'      => $product->animal_id,
            'animal_name'    => $product->animal?->animal_name ?? 'NA',

            'created_at'     => $product->created_at,
        ];
    });

    return response()->json([
        'status' => true,
        'data' => $data
    ]);
}
// Search products by name, category, or animal
public function search(Request $request)
{
    $query = $request->query('q'); // ?q=term from frontend

    if (!$query) {
        return response()->json([
            'status' => false,
            'message' => 'No search term provided',
            'products' => []
        ]);
    }

    $products = Product::with(['category','animal'])
        ->where('name', 'LIKE', "%{$query}%")
        ->orWhereHas('category', function($q) use ($query) {
            $q->where('category_name', 'LIKE', "%{$query}%");
        })
        ->orWhereHas('animal', function($q) use ($query) {
            $q->where('animal_name', 'LIKE', "%{$query}%");
        })
        ->get()
        ->map(function($product) {
            return [
                'product_id'    => $product->product_id,
                'name'          => $product->name,
                'description'   => $product->description ?? 'NA',
                'price'         => $product->price,
                'stock_quantity'=> $product->stock_quantity ?? 'NA',
                'image'         => $product->image ?? 'NA',
                'category_id'   => $product->category_id,
                'category_name' => $product->category?->category_name ?? 'NA',
                'animal_id'     => $product->animal_id,
                'animal_name'   => $product->animal?->animal_name ?? 'NA',
            ];
        });

    return response()->json([
        'status' => true,
        'products' => $products
    ]);
}


    // Store a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,category_id',
            'animal_id' => 'required|exists:animals,animal_id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    // Show a single product
    public function show($id)
{
    $product = Product::with(['category','animal'])->find($id);
    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $data = [
        'product_id'    => $product->product_id,
        'name'          => $product->name,
        'description'   => $product->description ?? 'NA',
        'price'         => $product->price,
        'stock_quantity'=> $product->stock_quantity ?? 'NA',
        'image'         => $product->image ?? 'NA',
        'category_id'   => $product->category_id,
        'category_name' => $product->category?->category_name ?? 'NA',
        'animal_id'     => $product->animal_id,
        'animal_name'   => $product->animal?->animal_name ?? 'NA',
        'created_at'    => $product->created_at,
        'updated_at'    => $product->updated_at,
    ];

    return response()->json($data);
}
    // public function show($id)
    // {
    //     $product = Product::with(['category','animal'])->find($id);
    //     if (!$product) {
    //         return response()->json(['message' => 'Product not found'], 404);
    //     }

    //     return response()->json($product);
    // }

    // Update a product
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,category_id',
            'animal_id' => 'required|exists:animals,animal_id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\Product;
// use Illuminate\Support\Facades\Validator;
// use Illuminate\Support\Facades\Storage;

// class ProductController extends Controller
// {
//     // List all products
//     public function index()
//     {
//         $products = Product::all();
//         return response()->json($products);
//     }

//     // Store a new product
//     public function store(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'category_id' => 'required|exists:categories,category_id',
//             'animal_id' => 'required|exists:animals,animal_id',
//             'name' => 'required|string|max:255',
//             'description' => 'nullable|string',
//             'price' => 'required|numeric',
//             'stock_quantity' => 'required|integer',
//             'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         $data = $request->all();

//         if ($request->hasFile('image')) {
//             $data['image'] = $request->file('image')->store('products', 'public');
//         }

//         $product = Product::create($data);

//         return response()->json([
//             'message' => 'Product created successfully',
//             'product' => $product
//         ], 201);
//     }

//     // Show a single product
//     public function show($id)
//     {
//         $product = Product::find($id);
//         if (!$product) {
//             return response()->json(['message' => 'Product not found'], 404);
//         }

//         return response()->json($product);
//     }

//     // Update a product
//     public function update(Request $request, $id)
//     {
//         $product = Product::find($id);
//         if (!$product) {
//             return response()->json(['message' => 'Product not found'], 404);
//         }

//         $validator = Validator::make($request->all(), [
//             'category_id' => 'required|exists:categories,category_id',
//             'animal_id' => 'required|exists:animals,animal_id',
//             'name' => 'required|string|max:255',
//             'description' => 'nullable|string',
//             'price' => 'required|numeric',
//             'stock_quantity' => 'required|integer',
//             'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         $data = $request->all();

//         if ($request->hasFile('image')) {
//             // Delete old image
//             if ($product->image && Storage::disk('public')->exists($product->image)) {
//                 Storage::disk('public')->delete($product->image);
//             }
//             $data['image'] = $request->file('image')->store('products', 'public');
//         }

//         $product->update($data);

//         return response()->json([
//             'message' => 'Product updated successfully',
//             'product' => $product
//         ]);
//     }

//     // Delete a product
//     public function destroy($id)
//     {
//         $product = Product::find($id);
//         if (!$product) {
//             return response()->json(['message' => 'Product not found'], 404);
//         }

//         if ($product->image && Storage::disk('public')->exists($product->image)) {
//             Storage::disk('public')->delete($product->image);
//         }

//         $product->delete();

//         return response()->json(['message' => 'Product deleted successfully']);
//     }
// }


