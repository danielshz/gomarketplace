import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:cart',
      );

      if (storagedProducts) setProducts(JSON.parse(storagedProducts));
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const selectedProduct = products.find(product => product.id === id);
      const unselectedProducts = products.filter(product => product.id !== id);

      if (selectedProduct) {
        const newProducts = [
          ...unselectedProducts,
          { ...selectedProduct, quantity: selectedProduct.quantity + 1 },
        ];

        setProducts(newProducts);

        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const selectedProduct = products.find(product => product.id === id);
      const unselectedProducts = products.filter(product => product.id !== id);

      if (selectedProduct) {
        const newProducts = [
          ...unselectedProducts,
          { ...selectedProduct, quantity: selectedProduct.quantity - 1 },
        ];

        setProducts(newProducts);

        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      if (products.some(storagedProduct => storagedProduct.id === product.id)) {
        increment(product.id);
        return;
      }

      setProducts([...products, { ...product, quantity: 1 }]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify([...products, { ...product, quantity: 1 }]),
      );
    },
    [increment, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
