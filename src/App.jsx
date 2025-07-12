import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LandingPageHorizontal as LandingPage } from "./pages/LandingPageHorizontal";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import CartSidebar from "./components/cart/CartSidebar";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ProtectedRoute from "./components/security/ProtectedRoute";
import SecureLoginForm from "./components/security/SecureLoginForm";
import SecureAdminDashboard from "./components/admin/SecureAdminDashboard";
import AuditLogViewer from "./components/admin/AuditLogViewer";

// Lazy load components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CheckoutForm = lazy(() => import("./components/checkout/CheckoutForm").then(module => ({ default: module.CheckoutForm })));
const ShoppingGuide = lazy(() => import("./pages/ShoppingGuide"));
const CareInstructions = lazy(() => import("./pages/CareInstructions"));
const PaymentDelivery = lazy(() => import("./pages/PaymentDelivery"));
const Terms = lazy(() => import("./pages/Terms"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <ProductProvider>
            <CartProvider>
              <AuthProvider>
                <Router>
              <div className="min-h-screen bg-background">
                <Toaster position="top-center" />
                <Routes>
                  {/* Landing page with header but no footer */}
                  <Route path="/" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <LandingPage />
                    </div>
                  } />
                  
                  {/* Secure Admin routes */}
                  <Route path="/admin" element={<SecureLoginForm />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <SecureAdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/audit-logs" element={
                    <ProtectedRoute requiredRole="admin">
                      <AuditLogViewer />
                    </ProtectedRoute>
                  } />
                  
                  {/* Regular pages with header/footer */}
                  <Route 
                    path="/*" 
                    element={
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-grow container mx-auto px-4 py-8 pt-28">
                          <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                              <Route path="/home" element={<HomePage />} />
                              <Route path="/products" element={<CategoryPage />} />
                              <Route path="/category" element={<CategoryPage />} />
                              <Route
                                path="/category/:categoryId"
                                element={<CategoryPage />}
                              />
                              <Route path="/product/:id" element={<ProductPage />} />
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
                          </Suspense>
                        </main>
                        <Footer />
                        <CartSidebar />
                      </div>
                    } 
                  />
                </Routes>
              </div>
                </Router>
              </AuthProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
