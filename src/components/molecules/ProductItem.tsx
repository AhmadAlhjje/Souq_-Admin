"use client";
import React from "react";
import Text from "@/components/atoms/Text";

interface Product {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{product.image}</span>
          <div>
            <Text text={product.name} variant="subtitle" className="font-medium text-gray-900" />
            <Text text={`الكمية: ${product.quantity}`} variant="caption" className="text-gray-500" />
          </div>
        </div>
        <div className="text-left">
          <Text text={`${product.totalPrice.toFixed(2)} ر.س`} variant="subtitle" className="font-medium text-gray-900" />
          <Text text={`${product.price.toFixed(2)} ر.س للقطعة`} variant="caption" className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};