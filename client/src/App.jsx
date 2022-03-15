import { useState, useEffect } from "react";
import {
  Navbar,
  Welcome,
  Footer,
  Services,
  Transactions,
  Toast,
} from "./components";

const toastArray = [
  {
    type: "success",
    title: "Transaction Success",
    message: "Transaction was sent successfully!",
  },
  {
    type: "error",
    title: "Transaction Failed",
    message: "Error sending transaction, please try again",
  },
];

const App = () => {
  const [toastList, setToastList] = useState(toastArray);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
      <div className="flex flex-col fixed bottom-0">
        {toastList.map((toast, index) => {
          return <Toast options={toast} key={index} />;
        })}
      </div>
    </div>
  );
};

export default App;
