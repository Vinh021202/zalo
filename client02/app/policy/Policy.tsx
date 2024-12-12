import React from "react";
import { Style } from "../style/stylelogin";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <div className={`w-[95%] md:w-[85%] m-auto py-6 px-3`}>
        <h1 className={`${Style.title}  pt-2 text-2xl md:text-3xl text-center`}>
          Điều khoản và điều kiện của nền tảng
        </h1>
        <div className="mt-6">
          <h2 className="font-Poppins text-[18px] text-blue-500">1. Giới thiệu</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Chào mừng bạn đến với nền tảng quản lý khóa học trực tuyến. Bằng
            cách sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều
            khoản và điều kiện sau đây. Nếu không đồng ý với bất kỳ phần nào của
            các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">2. Tài khoản người dùng</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Người dùng phải cung cấp thông tin chính xác và cập nhật khi đăng ký
            tài khoản. Người dùng chịu trách nhiệm bảo mật thông tin tài khoản
            của mình và thông báo ngay lập tức nếu phát hiện có dấu hiệu truy
            cập trái phép. Nền tảng có quyền tạm ngưng hoặc hủy tài khoản nếu
            phát hiện người dùng vi phạm quy định.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">3. Quyền và nghĩa vụ của người dùng</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Người dùng có quyền: Truy cập và sử dụng các khóa học đã đăng ký.
            Đưa ra phản hồi hoặc đánh giá về khóa học. Người dùng có nghĩa vụ:
            Không sử dụng nền tảng cho mục đích gian lận, vi phạm pháp luật,
            hoặc phát tán nội dung không phù hợp. Thanh toán đầy đủ chi phí (nếu
            có) để truy cập các dịch vụ hoặc khóa học trên nền tảng.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">4. Quyền và trách nhiệm của nền tảng</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Nền tảng có quyền: Chỉnh sửa, cập nhật hoặc gỡ bỏ nội dung hoặc khóa
            học bất kỳ lúc nào. Thu hồi quyền truy cập của người dùng nếu vi
            phạm điều khoản sử dụng. Nền tảng có trách nhiệm: Đảm bảo chất lượng
            dịch vụ, khóa học và hỗ trợ người dùng. Bảo mật thông tin cá nhân
            của người dùng theo chính sách bảo mật.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">5. Chính sách thanh toán và hoàn tiền</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Người dùng có thể thanh toán qua các phương thức được cung cấp trên
            nền tảng. Nền tảng không hoàn tiền trong các trường hợp: Người dùng
            đã hoàn thành khóa học. Vi phạm điều khoản sử dụng. Hoàn tiền chỉ áp
            dụng nếu khóa học không được cung cấp như cam kết hoặc phát sinh lỗi
            từ phía nền tảng.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">6. Quy định về nội dung</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Mọi nội dung trên nền tảng (bao gồm khóa học, tài liệu, hình ảnh,
            video,...) thuộc sở hữu trí tuệ của nền tảng hoặc các bên hợp tác.
            Người dùng không được sao chép, phân phối hoặc sử dụng nội dung cho
            mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">7. Giới hạn trách nhiệm</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Nền tảng không chịu trách nhiệm cho bất kỳ tổn thất, thiệt hại nào
            phát sinh từ việc sử dụng dịch vụ, trừ khi có lỗi trực tiếp từ phía
            nền tảng. Người dùng tự chịu trách nhiệm với các hành động hoặc
            quyết định học tập dựa trên nội dung khóa học.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">8. Thay đổi điều khoản</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Nền tảng có quyền thay đổi các điều khoản và điều kiện bất kỳ lúc
            nào. Thông báo sẽ được gửi qua email hoặc đăng tải trên nền tảng.
            Người dùng tiếp tục sử dụng dịch vụ sau khi điều khoản được thay đổi
            đồng nghĩa với việc chấp nhận các thay đổi này.
          </p>

          <h2 className="font-Poppins text-[18px] text-blue-500">9. Cam kết</h2>
          <p className="py-2 text-[16px] font-Poppins leading-8">
            Người dùng cam kết đọc, hiểu và đồng ý tuân thủ tất cả các điều
            khoản và điều kiện trên khi sử dụng nền tảng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
