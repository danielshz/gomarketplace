import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const valuesPerItemType = products.map(
      product => product.quantity * product.price,
    );

    if (valuesPerItemType.length !== 0) {
      const total = valuesPerItemType.reduce(
        (accumulator, current) => accumulator + current,
      );

      return formatValue(total);
    }

    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const quantitiesPerItemType = products.map(product => product.quantity);

    if (quantitiesPerItemType.length !== 0) {
      const totalQuantity = quantitiesPerItemType.reduce(
        (accumulator, current) => accumulator + current,
      );

      return totalQuantity;
    }

    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>
          {`${totalItensInCart} ${totalItensInCart !== 1 ? 'itens' : 'item'}`}
        </CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
