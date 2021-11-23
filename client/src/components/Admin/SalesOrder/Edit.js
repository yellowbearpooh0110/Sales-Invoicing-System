import React, { useEffect, useState } from 'react';
import Detail from './Detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const location = useLocation();
  const { order } = location.state || {};
  const { ChairStocks, DeskStocks, seller, sellerId, ...client } = order || {};
  const [phone, setPhone] = useState(client.phone);
  useEffect(() => {
    console.log(order);
  }, [order]);
  return order ? (
    <>
      <Detail
        componentType="edit"
        initialClient={{
          ...client,
          phone,
          setPhone,
          deliveryDate: (() => {
            const createdTime = new Date(client.deliveryDate);
            createdTime.setMinutes(
              createdTime.getMinutes() - createdTime.getTimezoneOffset()
            );
            return createdTime.toISOString().split('T')[0];
          })(),
        }}
        initialCart={ChairStocks.map(({ ChairToOrder, ...restProps }) => ({
          productType: 'chair',
          productDetail: restProps,
          productAmount: ChairToOrder.qty,
        })).concat(
          DeskStocks.map(({ DeskToOrder, ...restProps }) => ({
            productType: 'desk',
            productDetail: restProps,
            productAmount: DeskToOrder.qty,
          }))
        )}
        {...props}
      />
    </>
  ) : (
    <Redirect to="/admin/order" />
  );
};

export default Edit;
