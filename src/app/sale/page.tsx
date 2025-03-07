export default function SalePage() {
  return (
    <main className='flex-1 container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6 text-red-500'>Sale Items</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {/* Sale products listing will go here */}
        <p className='col-span-full text-gray-500'>Sale items will be displayed here</p>
      </div>
    </main>
  );
}
