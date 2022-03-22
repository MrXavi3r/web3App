import React, { useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";

const Toast = ({ options }) => {
  const { toastList, setToastList } = useContext(TransactionContext);

  // handle closing of toast messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setToastList((toastList) =>
        toastList.filter((_, i) => i !== toastList.length - 1)
      );
    }, 10000);
    return () => clearTimeout(timer);
  }, [toastList]);

  return (
    <div
      className=" bg-blue-600 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block ml-5 mb-3 animate-slide-in-left"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-mdb-autohide="true"
    >
      <div
        className={`${
          options?.type === "success"
            ? "bg-blue-600 border-blue-500"
            : "bg-red-600 border-red-500"
        } flex justify-between items-center py-2 px-3 bg-clip-padding border-b rounded-t-lg`}
      >
        <p className="font-bold text-white flex items-center">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="info-circle"
            className="w-4 h-4 mr-2 fill-current"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
            ></path>
          </svg>
          {options?.title || "Message"}
        </p>
        <div className="flex items-center">
          <p className="text-white opacity-90 text-xs">just now</p>
        </div>
      </div>
      <div
        className={`p-3 ${
          options?.type === "success" ? "bg-blue-600" : "bg-red-600"
        } rounded-b-lg break-words text-white`}
      >
        {options?.message || "Hello, world! This is a toast message."}
      </div>
    </div>
  );
};

export default Toast;
