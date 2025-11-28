import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
function TopicInput() {
  return (
    <div className="mt-10 w-full flex flex-col">
      <h2> Enter the Topic or Paste the content for which you want to generate the content</h2>

      <Textarea placeholder="Start writting here" className="m-2" />
      <h2 className="mt-5 mb-3">Select the Difficult Level:</h2>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Difficluty Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopicInput;
