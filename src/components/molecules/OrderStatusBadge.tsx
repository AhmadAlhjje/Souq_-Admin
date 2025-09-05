"use client";
import React from "react";
import Badge from "@/components/atoms/Badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    if (status === "مشحون") return "newNew";
    return "saleNew";
  };

  return (
    <Badge variant={getVariant()} text={status} />
  );
};