import { useEffect, useContext } from "react";
import {
  Navbar,
  Welcome,
  Footer,
  Services,
  Transactions,
  Toast,
} from "./components";
import { TransactionContext } from "./context/TransactionContext";

const App = () => {
  const { toastList } = useContext(TransactionContext);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
      <div className="flex flex-col items-center justify-center fixed bottom-0">
        {toastList.map((toast, index) => {
          return <Toast options={toast} key={index} />;
        })}
      </div>
    </div>
  );
};

export default App;
