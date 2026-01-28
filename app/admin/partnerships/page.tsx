'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PartnershipApplication, PartnershipStatus } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminPartnershipsPage() {
  const [applications, setApplications] = useState<PartnershipApplication[]>([]);
  const [filter, setFilter] = useState<PartnershipStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<PartnershipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(
      collection(db, 'partnerships'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PartnershipApplication[];
      
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: PartnershipStatus) => {
    try {
      await updateDoc(doc(db, 'partnerships', appId), {
        status: newStatus
      });
      toast.success(t('success') || 'Success');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(t('error') || 'Error');
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm(t('admin_delete_confirm') || 'Are you sure you want to delete?')) return;

    try {
      await deleteDoc(doc(db, 'partnerships', appId));
      toast.success(t('success') || 'Success');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('error') || 'Error');
    }
  };

  const handleNotesUpdate = async (appId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'partnerships', appId), { notes });
      toast.success(t('admin_notes_saved') || 'Notes saved');
    } catch (error) {
      console.error('Notes update error:', error);
      toast.error(t('error') || 'Error');
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusBadge = (status: PartnershipStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status];
  };

  const getStatusIcon = (status: PartnershipStatus) => {
    const icons = {
      pending: '🟡',
      contacted: '🔵',
      approved: '🟢',
      rejected: '🔴'
    };
    return icons[status];
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{t('admin_partnerships') || 'Partnership Applications'}</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          {t('all') || 'All'} ({applications.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          🟡 {t('partnership_status_pending') || 'Pending'} ({applications.filter(a => a.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'contacted' ? 'default' : 'outline'}
          onClick={() => setFilter('contacted')}
        >
          🔵 {t('partnership_status_contacted') || 'Contacted'} ({applications.filter(a => a.status === 'contacted').length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          🟢 {t('partnership_status_approved') || 'Approved'} ({applications.filter(a => a.status === 'approved').length})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          🔴 {t('partnership_status_rejected') || 'Rejected'} ({applications.filter(a => a.status === 'rejected').length})
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('partnership_name') || 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('partnership_email') || 'Email'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('partnership_phone') || 'Phone'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('partnership_date') || 'Date'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('partnership_status') || 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin_actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">
                        {app.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`tel:${app.phone}`} className="text-blue-600 hover:underline">
                        {app.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.createdAt.toDate().toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                        {getStatusIcon(app.status)} {t(`partnership_status_${app.status}`) || app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        {t('admin_view_details') || 'Details'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(app.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('admin_delete') || 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t('partnership_no_applications') || 'No applications yet'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{t('partnership_application_details') || 'Application Details'}</CardTitle>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('partnership_name') || 'Name'}</Label>
                <p className="mt-1 text-lg">{selectedApp.name}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">{t('partnership_email') || 'Email'}</Label>
                <p className="mt-1">
                  <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline">
                    {selectedApp.email}
                  </a>
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">{t('partnership_phone') || 'Phone'}</Label>
                <p className="mt-1">
                  <a href={`tel:${selectedApp.phone}`} className="text-blue-600 hover:underline">
                    {selectedApp.phone}
                  </a>
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">{t('partnership_date') || 'Date'}</Label>
                <p className="mt-1">{selectedApp.createdAt.toDate().toLocaleString('uz-UZ')}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">{t('partnership_message') || 'Message'}</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">{selectedApp.message}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('partnership_status') || 'Status'}</Label>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as PartnershipStatus)}
                  className="w-full border rounded p-2"
                >
                  <option value="pending">🟡 {t('partnership_status_pending') || 'Pending'}</option>
                  <option value="contacted">🔵 {t('partnership_status_contacted') || 'Contacted'}</option>
                  <option value="approved">🟢 {t('partnership_status_approved') || 'Approved'}</option>
                  <option value="rejected">🔴 {t('partnership_status_rejected') || 'Rejected'}</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('admin_notes') || 'Admin Notes'}</Label>
                <Textarea
                  defaultValue={selectedApp.notes || ''}
                  onBlur={(e) => handleNotesUpdate(selectedApp.id, e.target.value)}
                  rows={4}
                  placeholder={t('admin_notes_placeholder') || 'Write notes about this application...'}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setSelectedApp(null)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('close') || 'Close'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
