'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslation } from '@/contexts/TranslationContext';
import { Customer, UserRole, PriceType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Shield, User, Briefcase, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Role configurations
const getRoleConfig = (role: UserRole, t: (key: string) => string) => {
  const configs = {
    admin: {
      label: t('role_admin'),
      description: t('role_admin_desc'),
      color: 'text-red-700',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      icon: Shield,
    },
    customer: {
      label: t('role_customer'),
      description: t('role_customer_desc'),
      color: 'text-blue-700',
      badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: User,
    },
    operator: {
      label: t('role_operator'),
      description: t('role_operator_desc'),
      color: 'text-green-700',
      badgeClass: 'bg-green-100 text-green-700 border-green-200',
      icon: Briefcase,
    },
    supervisor: {
      label: t('role_supervisor'),
      description: t('role_supervisor_desc'),
      color: 'text-purple-700',
      badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Eye,
    },
  };
  return configs[role];
};

export default function CustomersPage() {
  const { t } = useTranslation();
  const { customer: currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchPriceTypes();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customersSnapshot = await getDocs(collection(db, 'customers'));
      const customersData = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[];
      
      // Sort: admins first, then by name
      customersData.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
      });
      
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceTypes = async () => {
    try {
      const priceTypesSnapshot = await getDocs(collection(db, 'priceTypes'));
      const priceTypesData = priceTypesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPriceTypes(priceTypesData);
    } catch (error) {
      console.error('Error fetching price types:', error);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditDialog(true);
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    // Security: Only admins can change roles
    if (currentUser?.role !== 'admin') {
      alert(t('admin_only_feature'));
      return;
    }

    try {
      setSaving(true);
      await updateDoc(doc(db, 'customers', editingCustomer.id), {
        priceTypeId: editingCustomer.priceTypeId,
        role: editingCustomer.role,
      });
      
      await fetchCustomers();
      setShowEditDialog(false);
      setEditingCustomer(null);
      alert(t('customer_updated_success'));
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(t('error_updating_customer'));
    } finally {
      setSaving(false);
    }
  };

  const getPriceTypeName = (priceTypeId: string) => {
    const priceType = priceTypes.find(pt => pt.id === priceTypeId);
    return priceType?.name || t('no_price_type');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('admin_customers_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('admin_price_type')}</TableHead>
                  <TableHead>{t('district')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {t('no_customers_found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => {
                    const roleConfig = getRoleConfig(customer.role, t);
                    const RoleIcon = roleConfig.icon;
                    
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          <Badge className={roleConfig.badgeClass}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPriceTypeName(customer.priceTypeId)}</TableCell>
                        <TableCell>{customer.district || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {t('edit')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {t('edit_customer')}
            </DialogTitle>
          </DialogHeader>

          {editingCustomer && (
            <div className="space-y-4 py-4">
              {/* Name (Read-only) */}
              <div className="space-y-2">
                <Label>{t('name')}</Label>
                <Input value={editingCustomer.name} disabled />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label>{t('email')}</Label>
                <Input value={editingCustomer.email} disabled />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('admin_user_role')}
                </Label>
                <Select
                  value={editingCustomer.role}
                  onValueChange={(value: UserRole) =>
                    setEditingCustomer({ ...editingCustomer, role: value })
                  }
                  disabled={currentUser?.role !== 'admin'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="font-medium">{t('role_admin')}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('role_admin_desc')}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="customer">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{t('role_customer')}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('role_customer_desc')}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="operator">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">{t('role_operator')}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('role_operator_desc')}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="supervisor">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{t('role_supervisor')}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('role_supervisor_desc')}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {currentUser?.role !== 'admin' && (
                  <p className="text-xs text-orange-600">
                    ⚠️ {t('admin_only_feature')}
                  </p>
                )}
              </div>

              {/* Price Type */}
              <div className="space-y-2">
                <Label htmlFor="priceType">{t('admin_price_type')}</Label>
                <Select
                  value={editingCustomer.priceTypeId}
                  onValueChange={(value) =>
                    setEditingCustomer({ ...editingCustomer, priceTypeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceTypes.map((pt) => (
                      <SelectItem key={pt.id} value={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District (Read-only) */}
              {editingCustomer.district && (
                <div className="space-y-2">
                  <Label>{t('district')}</Label>
                  <Input value={editingCustomer.district} disabled />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={saving}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleUpdateCustomer} disabled={saving}>
              {saving ? t('saving') : t('save_changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
