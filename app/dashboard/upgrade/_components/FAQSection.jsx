import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: 'Can I switch plans anytime?',
    answer:
      'Yes! You can upgrade to Premium or downgrade to Free at any time. Changes take effect immediately.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards and payment methods through Stripe for secure transactions.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'You have unlimited access to Free plan features. Upgrade to Premium anytime to unlock advanced features.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes! You can cancel your Premium subscription at any time from your account settings with no questions asked.',
  },
  {
    question: 'What happens to my courses after downgrade?',
    answer:
      "Your courses remain safe. On Free plan, you'll be limited to 3 active courses. You can switch anytime.",
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "We offer a 7-day money-back guarantee if you're not satisfied with Premium. Contact support for details.",
  },
];

function FAQSection() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {faqItems.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FAQSection;
