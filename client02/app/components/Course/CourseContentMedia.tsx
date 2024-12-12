import { Style } from "@/app/style/stylelogin";
import CoursePlayer from "@/app/Utils/CoursePlayer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import Avatar02 from "../../../public/asstes/avatar.png";
import toast from "react-hot-toast";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCoursesDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/Utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:8000";
const socketId = socketIO(ENDPOINT, {
    transports: ["websocket"]  // Sử dụng WebSocket transport
  });
type Props = {
  data: any;
  id: string; // Dấu chấm phẩy đã được thêm ở đây
  activeVideo: number;
  setAciveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setAciveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [rating, setRating] = useState(1);
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionsCreationLoading },
  ] = useAddNewQuestionMutation();

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const { data: courseData, refetch: courseRefetch } =
    useGetCoursesDetailsQuery(id, { refetchOnMountOrArgChange: true });

  const [
    addReplyInReview,
    {
      isSuccess: replyIsSuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();

  const course = courseData?.course;
  console.log("Course: " , course)

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );


  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question cant't be empty");
      
    } else {
      console.log({
        question,
        courseId: id,
        contentId: data[activeVideo]?._id,
      });
      
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]?._id,
      });

    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question added successfully!");
      socketId.emit("notification" , {
        title: "đơn hàng mới",
        message: `Bạn có một Câu hỏi mới từ ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully!");
      if(user.role !== "admin"){
        socketId.emit("notification" , {
          title: "đơn hàng mới",
          message: `bạn có một câu hỏi mới trả lời từ ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message || "Something went wrong");
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message || "Something went wrong");
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      toast.success("Review added successfully");
      socketId.emit("notification" , {
        title: "đơn hàng mới",
        message: `Bạn có một đánh giá mới từ ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = error as any;
        
        toast.error(errorMessage.data.message || "Something went wrong");
      }
    }
    if (replyIsSuccess) {
      setReply("");
      courseRefetch();
      toast.success("Reply added successfully");
    }
    if (replyError) {
      const errorMessage = replyError as any; // Assuming the error is in this object

      // Check if 'data' and 'data.message' exist before accessing
      if (errorMessage?.data?.message) {
        toast.error(errorMessage.data.message); // Show the error message
      } else {
        toast.error("Something went wrong"); // Fallback error message
      }
    }
  }, [
    isSuccess,
    error,
    answerError,
    answerSuccess,
    reviewSuccess,
    reviewError,
    replyIsSuccess,
    replyError,
  ]);

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = () => {
    if (review.length === 0) {
      toast.error("Review cant't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply cant't be emptu");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  useEffect(() => {
    socketId.on("connect", () => {
        console.log("WebSocket connected");
    });

    socketId.on("notification", (data) => {
        console.log("Received notification:", data); // Log thông báo nhận được
        // Cập nhật state nếu cần
    });

    socketId.on("connect_error", (error) => {
        console.log("Socket connection error:", error);
    });

    return () => {
        socketId.off("connect");
        socketId.off("notification");
        socketId.disconnect();
    };
}, []);

  return (
    <div className="w-[95%] md:w-[78%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />

<div className="mb-3">
  <label className={Style.Label}>File bài tập (PDF)</label>
  {data[activeVideo]?.assignmentFile ? (
    <div className="mt-2">
      <a
        href={`${data[activeVideo]?.assignmentFile}/format/pdf`} // Thêm transformation định dạng PDF
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Xem bài tập PDF
      </a>
    </div>
  ) : (
    <p className="text-gray-500">Chưa có file bài tập.</p>
  )}
</div>


      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${
            Style.button
          } text-black dark:text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() => setAciveVideo(activeVideo === 0 ? 0 : activeVideo - 1)}
        >
          <AiOutlineArrowLeft className="mr-2" />
          Bài học trước
        </div>
        <div
          className={`${
            Style.button
          } text-black dark:text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setAciveVideo(
              data.length - 1 === 0
                ? 0
                : activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Bài học tiếp theo
          <AiOutlineArrowRight className="mr-2" />
        </div>
      </div>
      <h1 className="text-black dark:text-white pt-2 text-[25px] font-[600]">
        {data[activeVideo].title}{" "}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`md:text-[20px]  cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "text-black dark:text-white"
            } `}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 text-black dark:text-white">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5" key={item}>
              <h2 className="md:text-[20px] md:inline-block text-black dark:text-white">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] md:text-[20px] md:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
            {data[activeVideo]?.assignment && (
              <div className="mt-5">
                <h2 className="text-[20px] font-bold text-black dark:text-white">
                  Bài tập:
                </h2>
                <a
                  href={data[activeVideo]?.assignment.fileUrl}
                  className="text-[#4395c4] md:text-[18px] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data[activeVideo]?.assignment.title}
                </a>
              </div>
            )}
        </div>
        
      )}
      {/* {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user?.avatar ? user?.avatar?.url : Avatar02}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="viết câu hỏi của bạn..."
              className="outline-none bg-transparent ml-3 border-[#ffffff57] md:w-full p-2 rounded w-[90%] md:text-[18px] font-Poppins"
            />
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${
                Style.button
              } !w-[120px] !h-[40px] text-[18px] mt-5 md:mr-0 mr-2 ${
                questionsCreationLoading ? "cursor-not-allowed" : ""
              }`}
              onClick={questionsCreationLoading ? () => {} : handleQuestion}
            >
              Đăng
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <>
          <div className=" flex w-full">
            <>
              {!isReviewExists && (
                <>
                  <div className="w-full">
                    <Image
                      src={user?.avatar ? user?.avatar?.url : Avatar02}
                      width={50}
                      height={50}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Đưa ra đánh giá <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color={
                              rating >= i
                                ? "rgb(246,186,0)"
                                : "rgb(200,200,200)"
                            } // Thay đổi màu sao
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color={
                              rating >= i
                                ? "rgb(246,186,0)"
                                : "rgb(200,200,200)"
                            } // Thay đổi màu sao
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="viết câu hỏi của bạn..."
                      className="outline-none bg-transparent ml-3 border border-[#ffffff57]  md:w-full p-2 rounded w-[90%] md:text-[18px] font-Poppins"
                    />

                    <div className="w-full flex justify-end">
                      <div
                        className={`${
                          Style.button
                        } !w-[120px] !h-[40px] text-[18px] mt-5 md:mr-0 mr-2 ${
                          reviewCreationLoading && "cursor-no-drop"
                        } `}
                        onClick={
                          reviewCreationLoading ? () => {} : handleReviewSubmit
                        }
                      >
                        Đăng
                      </div>
                    </div>
                  </div>
                </>
              )}
              <br />
              <div className="w-full h-[1px] bg-[#ffffff3b]">
                <div className="w-full">
                  {(course?.reviews && [...course.reviews].reverse())?.map(
                    (item: any, index: number) => (
                      <div
                        className="w-full my-5 dark:text-white text-black"
                        key={item}
                      >
                        <div className="w-full flex">
                          <div>
                            <Image
                              src={
                                item?.user?.avatar
                                  ? item?.user?.avatar?.url
                                  : Avatar02
                              }
                              width={50}
                              height={50}
                              alt=""
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-2">
                            <h1 className="text-[18px]">{item?.user.name}</h1>
                            <Ratings rating={item.rating} />
                            <p>{item.comment}</p>
                            <small className="dark:text-[#ffffff83] text-[#00000035]">
                              {format(item.createdAt)} .
                            </small>
                          </div>
                        </div>
                        {user.role === "admin" && (
                          <span
                            className={`${Style.Label} !ml-10 cursor-pointer`}
                            onClick={() => {
                              setIsReviewReply(true);
                              setReviewId(item._id);
                            }}
                          >
                            Thêm trả lời
                          </span>
                        )}
                        {item.commentReplies.map((i: any, index: number) => (
                          <div
                            className="w-full flex mlpx:ml-16 my-5"
                            key={index}
                          >
                            <div className="w-[50px] h-[50px]">
                              <Image
                                src={
                                  i.user.avatar ? i.user.avatar.url : Avatar02
                                }
                                width={50}
                                height={50}
                                alt="User Avatar"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />
                            </div>
                            <div className="pl-2">
                            <div className="flex items-center">
                    <h5 className="text-[20px]">{item?.user.name}</h5>
                      <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                  
                  </div>
                              <p>{i.comment}</p>
                              <small className="text-[#ffffff83]">
                                {format(i.createdAt)}.
                              </small>
                            </div>
                          </div>
                        ))}

                        {isReviewReply && (
                          <div className="w-full flex relative dark:text-white text-black">
                            <input
                              type="text"
                              placeholder="Nhập câu trả lời"
                              value={reply} // Controlled component: state reflects the value of the input
                              onChange={(e: any) => setReply(e.target.value)} // Update state on change
                              className={`block md:ml-2 mt-2 outline-none bg-transparent border-b
        dark:text-white text-black border-[#00000027]  dark:border-[#fff] p-5 w-[95%]`}
                            />
                            <button
                              type="submit"
                              className="absolute right-0 bottom-1 text-cyan-500"
                              onClick={handleReviewReplySubmit} // Submit the reply
                            >
                              Đăng
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          </div>
          <br />
        </>
      )} */}
      {activeBar === 2 && (
  <>
    <div className="flex w-full space-x-3">
      <Image
        src={user?.avatar ? user?.avatar?.url : Avatar02}
        width={50}
        height={50}
        alt="User Avatar"
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Viết câu hỏi của bạn..."
        className="outline-none bg-transparent border-[#ffffff57] p-2 rounded w-[90%] md:w-full md:text-[18px] font-Poppins"
        rows={5}
      />
    </div>
    <div className="w-full flex justify-end mt-5">
      <div
        className={`${Style.button} !w-[120px] !h-[40px] text-[18px] ${
          questionsCreationLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={questionsCreationLoading ? () => {} : handleQuestion}
      >
        Đăng
      </div>
    </div>
    <hr className="w-full my-5 bg-[#ffffff3b]" />
    <CommentReply
      data={data}
      activeVideo={activeVideo}
      answer={answer}
      setAnswer={setAnswer}
      handleAnswerSubmit={handleAnswerSubmit}
      user={user}
      setQuestionId={setQuestionId}
      answerCreationLoading={answerCreationLoading}
    />
  </>
)}

{activeBar === 3 && (
  <>
    <div className="flex w-full justify-start items-start p-4">
      {/* Nếu chưa có đánh giá */}
      {!isReviewExists && (
        <div className="w-full flex flex-col md:flex-row items-start mb-6">
          <Image
            src={user?.avatar ? user?.avatar?.url : Avatar02}
            width={50}
            height={50}
            alt="User Avatar"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div className="ml-4 w-full">
            <h5 className="text-[20px] font-[500] dark:text-white text-black mb-2">
              Đưa ra đánh giá <span className="text-red-500">*</span>
            </h5>
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <AiFillStar
                  key={i}
                  className="mr-1 cursor-pointer"
                  color={rating >= i ? "rgb(246,186,0)" : "rgb(200,200,200)"}
                  size={25}
                  onClick={() => setRating(i)}
                />
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Viết câu hỏi của bạn..."
              className="outline-none bg-transparent border border-[#ffffff57] p-2 rounded w-full md:text-[18px] font-Poppins mb-4"
              rows={5}
            />
            <div className="flex justify-end">
              <div
                className={`${Style.button} !w-[120px] !h-[40px] text-[18px] mt-2 ${reviewCreationLoading && "cursor-not-allowed"}`}
                onClick={reviewCreationLoading ? () => {} : handleReviewSubmit}
              >
                Đăng
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dấu phân cách */}
      <div className="w-full h-[1px] bg-[#ffffff3b] my-6" />

      {/* Hiển thị các đánh giá đã có */}
      <div className="w-full">
        {(course?.reviews && [...course.reviews].reverse())?.map((item: any) => (
          <div key={item._id} className="w-full my-5 dark:text-white text-black">
            <div className="flex items-start mb-4">
              <Image
                src={item?.user?.avatar ? item?.user?.avatar?.url : Avatar02}
                width={50}
                height={50}
                alt="User Avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <div className="ml-4 w-full">
                <h1 className="text-[18px] font-[500]">{item?.user.name}</h1>
                <Ratings rating={item.rating} />
                <p className="mt-2">{item.comment}</p>
                <small className="dark:text-[#ffffff83] text-[#00000035]">{format(item.createdAt)}.</small>
              </div>
            </div>

            {/* Thêm trả lời cho admin */}
            {user.role === "admin" && (
              <span
                className={`${Style.Label} cursor-pointer mt-2 block`}
                onClick={() => {
                  setIsReviewReply(true);
                  setReviewId(item._id);
                }}
              >
                Thêm trả lời
              </span>
            )}

            {/* Hiển thị các câu trả lời */}
            {item.commentReplies.map((i: any) => (
              <div key={i._id} className="w-full flex ml-12 my-5">
                <Image
                  src={i.user.avatar ? i.user.avatar.url : Avatar02}
                  width={50}
                  height={50}
                  alt="User Avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="pl-4">
                  <div className="flex items-center">
                    <h5 className="text-[20px] font-[500]">{i.user.name}</h5>
                    <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                  </div>
                  <p className="mt-2">{i.comment}</p>
                  <small className="text-[#ffffff83]">{format(i.createdAt)}.</small>
                </div>
              </div>
            ))}

            {/* Phần nhập câu trả lời khi được bật */}
            {isReviewReply && (
              <div className="w-full flex relative dark:text-white text-black mt-4">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="block md:ml-2 mt-2 outline-none bg-transparent border-b dark:text-white text-black border-[#00000027] dark:border-[#fff] p-5 w-[95%]"
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1 text-cyan-500"
                  onClick={handleReviewReplySubmit}
                >
                  Đăng
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </>
)}







    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo]?.questions?.map((item: any, index: any) => (
          <CommentItem
            key={index}
            data={data} // Chỉ truyền dữ liệu câu hỏi hiện tại
            activeVideo={activeVideo}
            answer={answer}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            item={item}
            index={index}
            setAnswer={setAnswer}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  setQuestionId,
  answer,
  handleAnswerSubmit,
  item,
  setAnswer,
  answerCreationLoading,
}) => {
  const [replyActive, setreplyActive] = useState(false);

  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <Image
              src={item?.user?.avatar ? item?.user?.avatar?.url : Avatar02}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
          <div className="pl-3">
            <h5 className="text-[20px] text-[#000000b8] dark:text-[#ffffff83] ">
              {item?.user.name}
            </h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {!item?.createdAt ? "" : format(item?.createdAt)} .
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span
            className="md:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              setreplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "Tất cả các câu trả lời"
                : "Thêm trả lời"
              : "Ẩn câu trả lời"}
          </span>
          <BiMessage
            size={20}
            className="cursor-poiter text-[#000000b8] dark:text-[#ffffff83] "
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83] ">
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && (
          <>
            {item.questionReplies.map((item: any) => (
              <div
                className="w-full flex md:ml-16 my-5 text-black dark:text-white"
                key={item._id} // Thêm key duy nhất cho mỗi câu trả lời
              >
                <Image
                  src={item?.user?.avatar ? item?.user?.avatar?.url : Avatar02}
                  width={50}
                  height={50}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="pl-2">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item?.user.name}</h5>
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{item?.answer}</p>
                  <small className="text-[#ffffff83]">
                    {format(item.createdAt)}.
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative dark:text-white text-black">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời "
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`block md:ml-2 mt-2 outline-none bg-transparent border-b
                     dark:text-white text-black border-[#00000027]  dark:border-[#fff] p-5 w-[95%] ${
                       answer === "" ||
                       (answerCreationLoading && "cursor-not-allowed")
                     } `}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1 text-cyan-500"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Đăng
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;