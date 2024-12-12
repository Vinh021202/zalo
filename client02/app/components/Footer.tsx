import Link from 'next/link'
import React from 'react'

type Props = {}

const Footer = (props: Props) => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="border-t border-gray-700">
        <div className="w-[95%] md:w-full md:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Về</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Câu chuyện của chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Liên kết nhanh</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/courses" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Các khóa học
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Tài khoản của tôi
                  </Link>
                </li>
                <li>
                  <Link href="/courses-dashboard" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Khóa học bảng điều khiển
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Liên kết xã hội</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Youtube
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Thông tin liên hệ</h3>
              <ul className="space-y-4">
                <li className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                  SĐT: 094-6565-316
                </li>
                <li className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                  Địa chỉ: 12 Nguyễn Văn Bảo
                </li>
                <li className="text-lg text-gray-300 hover:text-green-500 transition-colors">
                  Mail: quocvinhtran0212@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              IUH - Đại Học Công Nghiệp 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
