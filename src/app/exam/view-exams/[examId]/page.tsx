import ViewQuestions from "@/components/view-questions";
import React from "react";

interface Props {
  params: {
    examId: string;
  };
}

export default function page({ params: { examId } }: Props) {
  return <ViewQuestions examId={examId} />;
}
