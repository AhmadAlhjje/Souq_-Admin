"use client";
import React from "react";
import Text from "@/components/atoms/Text";

interface CustomerInfoDisplayProps {
  name: string;
  phone: string;
  showPhone?: boolean;
}

export const CustomerInfoDisplay: React.FC<CustomerInfoDisplayProps> = ({
  name,
  phone,
  showPhone = true,
}) => {
  return (
    <div>
      <Text text={name} variant="subtitle" className="font-medium text-gray-900" />
      {showPhone && (
        <Text text={phone} variant="caption" className="text-gray-500" />
      )}
    </div>
  );
};