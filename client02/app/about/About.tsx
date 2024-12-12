import React from "react";
import { Style } from "../style/stylelogin";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${Style.title} md:!text-[45px] text-center`}>
        Website <span className="text-blue-400">Học Trực Tuyến</span>
      </h1>
      <br />
      <div className="w-[95%] md:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins leading-relaxed">
          Bạn đã sẵn sàng đưa kiến thức của mình lên một tầm cao mới chưa? Hãy
          đến ngay website của chúng tôi, cộng đồng hàng đầu chuyên giúp các học
          viên mới đạt được mục tiêu và phát huy hết tiềm năng của mình.
          <br />
          <br />
          Là người sáng lập của website, tôi hiểu rõ những thách thức đi kèm với
          việc học và phát triển của học viên. Đó là lý do tại sao tôi tạo ra
          website học trực tuyến để cung cấp cho các học viên mới các nguồn lực
          và hỗ trợ mà họ cần để thành công.
          <br />
          <br />
          Website của chúng tôi là kho tàng video thông tin về mọi thứ, từ kiến
          thức cơ bản đến các bài học nâng cao. Nhưng đó chỉ là khởi đầu. Các
          khóa học giá cả phải chăng của chúng tôi được thiết kế để cung cấp cho
          bạn nền giáo dục chất lượng cao mà bạn cần để thành công trong việc
          học, mà không tốn kém.
          <br />
          <br />
          Tại Website, chúng tôi tin rằng giá cả không bao giờ là rào cản để
          đạt được ước mơ của bạn. Đó là lý do tại sao các khóa học của chúng tôi
          có giá thấp để bất kỳ ai, bất kể tình hình tài chính của họ, đều có thể
          tiếp cận các công cụ và kiến thức họ cần để thành công.
          <br />
          <br />
          Nhưng Website không chỉ là một cộng đồng, chúng tôi là một gia đình.
          Cộng đồng những người có cùng chí hướng luôn hỗ trợ bạn trong từng bước
          đi, dù bạn mới bắt đầu hay muốn nâng cao kỹ năng của mình lên một tầm
          cao mới.
          <br />
          <br />
          Với Website bên cạnh, không có gì ngăn cản bạn và công việc mơ ước của
          bạn. Các khóa học và cộng đồng của chúng tôi sẽ cung cấp cho bạn sự
          hướng dẫn, hỗ trợ và động lực bạn cần để phát huy hết tiềm năng của mình
          và trở thành một học viên lành nghề.
          <br />
          <br />
          Vậy bạn còn chờ gì nữa? Hãy tham gia gia đình Website ngay hôm nay và
          cùng nhau chinh phục những bài học! Với các khóa học giá cả phải chăng,
          video thông tin và cộng đồng hỗ trợ, bầu trời là giới hạn.
        </p>
        <br />
        <div className="text-center">
          <span className="font-Poppins text-[15px]">Nguyễn Thị Hồng Lương</span>
          <h5 className="text-[15px] font-Poppins">Đại Học Công Nghiệp IUH</h5>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
