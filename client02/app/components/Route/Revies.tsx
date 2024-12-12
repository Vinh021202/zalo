import Image from "next/image";
import React from "react";
import { Style } from "@/app/style/stylelogin";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Trần Trung Hiếu",
    avatar: "https://i.pinimg.com/550x/f2/28/44/f2284432080f38464d9dade7b606a6c9.jpg",
    profession: "Hướng dẫn viên | Kế toán.",
    comment:
      "Website rất tuyệt vời mong bạn phát triển thêm.",
  },
  {
    name: "Trần Mai Linh ",
    avatar: "https://anhvienpiano.com/wp-content/uploads/2019/05/chup-anh-thoi-trang-dep-my-man-duoi-anh-mat-troi-1.jpg",
    profession: "Nhân viên văn phòng ",
    comment:
      "Khoá học rất hay .",
  },
  {
    name: "Phương Nguyễn Kiều Thiên",
    avatar: "https://anhvienpiano.com/wp-content/uploads/2019/07/Ch%E1%BB%A5p-%E1%BA%A3nh-ngh%E1%BB%87-thu%E1%BA%ADt.jpg",
    profession: "Sinh viên ",
    comment:
      "Một nền tảng tuyệt vời để học tiếng Anh trực tuyến. Các khóa học dễ theo dõi và nội dung rất thú vị!.",
  },
  {
    name: "Trần Nguyễn Anh Thư",
    avatar: "https://anhvienpiano.com/wp-content/uploads/2019/07/chup-anh-nghe-thuat-768x502.jpeg",
    profession: "Nội trợ",
    comment:
      "Các khóa học tiếng Anh trực tuyến tuyệt vời đã giúp tôi cải thiện kỹ năng nói và nghe!",
  },
  {
    name: "Trần Nguyễn Tuyết Phương",
    avatar: "https://anhvienpiano.com/wp-content/uploads/2017/03/trang-diem-dep-768x749.jpg",
    profession: "Nhân viên chăm sóc khác hàng",
    comment:
      "Rất khuyên bạn nên sử dụng nền tảng này nếu muốn cải thiện kỹ năng tiếng Anh một cách thú vị và tương tác.",
  },
  {
    name: "Lê Quang Dẫn",
    avatar: "https://anhvienpiano.com/wp-content/uploads/2021/12/anh-visa-dep.png",
    profession: "Full stack developer | Quarter ltd.",
    comment:
      "Tôi thích trải nghiệm học tập cá nhân hóa mà nền tảng này mang lại. Nội dung được điều chỉnh phù hợp với trình độ và nhu cầu của tôi.",
  },
  
];

const Revies = (props: Props) => {
  return (
    <div className="w-[90%] md:w-[85%] m-auto py-16">
    {/* Phần hình ảnh & văn bản */}
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Hình ảnh */}
      <div className="md:w-1/2 w-full rounded overflow-hidden shadow-lg hover:scale-105 transition-all duration-500 ">
        <Image
          src={require("../../../public/asstes/business3.jpg")}
          alt="business"
          width={500}
          height={350}
          className="rounded-md object-cover hero_animation"
        />
      </div>

      {/* Phần văn bản */}
      <div className="md:w-1/2 w-full text-center md:text-left mt-8 md:mt-0">
        <h3 className={`${Style.title} text-3xl md:text-4xl font-bold text-black dark:text-white`}>
          Học sinh của chúng tôi có{" "}
          <span className="text-green-300">Sức mạnh của chúng tôi</span> <br />
          Xem Họ Nói Gì Về Chúng Tôi
        </h3>
        <br />
        <p className={`${Style.Label} text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300`}>
          Bản thân công ty đã là một công ty rất thành công. Và vì chúng ta xứng đáng với niềm vui,
          không ai có thể chịu đựng nỗi đau bằng niềm vui.
        </p>
      </div>
    </div>


      <br />
      <br />

      {/* Danh sách review */}
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 
        md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px]">
        {reviews &&
          reviews.map((item, index) => (
            <ReviewCard item={item} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Revies;
