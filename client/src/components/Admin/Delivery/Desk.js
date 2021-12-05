import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Box, Paper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  { id: 'clientName', label: 'Client Name' },
  { id: 'clientPhone', label: 'Client Phone' },
  { id: 'clientEmail', label: 'Client Email' },
  { id: 'clientAddress', label: 'Client Address' },
  { id: 'deliveryDate', label: 'Delivery Date' },
  { id: 'deliveryPDF', label: 'Note' },
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
      .get('/delivery/allDesk', props)
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
        title="Desk Delivery"
        rows={deliveries.map(
          ({
            id,
            clientUnit,
            clientFloor,
            clientBlock,
            clientStreet,
            clientDistrict,
            ...restProps
          }) => ({
            clientAddress: `${clientUnit}, ${clientFloor}, ${clientBlock}, ${clientStreet}, ${clientDistrict}`,
            deliveryPDF: (
              <Button
                variant="contained"
                sx={{ mt: '5px' }}
                component={RouterLink}
                target="_blank"
                to={`/deliveryPDF/desk/${id}`}
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
