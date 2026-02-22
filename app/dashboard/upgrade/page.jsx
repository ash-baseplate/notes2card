'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';
import PricingHeader from './_components/PricingHeader';
import PlanCard from './_components/PlanCard';
import FeatureComparison from './_components/FeatureComparison';
import FAQSection from './_components/FAQSection';
import CTASection from './_components/CTASection';

function UpgradePage() {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(null);

  // Fetch user details from DB via API route
  const getUserDetails = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await axios.post('/api/user-status', { email });
      const data = response.data;
      setUserDetails(data);
      setIsMember(data?.isMember || false);
      setActivePlan(data?.activePlan || null);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUserDetails();
    }
  }, [user]);

  // Redirect to Stripe billing portal to manage subscription
  const onPaymentManagement = async () => {
    try {
      if (!userDetails?.customerId) {
        toast.error('No active subscription found');
        return;
      }
      const response = await axios.post('/api/payment/manage-payment', {
        customerId: userDetails.customerId,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error opening payment management:', error);
      toast.error('Failed to open subscription management');
    }
  };

  // Redirect to Stripe checkout for upgrade
  const handleUpgrade = async (planType) => {
    try {
      setUpgradeLoading(planType);

      const priceId =
        planType === 'yearly'
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;

      const response = await axios.post('/api/payment/checkout', {
        priceId: priceId,
      });

      if (response.data?.session?.url) {
        window.location.href = response.data.session.url;
      } else {
        toast.error('Unable to create checkout session');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setUpgradeLoading(null);
    }
  };

  const freeFeatures = [
    'Create up to 3 courses',
    'Flashcards generation (1 per course)',
    'Notes generation (basic)',
    'Easy difficulty level only',
    'Quiz generation (limited)',
    '5 Study purposes support',
    'Community support',
  ];

  const paidFeatures = [
    'Unlimited courses',
    'Unlimited flashcards',
    'Advanced notes generation',
    'All difficulty levels (Easy, Medium, Hard)',
    'Unlimited quiz generation',
    'Faster content generation',
    'Priority support',
    'Ad-free experience',
  ];

  const comparisonFeatures = [
    { name: 'Number of Courses', free: '3', paid: 'Unlimited' },
    { name: 'Flashcards per Course', free: '1 Limited', paid: 'Unlimited' },
    { name: 'Notes Generation', free: 'Basic', paid: 'Advanced' },
    { name: 'Difficulty Levels', free: 'Easy Only', paid: 'All (Easy, Medium, Hard)' },
    { name: 'Quiz Generation', free: 'Limited', paid: 'Unlimited' },
    { name: 'Generation Speed', free: 'Standard', paid: 'Priority/Faster' },
    { name: 'Ad-Free', free: 'No', paid: 'Yes' },
    { name: 'Support', free: 'Community', paid: 'Priority Email' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto mb-12">
        <PricingHeader isMember={isMember} />

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <PlanCard
            planType="free"
            features={freeFeatures}
            isMember={isMember}
            upgradeLoading={upgradeLoading}
          />
          <PlanCard
            planType="monthly"
            features={paidFeatures}
            isMember={isMember}
            activePlan={activePlan}
            upgradeLoading={upgradeLoading}
            onUpgrade={handleUpgrade}
            onManagePayment={onPaymentManagement}
          />
          <PlanCard
            planType="yearly"
            features={paidFeatures}
            isMember={isMember}
            activePlan={activePlan}
            upgradeLoading={upgradeLoading}
            onUpgrade={handleUpgrade}
            onManagePayment={onPaymentManagement}
          />
        </div>

        <FeatureComparison features={comparisonFeatures} />
        <FAQSection />
        <CTASection isMember={isMember} upgradeLoading={upgradeLoading} onUpgrade={handleUpgrade} />

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All transactions are secure and encrypted. Questions? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}

export default UpgradePage;
