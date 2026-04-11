'use client';

import { useClerk } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Crown, ArrowUpRight, User } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

function AccountTab({ userStatus, courses }) {
  const [managingPayment, setManagingPayment] = useState(false);
  const { openUserProfile } = useClerk();
  const isMember = userStatus?.isMember;
  const total = courses.length;

  const planLabel = isMember
    ? userStatus?.activePlan === 'yearly'
      ? 'Pro (Yearly)'
      : 'Pro (Monthly)'
    : 'Free';

  const handleManageSubscription = async () => {
    if (!userStatus?.customerId) {
      toast.error('No active subscription found');
      return;
    }
    setManagingPayment(true);
    try {
      const response = await axios.post('/api/payment/manage-payment', {
        customerId: userStatus.customerId,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error opening payment management:', error);
      toast.error('Failed to open subscription management');
    } finally {
      setManagingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Subscription
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Current Plan</span>
            <Badge
              className={
                isMember
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600'
              }
              variant={isMember ? 'default' : 'secondary'}
            >
              {isMember && <Crown className="w-3 h-3 mr-1" />}
              {planLabel}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-medium text-gray-900">
              {isMember ? '✅ Active' : '—'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Credits</span>
            <span className="text-sm font-medium text-gray-900">
              {isMember ? 'Unlimited' : `${Math.max(3 - total, 0)} of 3 remaining`}
            </span>
          </div>

          {isMember && userStatus?.upgradeDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Upgraded On</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(userStatus.upgradeDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t flex flex-wrap gap-3">
          {isMember ? (
            <Button
              onClick={handleManageSubscription}
              disabled={managingPayment}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {managingPayment ? 'Opening...' : 'Manage Subscription'}
              <ArrowUpRight className="w-3 h-3" />
            </Button>
          ) : (
            <Link href="/dashboard/upgrade">
              <Button className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Clerk Account Management */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <User className="w-4 h-4" />
          Manage Account
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Update your name, email, password, and connected accounts.
        </p>
        <Button
          variant="outline"
          onClick={() => openUserProfile()}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Open Account Settings
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default AccountTab;
