import { createContext, useContext, useEffect, useState } from "react";
import { initialProducts, categories } from "../data/initialProducts";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      return parsedProducts.length > 0 ? parsedProducts : initialProducts;
    }
    return initialProducts;
  });

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const value = {
    products,
    categories,
    addProduct: (product) => {
      setProducts((prev) => [...prev, { ...product, id: crypto.randomUUID() }]);
    },
    updateProduct: (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    },
    deleteProduct: (productId) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    resetProducts: () => {
      setProducts(initialProducts);
    },
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
