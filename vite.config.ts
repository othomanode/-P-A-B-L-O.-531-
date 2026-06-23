import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as initialProducts } from '../data';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetToDefault: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage or use initialProducts
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('samuel_luxury_products_v2');
      const savedDeleted = localStorage.getItem('samuel_deleted_product_ids_v2');
      const deletedIds = savedDeleted ? JSON.parse(savedDeleted) as string[] : [];
      const deletedSet = new Set(deletedIds);

      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as Product[];
        const parsedIds = new Set(parsed.map(p => p.id));
        const missingFromInitial = initialProducts.filter(p => !parsedIds.has(p.id) && !deletedSet.has(p.id));
        
        if (missingFromInitial.length > 0) {
          const merged = [...parsed, ...missingFromInitial];
          setProducts(merged);
          localStorage.setItem('samuel_luxury_products_v2', JSON.stringify(merged));
        } else {
          setProducts(parsed);
        }
      } else {
        const filteredInitial = initialProducts.filter(p => !deletedSet.has(p.id));
        setProducts(filteredInitial);
      }
    } catch (e) {
      console.error('Failed to load products from local storage', e);
      setProducts(initialProducts);
    }
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [product, ...prev];
      localStorage.setItem('samuel_luxury_products_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, ...updatedFields };
        }
        return p;
      });
      localStorage.setItem('samuel_luxury_products_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem('samuel_luxury_products_v2', JSON.stringify(updated));
      
      // Save deleted ID to persistent list so it doesn't get restored during initial load check
      try {
        const savedDeleted = localStorage.getItem('samuel_deleted_product_ids_v2');
        const deletedIds = savedDeleted ? JSON.parse(savedDeleted) as string[] : [];
        if (!deletedIds.includes(productId)) {
          deletedIds.push(productId);
          localStorage.setItem('samuel_deleted_product_ids_v2', JSON.stringify(deletedIds));
        }
      } catch (e) {
        console.error(e);
      }

      return updated;
    });
  };

  const resetToDefault = () => {
    setProducts(initialProducts);
    localStorage.removeItem('samuel_luxury_products_v2');
    localStorage.removeItem('samuel_deleted_product_ids_v2');
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefault
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
