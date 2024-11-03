import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ProductProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category" element={<CategoryPage />} />
                  <Route
                    path="/category/:categoryId"
                    element={<CategoryPage />}
                  />
                  <Route path="/product/:productId" element={<ProductPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ProductProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
