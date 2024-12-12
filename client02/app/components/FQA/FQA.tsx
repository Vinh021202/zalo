import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { Style } from '@/app/style/stylelogin';
import { HiMinus, HiPlus } from 'react-icons/hi';

interface FQAItem {
  _id: string;
  question: string;
  answer: string;
}

type Props = {}

const FQA = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<FQAItem[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <>
      <div className="w-[90%] md:w-[80%] m-auto mt-[120px]">
        <h1 className={`${Style.title} text-center text-4xl md:text-5xl font-semibold text-gray-800 dark:text-white`}>
          Câu hỏi thường gặp
        </h1>
        <div className="mt-12">
          <dl className="space-y-8">
            {questions.map((q) => (
              <div
                key={q._id}
                className={`${q._id !== questions[0]?._id && 'border-t'} border-gray-200 pt-6`}
              >
                <dt className="text-lg">
                  <button
                    className="flex items-center justify-between w-full text-left dark:text-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    onClick={() => toggleQuestion(q._id)}
                    aria-expanded={activeQuestion === q._id ? 'true' : 'false'}
                  >
                    <span>{q.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q._id ? (
                        <HiMinus className="h-6 w-6 dark:text-white text-black" />
                      ) : (
                        <HiPlus className="h-6 w-6 dark:text-white text-black" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === q._id && (
                  <dd className="mt-2 pr-12 pl-6">
                    <p className="text-base font-Poppins dark:text-white text-gray-600">{q.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default FQA;
