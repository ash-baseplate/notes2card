'use client';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const LOTTIE_LOADING_URL =
  'https://lottie.host/8a46a4d9-1cd2-4258-b472-543a7bf7b032/k33MzDw8sJ.lottie';
const LOTTIE_COMPLETION_URL =
  'https://lottie.host/a75726b2-25fa-40ae-b1cc-257b83e4fda3/jSZhKsjy8h.lottie';

function ViewNotes() {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepCount, setStepCount] = useState(() => {
    const chapterParam = searchParams.get('chapter');
    return chapterParam ? parseInt(chapterParam, 10) : 0;
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const result = await axios.post('/api/study-type', {
          courseId,
          studyType: 'notes',
        });
        setNotes(result?.data || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [courseId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepCount, loading]);

  const handlePrevious = () => setStepCount((prev) => prev - 1);
  const handleNext = () => setStepCount((prev) => prev + 1);
  const handleGoBack = () => router.back();

  const hasNotes = notes.length > 0;
  const isLastStep = hasNotes && stepCount >= notes.length;
  const isFirstStep = stepCount === 0;
  const isNotLastNote = stepCount < notes.length;
  const currentNoteContent = notes[stepCount]?.notes?.replace('```html', '') || '';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-64 h-64">
          <DotLottieReact src={LOTTIE_LOADING_URL} loop autoplay />
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading your notes...</p>
      </div>
    );
  }

  return (
    <div>
      {hasNotes && (
        <div className="flex gap-5 items-center">
          {!isFirstStep && (
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {notes.map((_, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full ${
                index < stepCount ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
          {isNotLastNote && (
            <Button variant="outline" size="sm" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      )}

      <div className="mt-10">
        {!isLastStep && <div dangerouslySetInnerHTML={{ __html: currentNoteContent }} />}

        {isLastStep && (
          <div className="flex flex-col items-center justify-center mt-10 gap-5">
            <div className="w-80 h-80">
              <DotLottieReact src={LOTTIE_COMPLETION_URL} loop autoplay />
            </div>
            <h2 className="text-gray-500 text-lg mt-4">You have reached the end of the notes.</h2>
            <Button onClick={handleGoBack}>Go Back to Course Catalogue</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewNotes;
