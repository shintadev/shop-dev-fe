export default function ProductsPage() {
  return (
    <main className='flex-1 container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>All Products</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {/* Product listing will go here */}
        <p className='col-span-full text-gray-500'>Products will be displayed here</p>
      </div>
    </main>
  );
}
