'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from './_components/ProfileHeader';
import ProfileTabs from './_components/ProfileTabs';
import OverviewTab from './_components/OverviewTab';
import CoursesTab from './_components/CoursesTab';
import AccountTab from './_components/AccountTab';

function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const [coursesRes, statusRes] = await Promise.all([
        axios.post('/api/courses', { createdBy: email }),
        axios.post('/api/user-status', { email }),
      ]);
      setCourses(coursesRes.data.result || []);
      setUserStatus(statusRes.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header - always visible */}
      <ProfileHeader user={user} userStatus={userStatus} loading={loading} />

      {/* Tab Bar */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border shadow-sm p-6 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                <div className="h-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab courses={courses} isMember={userStatus?.isMember} />
            )}
            {activeTab === 'courses' && <CoursesTab courses={courses} />}
            {activeTab === 'account' && <AccountTab userStatus={userStatus} courses={courses} />}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
