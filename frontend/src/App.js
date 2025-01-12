
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import  Welcome from "./pages/authentication/welcome";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";

//seller
import SellerPage from "./pages/SellerPage";
import UpdateProduct from "./pages/UpdateProduct";
import MonitorOrder from "./pages/monitorOrder";
import ReviewDetails from "./pages/ReviewDetails";
import IncomeDetails from "./pages/IncomeDetails";

//buyer
import BuyerPage from "./pages/buyer_dashboard/BuyerPage";
import BuyerCart from "./pages/buyer_dashboard/BuyerCart";
import ViewOrder from "./pages/buyer_dashboard/viewOrder";

//designs
import "./style.css";
import "./LoginDes.css";
import "./signUp.css";
import "./welcomePage.css";
import "./productCard.css";
import "./buyerCartStyles.css";
import "./confirmOrder.css";
import "./viewOrder.css";
import "./IncomeDetails.css";
import "./SellerNotif.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Welcome page */}
          <Route path="/" element={<Welcome />} />

          {/* Sign Up / login for user */}
          <Route path="/Signup" element={<Signup />} />
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

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
