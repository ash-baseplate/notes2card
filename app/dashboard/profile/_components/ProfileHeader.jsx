'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

function ProfileHeader({ user, userStatus, loading }) {
  const dateJoined = userStatus?.dateJoined
    ? new Date(userStatus.dateJoined).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const planLabel = userStatus?.isMember
    ? userStatus?.activePlan === 'yearly'
      ? 'Pro (Yearly)'
      : 'Pro (Monthly)'
    : 'Free Plan';

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-36 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={user?.imageUrl || '/logo.png'}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full ring-4 ring-primary/10"
          />
          {userStatus?.isMember && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
              ✓
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.emailAddresses?.[0]?.emailAddress}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <Badge
              variant={userStatus?.isMember ? 'default' : 'secondary'}
              className={
                userStatus?.isMember
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600'
              }
            >
              {planLabel}
            </Badge>
            {dateJoined && <span className="text-xs text-gray-400">Member since {dateJoined}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
