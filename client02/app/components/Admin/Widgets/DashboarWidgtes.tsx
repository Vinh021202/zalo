import React, { FC, useEffect, useState } from "react";
import UseAnalytics from "../Analytics/UseAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OerdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUserAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboarWidgtes: FC<Props> = ({ open }) => {
  const [comparePercentenge, setconpagrePercentenge] = useState();
  const [odersComparePercentage, setOdersComparePercentage] = useState<any>();
  const [userComparePercentage, setUserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUserAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading || ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMoths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMoths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMoths[1].count;
          const ordersPreviousMonth = ordersLastTwoMoths[0].count;

          const usersPercentChage =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) /
                  usersPreviousMonth) *
                100
              : 100;

          const ordersPercentChage =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) /
                  ordersPreviousMonth) *
                100
              : 100;

          setUserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChage: usersPercentChage,
          });

          setOdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMoth: ordersPreviousMonth,
            percentChage: ordersPercentChage,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%,25%] gap-8">
        <div className="p-8">
          <UseAnalytics />
        </div>
        <div className="pt-[80%] pr-8">
          {/* Widget 1 */}
          <div className="dark:bg-[#111C43] bg-white rounded-sm shadow p-5 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <div className="ml-4">
                  <h5 className="font-Poppins dark:text-[#fff] text-black text-[20px]">
                    {odersComparePercentage?.currentMonth}
                  </h5>
                  <h5 className="font-Poppins dark:text-[#45CBA0] text-black text-[400]">
                    Doanh số đạt được
                  </h5>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel
                  value={odersComparePercentage?.percentChage > 0 ? 100 : 0}
                  open={open}
                />
                <h5 className="text-center pt-4 text-[16px] dark:text-[#fff] text-black text-[20px">
                  {odersComparePercentage?.percentChage > 0
                    ? "+" + odersComparePercentage?.percentChage.toFixed(2)
                    : "-" + odersComparePercentage?.percentChage.toFixed(2)}
                  %
                </h5>
              </div>
            </div>
          </div>

          {/* Widget 2 */}
          <div className="dark:bg-[#111C43] bg-white rounded-sm shadow p-5 transition-transform hover:scale-105 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[20px]" />
                <div className="ml-4">
                  <h5 className="font-Poppins dark:text-[#fff] text-black text-[20px]">
                    {userComparePercentage?.currentMonth}
                  </h5>
                  <h5 className="font-Poppins dark:text-[#45CBA0] text-black text-[20px]">
                    Người Mới
                  </h5>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel
                  value={userComparePercentage?.percentChage > 0 ? 100 : 0}
                  open={open}
                />
                <h5 className="text-center pt-4 text-[16px] dark:text-[#fff] text-black text-[20px">
                  {userComparePercentage?.percentChage > 0
                    ? "+" + userComparePercentage?.percentChage.toFixed(2)
                    : "-" + userComparePercentage?.percentChage.toFixed(2)}
                  %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[65%, 35%] mt-[-20px] gap-8">
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
            Giao dịch gần đây
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboarWidgtes;
