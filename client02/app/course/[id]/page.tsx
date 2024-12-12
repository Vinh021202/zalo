'use client'
import React, { useEffect, useState } from 'react';
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";
import Loader from '@/app/components/Loader/Loader';

const Page = ({ params }: any) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap params Promise and set the id
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  if (!id) {
    // Optionally show a loading state while `id` is being resolved
    return <div><Loader /></div>;
  }

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
