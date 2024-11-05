import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import CartSidebar from "./components/cart/CartSidebar";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { CheckoutForm } from "./components/checkout/CheckoutForm";
import { Toaster } from "react-hot-toast";
import ShoppingGuide from "./pages/ShoppingGuide";
import CareInstructions from "./pages/CareInstructions";
import PaymentDelivery from "./pages/PaymentDelivery";
import Terms from "./pages/Terms";
import ReturnPolicy from "./pages/ReturnPolicy";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-background">
                <Toaster position="top-center" />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category" element={<CategoryPage />} />
                    <Route
                      path="/category/:categoryId"
                      element={<CategoryPage />}
                    />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/checkout" element={<CheckoutForm />} />
                    <Route path="/shopping-guide" element={<ShoppingGuide />} />
                    <Route
                      path="/care-instructions"
                      element={<CareInstructions />}
                    />
                    <Route
                      path="/payment-delivery"
                      element={<PaymentDelivery />}
                    />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Routes>
                </main>
                <Footer />
                <CartSidebar />
              </div>
            </Router>
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
