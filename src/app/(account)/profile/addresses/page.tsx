'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Plus, Pencil, Trash2, Home, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock address data - In a real app, this would come from your API
interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/addresses');
      return;
    }

    // In a real app, you would fetch addresses from your API
    // This is just mock data
    setTimeout(() => {
      setAddresses([
        {
          id: 'addr-1',
          fullName: 'Nguyễn Văn A',
          phone: '0912345678',
          address: '123 Đường Lê Lợi',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'TP Hồ Chí Minh',
          isDefault: true,
        },
        {
          id: 'addr-2',
          fullName: 'Nguyễn Văn A',
          phone: '0987654321',
          address: '456 Đường Nguyễn Huệ',
          ward: 'Phường Bến Thành',
          district: 'Quận 1',
          city: 'TP Hồ Chí Minh',
          isDefault: false,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    });
    setCurrentAddress(null);
  };

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setIsEditingAddress(false);
    resetForm();
  };

  const handleEditAddress = (address: Address) => {
    setIsEditingAddress(true);
    setIsAddingAddress(true);
    setCurrentAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (id: string) => {
    // In a real app, you would call your API to delete the address
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success('Địa chỉ đã được xóa');
  };

  const handleSetDefault = (id: string) => {
    // In a real app, you would call your API to set the default address
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('Đã đặt làm địa chỉ mặc định');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.ward ||
      !formData.district ||
      !formData.city
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    if (isEditingAddress && currentAddress) {
      // Update existing address
      const updatedAddresses = addresses.map((addr) =>
        addr.id === currentAddress.id
          ? { ...formData, id: currentAddress.id }
          : formData.isDefault
          ? { ...addr, isDefault: false }
          : addr
      );
      setAddresses(updatedAddresses);
      toast.success('Địa chỉ đã được cập nhật');
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: `addr-${Date.now()}`,
      };

      if (formData.isDefault) {
        // If this is the default address, update all other addresses
        setAddresses([newAddress, ...addresses.map((addr) => ({ ...addr, isDefault: false }))]);
      } else {
        setAddresses([newAddress, ...addresses]);
      }

      toast.success('Địa chỉ mới đã được thêm');
    }

    // Reset form and state
    resetForm();
    setIsAddingAddress(false);
    setIsEditingAddress(false);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='mb-6'>
        <Link
          href='/profile'
          className='text-sm text-gray-600 hover:text-primary flex items-center'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại tài khoản
        </Link>
      </div>

      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Địa chỉ của tôi</h1>
        {!isAddingAddress && (
          <Button onClick={handleAddAddress}>
            <Plus className='mr-2 h-4 w-4' /> Thêm địa chỉ mới
          </Button>
        )}
      </div>

      {isAddingAddress ? (
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <h2 className='text-xl font-semibold mb-6'>
            {isEditingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='fullName'>Họ và tên</Label>
                <Input
                  id='fullName'
                  name='fullName'
                  placeholder='Nguyễn Văn A'
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='phone'>Số điện thoại</Label>
                <Input
                  id='phone'
                  name='phone'
                  placeholder='0912345678'
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor='address'>Địa chỉ</Label>
              <Input
                id='address'
                name='address'
                placeholder='123 Đường Lê Lợi'
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='ward'>Phường/Xã</Label>
                <Input
                  id='ward'
                  name='ward'
                  placeholder='Phường Bến Nghé'
                  value={formData.ward}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='district'>Quận/Huyện</Label>
                <Input
                  id='district'
                  name='district'
                  placeholder='Quận 1'
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='city'>Tỉnh/Thành phố</Label>
                <Input
                  id='city'
                  name='city'
                  placeholder='TP Hồ Chí Minh'
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isDefault'
                name='isDefault'
                checked={formData.isDefault}
                onChange={handleInputChange}
                className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='isDefault' className='cursor-pointer'>
                Đặt làm địa chỉ mặc định
              </Label>
            </div>

            <div className='flex items-center space-x-4 pt-4'>
              <Button type='submit'>{isEditingAddress ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}</Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsAddingAddress(false);
                  setIsEditingAddress(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      ) : addresses.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <MapPin className='w-12 h-12 text-gray-400' />
            <h2 className='text-xl font-medium'>Bạn chưa có địa chỉ nào</h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              Thêm địa chỉ để dễ dàng thanh toán và giao hàng cho các đơn hàng của bạn.
            </p>
            <Button onClick={handleAddAddress} className='mt-2'>
              <Plus className='mr-2 h-4 w-4' /> Thêm địa chỉ mới
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                address.isDefault ? 'border-primary' : ''
              }`}
            >
              <div className='flex justify-between'>
                <div className='flex items-start'>
                  <div className='mr-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                      <Home className='h-5 w-5 text-gray-600' />
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center'>
                      <h3 className='font-medium'>{address.fullName}</h3>
                      {address.isDefault && (
                        <span className='ml-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full'>
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>{address.phone}</p>
                    <p className='text-sm text-gray-600 mt-1'>
                      {address.address}, {address.ward}, {address.district}, {address.city}
                    </p>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <Button variant='outline' size='sm' onClick={() => handleEditAddress(address)}>
                    <Pencil className='h-4 w-4' />
                    <span className='sr-only'>Edit</span>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.isDefault}
                  >
                    <Trash2 className='h-4 w-4' />
                    <span className='sr-only'>Delete</span>
                  </Button>
                </div>
              </div>

              {!address.isDefault && (
                <div className='mt-4 pt-4 border-t'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-primary'
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Đặt làm địa chỉ mặc định
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
