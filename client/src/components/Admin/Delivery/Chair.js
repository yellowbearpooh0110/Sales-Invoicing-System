import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Box, Paper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  { id: 'deliveryDate', label: 'Delivery Date', sx: { paddingLeft: '10px' } },
  { id: 'invoiceNum', label: 'Inovice #' },
  { id: 'address', label: 'Address' },
  { id: 'name', label: 'Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'brand', label: 'Brand' },
  { id: 'model', label: 'Model' },
  { id: 'frameColor', label: 'FColor' },
  { id: 'backColor', label: 'BColor' },
  { id: 'seatColor', label: 'SColor' },
  { id: 'withHeadrest', label: 'Headrest' },
  { id: 'withAdArmrest', label: 'Armrest' },
  { id: 'remark', label: 'Remark' },
  { id: 'deliveryPDF', label: 'Note', sx: { paddingRight: '10px' } },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [deliveries, setDeliveries] = useState([]);

  const getDeliveries = (props) => {
    axios
      .get('/delivery/allChair', props)
      .then((response) => {
        // handle success
        setDeliveries(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDeliveries({
      cancelToken: source.token,
      // params: {
      //   fromDate: (() => {
      //     const now = new Date();
      //     now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //     now.setDate(now.getDate() - 10);
      //     return now.toISOString().split('T')[0];
      //   })(),
      //   toDate: (() => {
      //     const now = new Date();
      //     now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //     return now.toISOString().split('T')[0];
      //   })(),
      // },
    });
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        padding: '10px 20px',
      }}
    >
      {/* <Paper
        component="form"
        sx={{
          marginTop: '10px',
          padding: '5px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          getDeliveries({
            params: {
              fromDate: data.get('fromDate'),
              toDate: data.get('toDate'),
            },
          });
        }}
      >
        {[
          {
            width: ['100%', '43%'],
            type: 'date',
            name: 'fromDate',
            label: 'From Date',
            defaultValue: (() => {
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              now.setDate(now.getDate() - 10);
              return now.toISOString().split('T')[0];
            })(),
            InputLabelProps: { shrink: true },
          },
          {
            width: ['100%', '43%'],
            type: 'date',
            name: 'toDate',
            label: 'To Date',
            defaultValue: (() => {
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              return now.toISOString().split('T')[0];
            })(),
            InputLabelProps: { shrink: true },
          },
        ].map(({ width, ...restParams }, index) => (
          <TextField
            key={index}
            sx={{ flexBasis: width, minWidth: width }}
            {...restParams}
          />
        ))}
        <Button
          type="submit"
          sx={{ flexBasis: ['100%', '10%'], minWidth: ['100%', '10%'] }}
        >
          OK
        </Button>
      </Paper> */}
      <DataGrid
        nonSelect={true}
        title="Chair Delivery"
        rows={deliveries.map(
          ({ id, SalesOrder, ChairStock, ...restProps }) => ({
            invoiceNum: `I-${SalesOrder.Seller.prefix}${new Date(
              SalesOrder.createdAt
            ).getFullYear()}-${('000' + SalesOrder.invoiceNum).substr(-3)}`,
            address: `${SalesOrder.unit}, ${SalesOrder.floor}, ${SalesOrder.block}, ${SalesOrder.street}, ${SalesOrder.district}`,
            name: SalesOrder.name,
            phone: SalesOrder.phone,
            email: SalesOrder.email,
            brand: ChairStock.brand,
            model: ChairStock.model,
            frameColor: ChairStock.frameColor,
            backColor: ChairStock.backColor,
            seatColor: ChairStock.seatColor,
            withHeadrest: ChairStock.withHeadrest ? 'Yes' : 'No',
            withAdArmrest: ChairStock.withAdArmrest ? 'Yes' : 'No',
            remark: ChairStock.reamrk,
            deliveryPDF: (
              <Button
                variant="contained"
                sx={{ my: '5px', width: 100, fontSize: 10 }}
                component={RouterLink}
                target="_blank"
                to={`/deliveryPDF/chair/${id}`}
              >
                Delivery Note
              </Button>
            ),
            ...restProps,
          })
        )}
        columns={columns}
      />
    </Box>
  );
});
