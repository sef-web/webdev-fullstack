
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

//buyer
import BuyerPage from "./pages/buyer_dashboard/BuyerPage";
import BuyerCart from "./pages/buyer_dashboard/BuyerCart";

//designs
import "./style.css";
import "./LoginDes.css";
import "./signUp.css";
import "./welcomePage.css";
import "./productCard.css";
import "./buyerCartStyles.css";
import "./confirmOrder.css"

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
          <Route path="/update/:id" element={<UpdateProduct />} />

          {/* Buyer-Specific Routes */}
          <Route path="/buyerpage" element={<BuyerPage />} />
          <Route path="/buyercart" element={<BuyerCart />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
