"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { 
  DeleteButton, 
  ViewButton, 
  BanButton, 
  UnbanButton, 
  CreateInvoiceButton 
} from '@/components/common/ActionButtons';

interface StoreActionsProps {
  storeId: string;
  status: 'active' | 'suspended';
  website?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onCreateInvoice: (id: string) => void;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

const StoreActions: React.FC<StoreActionsProps> = ({ 
  storeId, 
  status,
  website, 
  onView, 
  onEdit, 
  onDelete,
  onBan,
  onUnban,
  onCreateInvoice,
  layout = 'horizontal',
  size = 'sm'
}) => {
  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col items-center gap-2' 
    : 'flex items-center gap-2';

  return (
    <div className={containerClasses}>
      {/* Website Link */}
      {website && (
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
          title="زيارة الموقع"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Primary Actions */}
      <ViewButton 
        size={size}
        onClick={() => onView(storeId)}
        tooltip="عرض تفاصيل المتجر"
      />

      {/* Status-based Actions */}
      {status === 'active' ? (
        <BanButton 
          size={size}
          onClick={() => onBan(storeId)}
          tooltip="حظر المتجر"
        />
      ) : (
        <UnbanButton 
          size={size}
          onClick={() => onUnban(storeId)}
          tooltip="إلغاء حظر المتجر"
        />
      )}

      {/* Invoice Action */}
      <CreateInvoiceButton 
        size={size}
        onClick={() => onCreateInvoice(storeId)}
        tooltip="إنشاء فاتورة"
      />

      {/* Delete Action */}
      <DeleteButton 
        size={size}
        onClick={() => onDelete(storeId)}
        tooltip="حذف المتجر"
      />
    </div>
  );
};

export default StoreActions;