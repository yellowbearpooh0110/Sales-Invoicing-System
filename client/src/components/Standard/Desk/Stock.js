import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Autocomplete, Box, Paper, TextField } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'thumbnail',
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: 'supplierCode',
    label: 'Supplier',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'color',
    label: 'Color',
  },
  {
    id: 'armSize',
    label: 'Arm Size',
  },
  {
    id: 'feetSize',
    label: 'Feet Size',
  },
  {
    id: 'beamSize',
    label: 'Beam Size',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
  {
    id: 'remark',
    label: 'Special Remark',
  },
  {
    id: 'unitPrice',
    label: 'Price',
  },
  {
    id: 'qty',
    label: 'QTY',
  },
  {
    id: 'shipmentDate',
    label: 'Shipment',
  },
  {
    id: 'arrivalDate',
    label: 'Arrival',
  },
  {
    id: 'edit',
    nonSort: true,
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const [stocks, setStocks] = useState([]);
  const [features, setFeatures] = useState([]);

  const [filterSupplier, setFilterSupplier] = useState(null);
  const [filterModel, setFilterModel] = useState(null);
  const [filterColor, setFilterColor] = useState(null);

  const getFeatures = (cancelToken) => {
    axios
      .get('/deskStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getStocks = (cancelToken) => {
    axios
      .get('/deskStock', { cancelToken })
      .then((response) => {
        // handle success
        setStocks(response.data);
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
    getFeatures(source.token);
    getStocks(source.token);
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
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {[
          {
            label: 'Supplier',
            value: filterSupplier,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterSupplier(value);
              setFilterModel(null);
              setFilterColor(null);
            },
            options: features
              .map((item) => item.supplierCode)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
          {
            label: 'Model',
            value: filterModel,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterModel(value);
              setFilterColor(null);
            },
            options: features
              .filter(
                (item) =>
                  !filterSupplier || item.supplierCode === filterSupplier
              )
              .map((item) => item.model)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
          {
            label: 'Color',
            value: filterColor,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterColor(value);
            },
            options: features
              .filter(
                (item) =>
                  (!filterSupplier || item.supplierCode === filterSupplier) &&
                  (!filterModel || item.model === filterModel)
              )
              .map((item) => item.color)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
        ].map(({ label, ...props }, index) => (
          <Autocomplete
            key={index}
            sx={{ flexBasis: '200px', maxWidth: '200px' }}
            renderInput={(params) => <TextField {...params} label={label} />}
            {...props}
          />
        ))}
      </Paper>
      <DataGrid
        nonSelect={true}
        title="Desk Leg Stocks"
        rows={stocks
          .map(
            (
              {
                withHeadrest,
                withAdArmrest,
                thumbnailURL,
                shipmentDate,
                arrivalDate,
                ...restProps
              },
              index
            ) => ({
              thumbnail: (
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    Swal.fire({
                      html: `<img alt="" width="400px" src="${thumbnailURL}" />`,
                      showCloseButton: true,
                      showConfirmButton: false,
                      allowOutsideClick: false,
                    });
                  }}
                >
                  <img
                    alt=""
                    width="80px"
                    src={thumbnailURL}
                    style={{ marginTop: '5px' }}
                  />
                </a>
              ),
              withHeadrest: withHeadrest ? 'Yes' : 'No',
              withAdArmrest: withAdArmrest ? 'Yes' : 'No',
              shipmentDate: (() => {
                if (shipmentDate === null) return 'No';
                const createdTime = new Date(shipmentDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              arrivalDate: (() => {
                if (arrivalDate === null) return 'No';
                const createdTime = new Date(arrivalDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              ...restProps,
            })
          )
          .filter(
            (item) =>
              (!filterSupplier || item.supplierCode === filterSupplier) &&
              (!filterModel || item.model === filterModel) &&
              (!filterColor || item.color === filterColor)
          )}
        columns={columns}
      />
    </Box>
  );
});

export default Stock;
