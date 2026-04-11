'use client';
import React, { useState } from 'react';
import SelectOption from './_components/SelectOption';
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue,
    }));
  };

  const hasStudyType = Boolean(formData?.studyType);
  const hasTopic = Boolean(formData?.topic?.trim());
  const hasDifficulty = Boolean(formData?.difficultyLevel);

  const GenerateCousreOutline = async () => {
    if (loading) return;

    if (!hasStudyType || !hasTopic || !hasDifficulty) {
      toast.error('Please complete all fields before generating.');
      return;
    }

    const createdBy = user?.primaryEmailAddress?.emailAddress;
    if (!createdBy) {
      toast.error('Unable to verify your account. Please sign in again.');
      return;
    }

    const courseId = uuidv4();
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-outline', {
        courseId: courseId,
        ...formData,
        topic: formData.topic.trim(),
        createdBy,
      });
      router.replace('/dashboard');
      toast("Your course outline is being generated. It'll be ready in a few minutes!");
      console.log(result);
    } catch (error) {
      const serverMessage = error?.response?.data?.error;
      const status = error?.response?.status;

      if (status === 403) {
        toast.error(serverMessage || 'Course limit reached for free plan. Upgrade to continue.');
        return;
      }

      if (status === 429 || status === 503) {
        toast.error(serverMessage || 'AI is busy right now. Please retry in a moment.');
        return;
      }

      toast.error(serverMessage || 'Unable to generate course right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function fetchMembership() {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const res = await fetch('/api/user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
          });
          const data = await res.json();
          setIsMember(!!data.isMember);
        } catch (e) {
          setIsMember(false);
        }
      }
    }
    fetchMembership();
  }, [user]);

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-32 mt-20">
      <div className="w-full mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="gap-2"
          disabled={loading}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>
      <h2 className="font-bold text-4xl text-primary">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-500 text-lg">
        Fill all the details in order to Generate Cards for your next project
      </p>

      <div className="mt-10">
        {step == 0 ? (
          <SelectOption SelectedStudyType={(value) => handleUserInput('studyType', value)} />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput('topic', value)}
            setDifficultLevel={(value) => handleUserInput('difficultyLevel', value)}
            isMember={isMember}
          />
        )}
      </div>
      <div className="flex justify-between w-full mt-32">
        {step != 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        {step == 0 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!hasStudyType || loading}>
            Next
          </Button>
        ) : (
          <Button onClick={GenerateCousreOutline} disabled={loading || !hasTopic || !hasDifficulty}>
            {loading ? <Loader className="animate-spin" /> : 'Generate'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;
