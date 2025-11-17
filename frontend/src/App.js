import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Authentication Pages
import Welcome from "./pages/auth/Welcome/Welcome";
import Signup from "./pages/auth/Signup/Signup";
import Login from "./pages/auth/Login/Login";

// Seller Pages
import SellerPage from "./pages/seller/SellerPage/SellerPage";
import UpdateProduct from "./pages/seller/UpdateProduct/UpdateProduct";
import MonitorOrder from "./pages/seller/MonitorOrder/MonitorOrder";
import ReviewDetails from "./pages/seller/ReviewDetails/ReviewDetails";
import IncomeDetails from "./pages/seller/IncomeDetails/IncomeDetails";

// Buyer Pages
import BuyerPage from "./pages/buyer/BuyerPage/BuyerPage";
import BuyerCart from "./pages/buyer/BuyerCart/BuyerCart";
import ViewOrder from "./pages/buyer/ViewOrder/ViewOrder";
import OrderHistory from "./pages/buyer/OrderHistory/OrderHistory";

// Global Styles
import "./styles/index.css";
import "./styles/logout-btn.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Welcome page */}
          <Route path="/" element={<Welcome />} />

          {/* Sign Up / login for user */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />}/>

          {/* Seller side */}
          <Route path="/sellerpage" element={<SellerPage/>}/>
          <Route path="/update/:id" element={<UpdateProduct />}/>
          <Route path="/monitororder" element={<MonitorOrder/>}/>
          <Route path="/reviewdetails" element={<ReviewDetails/>}/>
          <Route path="/incomedetails" element={<IncomeDetails/>}/>

          {/* Buyer-Specific Routes */}
          <Route path="/buyerpage" element={<BuyerPage />} />
          <Route path="/buyercart" element={<BuyerCart />} />
          <Route path="/vieworder" element={<ViewOrder/>} />
          <Route path="/orderhistory" element={<OrderHistory/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
