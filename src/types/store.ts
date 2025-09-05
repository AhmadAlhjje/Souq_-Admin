export interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
}

export interface StoreEntity {
  id: string;
  name: string;
  category: string;
  owner: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  website?: string;
  rating: number;
  totalSales: number;
  monthlySales: number;
  totalOrders: number;
  status: "active" | "suspended";
  createdAt: string;
}

export interface StoresTableProps {
  stores: StoreEntity[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onCreateInvoice: (id: string) => void;
}