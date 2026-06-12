import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutPayload {
  delivery: CheckoutAddress;
  paymentCard: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
  billingSameAsDelivery: boolean;
  billingAddress?: CheckoutAddress;
}
