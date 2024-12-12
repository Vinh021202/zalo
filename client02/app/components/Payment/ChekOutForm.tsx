'use client';

import React, { useEffect, useState } from "react";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useAddUserToCourseMutation } from "@/redux/features/courses/coursesApi"; // Import hook mới
import { Style } from "@/app/style/stylelogin";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:8000";
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"], // Sử dụng WebSocket transport
});

type Props = {
  setOpen: any;
  data: any;
  user: any;
};

const ChekOutForm = ({ setOpen, data, user }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [addUserToCourse] = useAddUserToCourseMutation(); // Hook để thêm user vào khóa học

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const orderResponse = await createOrder({
          courseId: data._id,
          payment_info: paymentIntent,
        });

        if ("data" in orderResponse) {
          // Thêm user vào khóa học
          await addUserToCourse({ courseId: data._id, userId: user._id });
          toast.success("Payment successful! Access granted to the course.");
          redirect(`/course-access/${data._id}`);
        }
      } catch (error) {
        console.error("Error adding user to course:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.data?.message || "Failed to create order.";
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${Style.button} mt-2 !h-[35px]`}>
          {isLoading ? "Paying..." : "Pay now"}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="text-[red]">
          {message}
        </div>
      )}
    </form>
  );
};

export default ChekOutForm;
