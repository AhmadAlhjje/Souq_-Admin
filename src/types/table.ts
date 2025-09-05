
// أنواع البيانات الأساسية للجدول
export interface TableColumn<T = any> {
  key: string;
  title: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction<T = any> {
  key: string;
  render: (record: T) => React.ReactNode;
}

export interface GenericTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  };
  actions?: TableAction<T>[];
  rowKey: string | ((record: T) => string);
  onRowClick?: (record: T) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  // Pagination props
  pagination?: {
    enabled: boolean;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
    startIndex?: number;
    endIndex?: number;
    searchTerm?: string;
    totalData?: number;
    onPageChange?: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
  };
}