import React, { useEffect, useState } from 'react';
import Detail from './Detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const location = useLocation();
  const { order } = location.state || {};
  const {
    ChairStocks,
    DeskStocks,
    AccessoryStocks,
    Seller,
    sellerId,
    ...client
  } = order || {};

  const [phone, setPhone] = useState(client.phone);

  return order ? (
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
      }))
        .concat(
          DeskStocks.map(({ DeskToQuotation, ...restProps }) => ({
            productType: 'desk',
            productDetail: restProps,
            productPrice: DeskToQuotation.unitPrice,
            productAmount: DeskToQuotation.qty,
          }))
        )
        .concat(
          AccessoryStocks.map(({ AccessoryToQuotation, ...restProps }) => ({
            productType: 'accessory',
            productDetail: restProps,
            productPrice: AccessoryToQuotation.unitPrice,
            productAmount: AccessoryToQuotation.qty,
          }))
        )}
      {...props}
    />
  ) : (
    <Redirect to="/admin/order" />
  );
};

export default Edit;
