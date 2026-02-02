import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function SelectOption({ SelectedStudyType }) {
  const Options = [
    {
      name: 'Exam',
      icon: '/exam_1.png',
    },
    {
      name: 'Job Interview',
      icon: '/job.png',
    },
    {
      name: 'Practice',
      icon: '/practice.png',
    },
    {
      name: 'Coding Prep',
      icon: '/code.png',
    },
    {
      name: 'Other',
      icon: '/knowledge.png',
    },
  ];
  const [selected, setSelected] = React.useState(null);

  return (
    <section className="max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-center mb-3 text-xl font-semibold">
        What are you creating study material for?
      </h2>
      <p className="text-center mb-6 text-sm text-gray-500">
        Pick a purpose to get a tailored card layout.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Options.map((option, idx) => {
          const isSelected = selected === idx;
          return (
            <Button
              key={option.name}
              type="button"
              onClick={() => {
                setSelected(idx);
                SelectedStudyType?.(option.name);
              }}
              aria-pressed={isSelected}
              variant={null}
              size={null}
              className={
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition transform ' +
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 ' +
                (isSelected
                  ? 'bg-indigo-50 border-indigo-300 shadow-lg scale-105'
                  : 'bg-white hover:shadow-md hover:-translate-y-1')
              }
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-md bg-gradient-to-br from-gray-50 to-white">
                <Image
                  src={option.icon}
                  width={56}
                  height={56}
                  alt={option.name}
                  className="object-contain"
                />
              </div>

              <span className="text-sm font-medium text-gray-800 truncate">{option.name}</span>

              <span
                className={
                  'mt-1 text-xs rounded-full px-2 py-0.5 ' +
                  (isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600')
                }
              >
                {isSelected ? 'Selected' : 'Select'}
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
