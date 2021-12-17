import React, { useEffect, useState } from 'react';
import Detail from './Detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const location = useLocation();
  const { quotation } = location.state || {};
  const {
    ChairStocks,
    DeskStocks,
    AccessoryStocks,
    Seller,
    sellerId,
    ...client
  } = quotation || {};

  const [phone, setPhone] = useState(client.phone);

  return quotation ? (
    <Detail
      componentType="edit"
      initialClient={{
        ...client,
        phone,
        setPhone,
      }}
      initialCart={ChairStocks.map(({ ChairToQuotation, ...restProps }) => ({
        productType: 'chair',
        productDetail: restProps,
        productPrice: ChairToQuotation.unitPrice,
        productAmount: ChairToQuotation.qty,
        productDeliveryOption: ChairToQuotation.deliveryOption,
      }))
        .concat(
          DeskStocks.map(({ DeskToQuotation, ...restProps }) => {
            const {
              unitPrice,
              qty,
              deliveryOption,
              ...deskTopProps
            } = DeskToQuotation;
            return {
              productType: 'desk',
              productDetail: restProps,
              productPrice: unitPrice,
              productAmount: qty,
              productDeliveryOption: deliveryOption,
              ...deskTopProps,
            };
          })
        )
        .concat(
          AccessoryStocks.map(({ AccessoryToQuotation, ...restProps }) => ({
            productType: 'accessory',
            productDetail: restProps,
            productPrice: AccessoryToQuotation.unitPrice,
            productAmount: AccessoryToQuotation.qty,
            productDeliveryOption: AccessoryToQuotation.deliveryOption,
          }))
        )}
      {...props}
    />
  ) : (
    <Redirect to="/user/quotation" />
  );
};

export default Edit;
