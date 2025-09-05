"use client";
import React from "react";
import { X } from "lucide-react";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import { ProductItem } from "@/components/molecules/ProductItem";
import CustomerInfo from "@/components/molecules/CustomerInfo";

// استخدام نفس نوع Order الموجود في المكونات الأخرى
interface Order {
  id: string;
  customerName: string;
  productImage: string;
  status: "active" | "pending";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
  orderDate: string;
  customerPhone: string;
  customerAddress: string;
  products: any[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <Text text={`تفاصيل الطلب ${order.orderNumber}`} variant="subtitle" className="text-xl font-bold text-gray-900" />
            <Button
              variant="ghost"
              size="sm"
              startIcon={<X className="w-5 h-5" />}
              onClick={onClose}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <CustomerInfo order={order} isDark={false} />

          {/* Products */}
          <div>
            <Text text="المنتجات" variant="subtitle" className="text-lg font-semibold text-gray-900 mb-3" />
            <div className="space-y-3">
              {order.products.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <Text text="المجموع الكلي:" variant="subtitle" className="text-lg font-bold text-gray-900" />
              <Text text={`${order.price.toFixed(2)} ر.س`} variant="subtitle" className="text-lg font-bold text-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};