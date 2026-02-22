import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap } from 'lucide-react';

const PLAN_CONFIG = {
  free: {
    title: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    priceNote: 'Forever free access',
    badge: null,
    buttonVariant: 'outline',
    buttonClass: 'w-full',
    checkColor: 'text-green-600',
    borderClass: '',
    cardClass: '',
    featuresLabel: 'Includes:',
    iconColor: null,
  },
  monthly: {
    title: 'Premium Monthly',
    description: 'For advanced learners',
    price: '$4.99',
    priceNote: 'per month, cancel anytime',
    badge: { label: 'Popular', bgColor: 'bg-blue-500' },
    buttonVariant: 'default',
    buttonClass: 'w-full bg-blue-600 hover:bg-blue-700',
    checkColor: 'text-blue-600',
    borderClass: 'border-2 border-blue-500 shadow-lg',
    cardClass: '',
    featuresLabel: 'Everything in Free, plus:',
    iconColor: 'text-blue-500',
  },
  yearly: {
    title: 'Premium Yearly',
    description: 'Save 17% annually',
    price: '$49.99',
    priceNote: 'per year, cancel anytime',
    priceSubNote: '≈ $4.17/month',
    badge: { label: 'Best Value', bgColor: 'bg-purple-500' },
    buttonVariant: 'default',
    buttonClass: 'w-full bg-purple-600 hover:bg-purple-700',
    checkColor: 'text-purple-600',
    borderClass: 'border-2 border-purple-500 shadow-lg',
    cardClass: 'transform md:scale-105',
    featuresLabel: 'Everything in Free, plus:',
    iconColor: 'text-purple-500',
  },
};

function PlanCard({
  planType,
  features,
  isMember,
  activePlan,
  upgradeLoading,
  onUpgrade,
  onManagePayment,
}) {
  const config = PLAN_CONFIG[planType];
  const isFreePlan = planType === 'free';
  const isActivePlan = isMember && activePlan === planType;
  const isOtherPaidPlan = isMember && !isFreePlan && activePlan !== planType;
  const isLoading = upgradeLoading === planType;

  const getButtonLabel = () => {
    if (isFreePlan) {
      return isMember ? 'Free Plan' : 'Current Plan';
    }
    if (isActivePlan) return 'Manage Subscription';
    if (isOtherPaidPlan) return planType === 'monthly' ? 'Monthly Plan' : 'Yearly Plan';
    if (isLoading) return 'Loading...';
    return 'Upgrade Now';
  };

  const isDisabled = () => {
    if (isFreePlan) return true; // Always disabled (current for free users, frozen for members)
    if (isActivePlan) return false; // Manage subscription is clickable
    if (isOtherPaidPlan) return true; // Other paid plan frozen when member
    if (isLoading) return true;
    return false; // Upgrade Now is clickable
  };

  const handleClick = () => {
    if (isFreePlan) return;
    if (isActivePlan) {
      onManagePayment?.();
    } else if (!isMember) {
      onUpgrade?.(planType);
    }
  };

  return (
    <Card
      className={`relative transition-all ${config.borderClass} ${config.cardClass} ${
        (isMember && isFreePlan) || isOtherPaidPlan ? 'opacity-60' : ''
      } ${isActivePlan ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
    >
      {config.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span
            className={`${config.badge.bgColor} text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}
          >
            <Crown className="w-4 h-4" />
            {config.badge.label}
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {config.iconColor && <Zap className={`w-6 h-6 ${config.iconColor}`} />}
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <span className="text-4xl font-bold text-gray-900">{config.price}</span>
          <p className="text-gray-600 text-sm mt-2">{config.priceNote}</p>
          {config.priceSubNote && (
            <p className="text-purple-600 text-xs font-semibold mt-1">{config.priceSubNote}</p>
          )}
        </div>

        <Button
          variant={isFreePlan ? 'outline' : 'default'}
          className={config.buttonClass}
          disabled={isDisabled()}
          onClick={handleClick}
        >
          {getButtonLabel()}
        </Button>

        <div className="space-y-3">
          <p className="font-semibold text-gray-900">{config.featuresLabel}</p>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className={`w-5 h-5 ${config.checkColor} flex-shrink-0 mt-0.5`} />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlanCard;
