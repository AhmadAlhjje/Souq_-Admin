"use client";
import React from "react";
import Text from "@/components/atoms/Text";

interface OrderHeaderProps {
  orderNumber: string;
  orderDate: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  orderNumber,
  orderDate,
}) => {
  return (
    <div>
      <Text text={orderNumber} variant="subtitle" className="font-medium text-gray-900" />
      <Text text={orderDate} variant="caption" className="text-gray-500" />
    </div>
  );
};