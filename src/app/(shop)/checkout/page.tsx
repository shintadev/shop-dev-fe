'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CreditCard,
  MapPin,
  Truck,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Mock data - In a real app, this would come from your API
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

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

type CheckoutStep = 'address' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [orderNote, setOrderNote] = useState<string>('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // For new address form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
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
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    // In a real app, you would fetch cart items and user addresses from your API
    // This is just mock data
    setTimeout(() => {
      setCartItems([
        {
          id: 'cart-1',
          productId: 'prod-1',
          name: 'Áo thun Unisex Cotton Basic',
          price: 199000,
          image: 'https://placehold.co/300x400',
          quantity: 2,
          color: 'Trắng',
          size: 'M',
        },
        {
          id: 'cart-2',
          productId: 'prod-2',
          name: 'Quần jean Nam Slim Fit',
          price: 499000,
          image: 'https://placehold.co/300x400',
          quantity: 1,
          color: 'Xanh đậm',
          size: '32',
        },
      ]);

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

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 30000;
  const total = subtotal + shippingFee;

  const handleAddAddress = () => {
    // Validate form
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.ward ||
      !newAddress.district ||
      !newAddress.city
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    // In a real app, you would call your API to add the address
    const newAddressId = `addr-${Date.now()}`;
    const addressToAdd = {
      ...newAddress,
      id: newAddressId,
    };

    setAddresses([...addresses, addressToAdd]);
    setSelectedAddressId(newAddressId);
    setIsAddingAddress(false);

    // Reset form
    setNewAddress({
      fullName: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    });

    toast.success('Đã thêm địa chỉ mới');
  };

  const moveToNextStep = () => {
    if (currentStep === 'address') {
      if (!selectedAddressId) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    }
  };

  const moveToPreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };

  const placeOrder = async () => {
    setIsCreatingOrder(true);

    // In a real app, you would call your API to create the order
    setTimeout(() => {
      setIsCreatingOrder(false);
      // Navigate to success page with order ID
      router.push('/checkout/success?orderId=ORD-' + Date.now());
    }, 1500);
  };

  const getSelectedAddress = () => {
    return addresses.find((addr) => addr.id === selectedAddressId);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className='container mx-auto py-10 px-4'>
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <h2 className='text-xl font-medium'>Giỏ hàng của bạn đang trống</h2>
          <p className='text-gray-500 mt-2 mb-6'>
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán
          </p>
          <Button asChild>
            <Link href='/products'>Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Thanh toán</h1>

      {/* Steps indicator */}
      <div className='mb-8'>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'address' ? 'bg-primary text-white' : 'bg-primary text-white'
              }`}
            >
              <MapPin className='h-4 w-4' />
            </div>
            <span
              className={`ml-2 ${
                currentStep === 'address'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-900 font-medium'
              }`}
            >
              Địa chỉ
            </span>
          </div>
          <div
            className={`w-12 h-0.5 mx-2 ${
              currentStep === 'address' ? 'bg-gray-300' : 'bg-primary'
            }`}
          />
          <div className='flex items-center'>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'payment'
                  ? 'bg-primary text-white'
                  : currentStep === 'confirmation'
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              <CreditCard className='h-4 w-4' />
            </div>
            <span
              className={`ml-2 ${
                currentStep === 'payment'
                  ? 'text-gray-900 font-medium'
                  : currentStep === 'confirmation'
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500'
              }`}
            >
              Thanh toán
            </span>
          </div>
          <div
            className={`w-12 h-0.5 mx-2 ${
              currentStep === 'confirmation' ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
          <div className='flex items-center'>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'confirmation'
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              <CheckCircle2 className='h-4 w-4' />
            </div>
            <span
              className={`ml-2 ${
                currentStep === 'confirmation' ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}
            >
              Xác nhận
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          {/* Step 1: Shipping Address */}
          {currentStep === 'address' && (
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h2 className='text-xl font-semibold mb-6'>Địa chỉ giao hàng</h2>

              {!isAddingAddress ? (
                <>
                  {addresses.length > 0 ? (
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      <div className='space-y-4'>
                        {addresses.map((address) => (
                          <div key={address.id} className='flex items-start'>
                            <RadioGroupItem value={address.id} id={address.id} className='mt-1' />
                            <Label
                              htmlFor={address.id}
                              className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer'
                            >
                              <div className='flex justify-between'>
                                <div>
                                  <p className='font-medium'>{address.fullName}</p>
                                  <p className='text-sm text-gray-600'>{address.phone}</p>
                                </div>
                                {address.isDefault && (
                                  <span className='text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full'>
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className='text-sm text-gray-600 mt-1'>
                                {address.address}, {address.ward}, {address.district},{' '}
                                {address.city}
                              </p>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className='text-center py-6'>
                      <p className='text-gray-500 mb-4'>Bạn chưa có địa chỉ nào</p>
                    </div>
                  )}

                  <Button
                    variant='outline'
                    className='mt-6'
                    onClick={() => setIsAddingAddress(true)}
                  >
                    + Thêm địa chỉ mới
                  </Button>
                </>
              ) : (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='fullName'>Họ và tên</Label>
                      <Input
                        id='fullName'
                        placeholder='Nguyễn Văn A'
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor='phone'>Số điện thoại</Label>
                      <Input
                        id='phone'
                        placeholder='0912345678'
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='address'>Địa chỉ</Label>
                    <Input
                      id='address'
                      placeholder='123 Đường Lê Lợi'
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='ward'>Phường/Xã</Label>
                      <Input
                        id='ward'
                        placeholder='Phường Bến Nghé'
                        value={newAddress.ward}
                        onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor='district'>Quận/Huyện</Label>
                      <Input
                        id='district'
                        placeholder='Quận 1'
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor='city'>Tỉnh/Thành phố</Label>
                      <Input
                        id='city'
                        placeholder='TP Hồ Chí Minh'
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='isDefault'
                      checked={newAddress.isDefault}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, isDefault: e.target.checked })
                      }
                      className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                    />
                    <Label htmlFor='isDefault' className='cursor-pointer'>
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>

                  <div className='flex items-center space-x-4 mt-6'>
                    <Button onClick={handleAddAddress}>Lưu địa chỉ</Button>
                    <Button variant='outline' onClick={() => setIsAddingAddress(false)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 'payment' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <h2 className='text-xl font-semibold mb-6'>Phương thức thanh toán</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className='space-y-4'>
                    <div className='flex items-start'>
                      <RadioGroupItem value='cod' id='cod' className='mt-1' />
                      <Label
                        htmlFor='cod'
                        className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer'
                      >
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                            <CreditCard className='h-4 w-4' />
                          </div>
                          <div>
                            <p className='font-medium'>Thanh toán khi nhận hàng (COD)</p>
                            <p className='text-sm text-gray-600'>
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className='flex items-start'>
                      <RadioGroupItem
                        value='bank_transfer'
                        id='bank_transfer'
                        className='mt-1'
                        disabled
                      />
                      <Label
                        htmlFor='bank_transfer'
                        className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer opacity-50'
                      >
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                            <CreditCard className='h-4 w-4' />
                          </div>
                          <div>
                            <p className='font-medium'>Chuyển khoản ngân hàng</p>
                            <p className='text-sm text-gray-600'>
                              Thanh toán qua chuyển khoản ngân hàng
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>(Đang phát triển)</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className='flex items-start'>
                      <RadioGroupItem value='momo' id='momo' className='mt-1' disabled />
                      <Label
                        htmlFor='momo'
                        className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer opacity-50'
                      >
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                            <CreditCard className='h-4 w-4' />
                          </div>
                          <div>
                            <p className='font-medium'>Ví điện tử MoMo</p>
                            <p className='text-sm text-gray-600'>Thanh toán qua ví MoMo</p>
                            <p className='text-xs text-gray-500 mt-1'>(Đang phát triển)</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <h2 className='text-xl font-semibold mb-6'>Phương thức vận chuyển</h2>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className='space-y-4'>
                    <div className='flex items-start'>
                      <RadioGroupItem value='standard' id='standard' className='mt-1' />
                      <Label
                        htmlFor='standard'
                        className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                              <Truck className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium'>Giao hàng tiêu chuẩn</p>
                              <p className='text-sm text-gray-600'>Nhận hàng trong 3-5 ngày</p>
                            </div>
                          </div>
                          <p className='font-medium'>{formatPrice(30000)}</p>
                        </div>
                      </Label>
                    </div>

                    <div className='flex items-start'>
                      <RadioGroupItem value='express' id='express' className='mt-1' />
                      <Label
                        htmlFor='express'
                        className='flex-1 ml-3 border rounded-md p-4 hover:border-primary cursor-pointer'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                              <Truck className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium'>Giao hàng nhanh</p>
                              <p className='text-sm text-gray-600'>Nhận hàng trong 1-2 ngày</p>
                            </div>
                          </div>
                          <p className='font-medium'>{formatPrice(50000)}</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <h2 className='text-xl font-semibold mb-4'>Ghi chú đơn hàng</h2>
                <Textarea
                  placeholder='Nhập ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết'
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className='min-h-[100px]'
                />
              </div>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {currentStep === 'confirmation' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <h2 className='text-xl font-semibold mb-6'>Xác nhận đơn hàng</h2>

                <div className='space-y-4'>
                  <div>
                    <h3 className='font-medium text-gray-700 mb-2'>Địa chỉ giao hàng</h3>
                    {getSelectedAddress() && (
                      <div className='text-sm border rounded-md p-4 bg-gray-50'>
                        <p className='font-medium'>{getSelectedAddress()?.fullName}</p>
                        <p>{getSelectedAddress()?.phone}</p>
                        <p className='mt-1'>
                          {getSelectedAddress()?.address}, {getSelectedAddress()?.ward},{' '}
                          {getSelectedAddress()?.district}, {getSelectedAddress()?.city}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className='font-medium text-gray-700 mb-2'>Phương thức thanh toán</h3>
                    <div className='text-sm border rounded-md p-4 bg-gray-50'>
                      <p>
                        {paymentMethod === 'cod'
                          ? 'Thanh toán khi nhận hàng (COD)'
                          : paymentMethod === 'bank_transfer'
                          ? 'Chuyển khoản ngân hàng'
                          : 'Ví điện tử MoMo'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className='font-medium text-gray-700 mb-2'>Phương thức vận chuyển</h3>
                    <div className='text-sm border rounded-md p-4 bg-gray-50'>
                      <p>
                        {shippingMethod === 'standard'
                          ? 'Giao hàng tiêu chuẩn (3-5 ngày)'
                          : 'Giao hàng nhanh (1-2 ngày)'}
                      </p>
                    </div>
                  </div>

                  {orderNote && (
                    <div>
                      <h3 className='font-medium text-gray-700 mb-2'>Ghi chú đơn hàng</h3>
                      <div className='text-sm border rounded-md p-4 bg-gray-50'>
                        <p>{orderNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
                <h2 className='text-xl font-semibold p-6 border-b'>
                  Sản phẩm ({cartItems.length})
                </h2>
                <div className='divide-y'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='p-6 flex items-center'>
                      <div className='flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='ml-4 flex-1'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-sm text-gray-600'>
                          {item.color} / {item.size}
                        </p>
                        <div className='flex justify-between items-center mt-1'>
                          <span className='text-sm text-gray-600'>SL: {item.quantity}</span>
                          <span className='font-medium'>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className='mt-8 flex justify-between'>
            {currentStep !== 'address' ? (
              <Button variant='outline' onClick={moveToPreviousStep}>
                <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại
              </Button>
            ) : (
              <Button variant='outline' asChild>
                <Link href='/cart'>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại giỏ hàng
                </Link>
              </Button>
            )}

            {currentStep !== 'confirmation' ? (
              <Button onClick={moveToNextStep}>
                Tiếp tục <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            ) : (
              <Button onClick={placeOrder} disabled={isCreatingOrder}>
                {isCreatingOrder ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2'></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>Đặt hàng</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className='bg-white rounded-lg shadow-sm border p-6 sticky top-24'>
            <h2 className='text-xl font-semibold mb-6'>Tóm tắt đơn hàng</h2>

            <div className='space-y-4'>
              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Tạm tính ({cartItems.length} sản phẩm):</span>
                <span className='font-medium'>{formatPrice(subtotal)}</span>
              </div>

              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Phí vận chuyển:</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>

              <div className='border-t pt-4 mt-2'>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Tổng cộng:</span>
                  <span className='font-bold text-lg'>{formatPrice(total)}</span>
                </div>
              </div>

              <div className='mt-6 space-y-2'>
                <div className='flex items-start'>
                  <CircleCheck className='h-5 w-5 text-green-500 mt-0.5 mr-2' />
                  <span className='text-sm'>Miễn phí đổi trả trong 7 ngày</span>
                </div>
                <div className='flex items-start'>
                  <CircleCheck className='h-5 w-5 text-green-500 mt-0.5 mr-2' />
                  <span className='text-sm'>Bảo hành 30 ngày cho các lỗi từ nhà sản xuất</span>
                </div>
                <div className='flex items-start'>
                  <CircleCheck className='h-5 w-5 text-green-500 mt-0.5 mr-2' />
                  <span className='text-sm'>Giao hàng nhanh chóng trên toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
