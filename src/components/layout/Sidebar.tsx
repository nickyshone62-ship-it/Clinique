'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  FileBarChart, 
  Database, 
  Lock, 
  CheckCircle2,
  FolderTree,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  categoriesCount?: number;
  servicesCount?: number;
}

export function Sidebar({ categoriesCount = 3, servicesCount = 17 }: SidebarProps) {
  return null;
}
