import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Step,
  Stepper,
  StepLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { blue, pink, purple, red, yellow } from '@mui/material/colors';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import MuiPhoneNumber from 'material-ui-phone-number';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: '0 10px 10px 10px' }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const chairColumns = [
  {
    id: 'thumbnail',
    sx: { width: 50 },
    nonSort: true,
  },
  {
    id: 'brand',
    label: 'Brand',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'frameColor',
    label: 'Frame Color',
  },
  {
    id: 'backColor',
    label: 'Back Color',
  },
  {
    id: 'seatColor',
    label: 'Seat Color',
  },
  {
    id: 'withHeadrest',
    label: 'Headrest',
  },
  {
    id: 'withAdArmrest',
    label: 'Adjustable Armrests',
  },
  {
    id: 'remark',
    label: 'Special Remark',
  },
  {
    id: 'balance',
    label: 'Balance',
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
    id: 'add',
  },
];

const deskColumns = [
  {
    id: 'thumbnail',
    sx: { width: 50 },
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
    id: 'topMaterial',
    label: 'topMaterial',
  },
  {
    id: 'topColor',
    label: 'topColor',
  },
  {
    id: 'topSize',
    label: 'topSize',
  },
  {
    id: 'balance',
    label: 'Balance',
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
    id: 'add',
  },
];

const accessoryColumns = [
  {
    id: 'thumbnail',
    sx: { width: 50 },
    nonSort: true,
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'color',
    label: 'Color',
  },
  {
    id: 'remark',
    label: 'Special Remark',
  },
  {
    id: 'balance',
    label: 'Balance',
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
    id: 'add',
  },
];

export default connect(mapStateToProps)((props) => {
  const { componentType, initialClient, initialCart } = props;

  const steps = [
    'Input Client Info',
    'Select Products',
    'Input Payment Detailss',
  ];
  const clientForm = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [productType, setProductType] = useState('chair');
  const [productDetail, setProductDetail] = useState('');
  const [productAmount, setProductAmount] = useState(0);
  const [cart, setCart] = useState(initialCart);

  const [paid, setPaid] = useState(initialClient.paid);

  const [chairStocks, setChairStocks] = useState([]);
  const [deskStocks, setDeskStocks] = useState([]);
  const [accessoryStocks, setAccessoryStocks] = useState([]);
  const [stocksIndex, setStocksIndex] = useState(0);

  const [chairFeatures, setChairFeatures] = useState([]);
  const [deskFeatures, setDeskFeatures] = useState([]);
  const [accessoryFeatures, setAccessoryFeatures] = useState([]);

  const [chairFilterBrand, setChairFilterBrand] = useState(null);
  const [chairFilterModel, setChairFilterModel] = useState(null);
  const [deskFilterModel, setDeskFilterModel] = useState(null);
  const [deskFilterColor, setDeskFilterColor] = useState(null);
  const [accessoryFilterColor, setAccessoryFilterColor] = useState(null);

  const getChairFeatures = (cancelToken) => {
    axios
      .get('/chairStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setChairFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeskFeatures = (cancelToken) => {
    axios
      .get('/deskStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setDeskFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getAccessoryFeatures = (cancelToken) => {
    axios
      .get('/accessoryStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setAccessoryFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getChairStocks = (cancelToken) => {
    axios
      .get('/chairStock', { cancelToken })
      .then((response) => {
        // handle success
        setChairStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeskStocks = (cancelToken) => {
    axios
      .get('/deskStock', { cancelToken })
      .then((response) => {
        // handle success
        setDeskStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getAccessoryStocks = (cancelToken) => {
    axios
      .get('/accessoryStock', { cancelToken })
      .then((response) => {
        // handle success
        setAccessoryStocks(response.data);
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
    getChairFeatures(source.token);
    getDeskFeatures(source.token);
    getAccessoryFeatures(source.token);
    getChairStocks(source.token);
    getDeskStocks(source.token);
    getAccessoryStocks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  const isStepFailed = (step) => {
    if (clientForm.current !== null && currentStep > 0 && step === 0)
      return !clientForm.current.checkValidity();
    else if (cart.length === 0 && currentStep > 1 && step === 1) return true;
    else return false;
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        padding: '20px 20px 10px 20px',
      }}
    >
      <Stepper activeStep={currentStep} sx={{ flexWrap: 'wrap' }}>
        {steps.map((label, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {['Invalid Input', 'Products cannot be empty'][index]}
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label} sx={{ my: '10px' }}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        sx={{ mx: 'auto', mt: '50px' }}
        ref={clientForm}
        hidden={currentStep !== 0}
        component="form"
        maxWidth="sm"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentStep(1);
        }}
      >
        <Paper
          sx={{
            p: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: '100%', minWidth: '100%' }}>
            Client Info
          </Typography>
          {[
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              defaultValue: initialClient.name,
              width: '100%',
              required: true,
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'text',
              value: initialClient.phone,
              onChange: initialClient.setPhone,
              width: '48%',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              defaultValue: initialClient.email,
              width: '48%',
              required: true,
            },
            {
              name: 'district',
              label: 'District',
              type: 'text',
              defaultValue: initialClient.district,
              width: '55%',
            },
            {
              name: 'street',
              label: 'Street',
              type: 'text',
              defaultValue: initialClient.street,
              width: '40%',
            },
            {
              name: 'block',
              label: 'Block',
              type: 'text',
              defaultValue: initialClient.block,
              width: '30%',
            },
            {
              name: 'floor',
              label: 'Floor',
              type: 'text',
              defaultValue: initialClient.floor,
              width: '30%',
            },
            {
              name: 'unit',
              label: 'Unit',
              type: 'text',
              defaultValue: initialClient.unit,
              width: '30%',
            },
            {
              name: 'remark',
              label: 'Remark',
              muliline: 'true',
              type: 'text',
              defaultValue: initialClient.remark,
              width: '100%',
            },
          ].map(({ setValue, width, ...restProps }, index) =>
            restProps.label === 'Phone' ? (
              <MuiPhoneNumber
                key={index}
                variant="outlined"
                defaultCountry={'hk'}
                sx={{ flexBasis: width, minWidth: width }}
                margin="dense"
                size="small"
                {...restProps}
              />
            ) : (
              <TextField
                key={index}
                margin="dense"
                size="small"
                sx={{ flexBasis: width, minWidth: width }}
                {...restProps}
              />
            )
          )}
          <TextField
            margin="dense"
            size="small"
            sx={{ flexBasis: ['100%', '30%'], minWidth: ['100%', '30%'] }}
            name="timeLine"
            label="TimeLine"
            type="number"
            inputProps={{ min: 0 }}
            defaultValue={initialClient.timeLine || 0}
          />
          <RadioGroup
            row
            name="timeLineFormat"
            defaultValue="day"
            sx={{
              flexBasis: ['100%', '70%'],
              minWidth: ['100%', '70%'],
              justifyContent: 'flex-end',
            }}
          >
            <FormControlLabel value="day" control={<Radio />} label="Days" />
            <FormControlLabel value="week" control={<Radio />} label="Weeks" />
          </RadioGroup>
        </Paper>
        <Button type="submit" sx={{ marginTop: '10px', float: 'right' }}>
          Next
        </Button>
      </Box>
      {currentStep === 1 && (
        <>
          {cart.length > 0 && (
            <Paper>
              <List sx={{ px: '10px' }}>
                {cart.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: yellow[600],
                      boxShadow: `0px 2px 1px -1px rgb(0 0 0 / 20%)`,
                      my: '10px',
                      flexWrap: 'wrap',
                    }}
                    secondaryAction={
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          setCart(
                            cart.filter(
                              (product, productIndex) => productIndex !== index
                            )
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    {item.productType === 'chair' && (
                      <ListItemText
                        primary={`Chair: ${item.productDetail.brand}, ${item.productDetail.model}, ${item.productDetail.frameColor}, ${item.productDetail.backColor}, ${item.productDetail.seatColor}`}
                        secondary={`${
                          item.productDetail.withHeadrest ? 'Headrest, ' : ''
                        }${item.productDetail.withAdArmrest ? 'Armrest' : ''}`}
                      />
                    )}
                    {item.productType === 'desk' && (
                      <ListItemText
                        primary={`Desk: ${item.productDetail.supplierCode}, ${item.productDetail.model}, ${item.productDetail.color}, ${item.productDetail.armSize}, ${item.productDetail.feetSize}, ${item.productDetail.beamSize}`}
                        secondary={`${item.productDetail.topMaterial}, ${item.productDetail.topColor}, ${item.productDetail.topSize}`}
                      />
                    )}
                    {item.productType === 'accessory' && (
                      <ListItemText
                        primary={`Accessory: ${item.productDetail.color}`}
                        secondary={`${item.productDetail.remark}`}
                      />
                    )}
                    <Box
                      flexBasis="100%"
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                    >
                      <Typography
                        variant="span"
                        color={pink[100]}
                        bgcolor={pink[500]}
                        sx={{
                          fontSize: ['6px, 8px'],
                          padding: '3px 10px',
                          margin: '3px 0',
                          flexShrink: 0,
                          marginRight: '10px',
                          borderRadius: '2px',
                        }}
                      >
                        {`${item.productPrice} HKD`}
                      </Typography>
                      <Typography
                        variant="span"
                        color={red[100]}
                        bgcolor={red[500]}
                        sx={{
                          fontSize: ['6px, 8px'],
                          padding: '3px 10px',
                          margin: '3px 0',
                          flexShrink: 0,
                          marginRight: '10px',
                          borderRadius: '2px',
                        }}
                      >
                        {`Amount: ${item.productAmount}`}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          <Paper sx={{ my: '10px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={stocksIndex}
                onChange={(event, value) => {
                  event.preventDefault();
                  setStocksIndex(value);
                }}
                aria-label="basic tabs example"
              >
                <Tab label="Chairs" />
                <Tab label="Desks" />
                <Tab label="Accessories" />
              </Tabs>
            </Box>
            <TabPanel value={stocksIndex} index={0}>
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
                    label: 'Brand',
                    value: chairFilterBrand,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setChairFilterBrand(value);
                      setChairFilterModel(null);
                    },
                    options: chairFeatures
                      .map((item) => item.brand)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                  {
                    label: 'Model',
                    value: chairFilterModel,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setChairFilterModel(value);
                    },
                    options: chairFeatures
                      .filter(
                        (item) =>
                          !chairFilterBrand || item.brand === chairFilterBrand
                      )
                      .map((item) => item.model)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                ].map(({ label, ...props }, index) => (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: '200px', maxWidth: '200px' }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        label={label}
                        size="small"
                      />
                    )}
                    {...props}
                  />
                ))}
              </Paper>
              <DataGrid
                nonSelect={true}
                title="Chair Stocks"
                rows={chairStocks
                  .filter(
                    (item) =>
                      (!chairFilterBrand || item.brand === chairFilterBrand) &&
                      (!chairFilterModel || item.model === chairFilterModel)
                  )
                  .map(
                    (
                      {
                        thumbnailUrl,
                        withHeadrest,
                        withAdArmrest,
                        shipmentDate,
                        arrivalDate,
                        ...restProps
                      },
                      index
                    ) => ({
                      thumbnail: (
                        <img
                          alt=""
                          width="40px"
                          src={thumbnailUrl}
                          style={{ marginTop: '5px' }}
                        />
                      ),
                      withHeadrest: withHeadrest ? 'Yes' : 'No',
                      withAdArmrest: withAdArmrest ? 'Yes' : 'No',
                      add: (
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            setProductType('chair');
                            setProductDetail(chairStocks[index]);
                            setProductAmount(1);
                            if (
                              cart.find(
                                (item) =>
                                  item.productType === 'chair' &&
                                  item.productDetail.id ===
                                    chairStocks[index].id
                              )
                            ) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Warning',
                                text: 'This product is already added.',
                                allowOutsideClick: false,
                              });
                              return;
                            }
                            setAddOpen(true);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                      shipmentDate: (() => {
                        if (shipmentDate === null) return 'No';
                        const createdTime = new Date(shipmentDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      arrivalDate: (() => {
                        if (arrivalDate === null) return 'No';
                        const createdTime = new Date(arrivalDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      ...restProps,
                    })
                  )}
                columns={chairColumns}
              />
            </TabPanel>
            <TabPanel value={stocksIndex} index={1}>
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
                    label: 'Model',
                    value: deskFilterModel,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setDeskFilterModel(value);
                      setDeskFilterColor(null);
                    },
                    options: deskFeatures
                      .map((item) => item.model)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                  {
                    label: 'Color',
                    value: deskFilterColor,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setDeskFilterColor(value);
                    },
                    options: deskFeatures
                      .filter(
                        (item) =>
                          !deskFilterModel || item.model === deskFilterModel
                      )
                      .map((item) => item.color)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                ].map(({ label, ...props }, index) => (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: '200px', maxWidth: '200px' }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        label={label}
                        size="small"
                      />
                    )}
                    {...props}
                  />
                ))}
              </Paper>
              <DataGrid
                nonSelect={true}
                title="Desk Stocks"
                rows={deskStocks
                  .filter(
                    (item) =>
                      (!deskFilterModel || item.model === deskFilterModel) &&
                      (!deskFilterColor || item.color === deskFilterColor)
                  )
                  .map(
                    (
                      { thumbnailUrl, shipmentDate, arrivalDate, ...restProps },
                      index
                    ) => ({
                      thumbnail: (
                        <img
                          alt=""
                          width="40px"
                          src={thumbnailUrl}
                          style={{ marginTop: '5px' }}
                        />
                      ),
                      add: (
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            setProductType('desk');
                            setProductDetail(deskStocks[index]);
                            setProductAmount(1);
                            if (
                              cart.find(
                                (item) =>
                                  item.productType === 'desk' &&
                                  item.productDetail.id === deskStocks[index].id
                              )
                            ) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Warning',
                                text: 'This product is already added.',
                                allowOutsideClick: false,
                              });
                              return;
                            }
                            setAddOpen(true);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                      shipmentDate: (() => {
                        if (shipmentDate === null) return 'No';
                        const createdTime = new Date(shipmentDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      arrivalDate: (() => {
                        if (arrivalDate === null) return 'No';
                        const createdTime = new Date(arrivalDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      ...restProps,
                    })
                  )}
                columns={deskColumns}
              />
            </TabPanel>
            <TabPanel value={stocksIndex} index={2}>
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
                    label: 'Color',
                    value: accessoryFilterColor,
                    onChange: (event, value) => {
                      event.preventDefault();
                      setAccessoryFilterColor(value);
                    },
                    options: accessoryFeatures
                      .map((item) => item.color)
                      .filter((c, index, chars) => chars.indexOf(c) === index),
                  },
                ].map(({ label, ...props }, index) => (
                  <Autocomplete
                    key={index}
                    sx={{ flexBasis: '200px', maxWidth: '200px' }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        label={label}
                        size="small"
                      />
                    )}
                    {...props}
                  />
                ))}
              </Paper>
              <DataGrid
                nonSelect={true}
                title="Accessory Stocks"
                rows={accessoryStocks
                  .filter(
                    (item) =>
                      !accessoryFilterColor ||
                      item.color === accessoryFilterColor
                  )
                  .map(
                    (
                      { thumbnailUrl, shipmentDate, arrivalDate, ...restProps },
                      index
                    ) => ({
                      thumbnail: (
                        <img
                          alt=""
                          width="40px"
                          src={thumbnailUrl}
                          style={{ marginTop: '5px' }}
                        />
                      ),
                      add: (
                        <IconButton
                          onClick={(event) => {
                            event.preventDefault();
                            setProductType('accessory');
                            setProductDetail(accessoryStocks[index]);
                            setProductAmount(1);
                            if (
                              cart.find(
                                (item) =>
                                  item.productType === 'accessory' &&
                                  item.productDetail.id ===
                                    accessoryStocks[index].id
                              )
                            ) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Warning',
                                text: 'This product is already added.',
                                allowOutsideClick: false,
                              });
                              return;
                            }
                            setAddOpen(true);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                      shipmentDate: (() => {
                        if (shipmentDate === null) return 'No';
                        const createdTime = new Date(shipmentDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      arrivalDate: (() => {
                        if (arrivalDate === null) return 'No';
                        const createdTime = new Date(arrivalDate);
                        createdTime.setMinutes(
                          createdTime.getMinutes() -
                            createdTime.getTimezoneOffset()
                        );
                        return createdTime.toISOString().split('T')[0];
                      })(),
                      ...restProps,
                    })
                  )}
                columns={accessoryColumns}
              />
            </TabPanel>
          </Paper>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep(0);
            }}
          >
            Previous
          </Button>
          <Button
            sx={{ float: 'right' }}
            onClick={(e) => {
              e.preventDefault();
              if (cart.length === 0) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'Products list cannot be empty',
                  allowOutsideClick: false,
                });
                return;
              }
              setCurrentStep(2);
            }}
          >
            Next
          </Button>
        </>
      )}
      <Box
        sx={{ mx: 'auto', mt: '50px' }}
        hidden={currentStep !== 2}
        component="form"
        maxWidth="sm"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          const clientData = new FormData(clientForm.current);
          const paymentData = new FormData(e.currentTarget);
          console.log(paymentData.get('paid'));
          console.log(Boolean(paymentData.get('paid')));
          if (componentType === 'create')
            axios
              .post(`/salesOrder/create`, {
                name: clientData.get('name'),
                phone: clientData.get('phone'),
                email: clientData.get('email'),
                district: clientData.get('district'),
                street: clientData.get('street'),
                block: clientData.get('block'),
                floor: clientData.get('floor'),
                unit: clientData.get('unit'),
                timeLine:
                  Math.max(clientData.get('timeLine'), 0) *
                  (clientData.get('timeLineFormat') === 'day' ? 1 : 7),
                remark: clientData.get('remark'),
                products: cart.map(({ productDetail, ...restProps }) => ({
                  productId: productDetail.id,
                  ...restProps,
                })),
                paymentTerms: paymentData.get('paymentTerms'),
                paid: Boolean(paymentData.get('paid')),
                dueDate: paymentData.get('dueDate'),
              })
              .then(() => {
                // handle success
                props.history.push('/admin/order');
              })
              .catch(function (error) {
                // handle error
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.response.data.message,
                  allowOutsideClick: false,
                }).then(() => {});
                console.log(error);
              })
              .then(function () {
                // always executed
              });
          else {
            axios
              .put(`/salesOrder/${initialClient.id}`, {
                name: clientData.get('name'),
                phone: clientData.get('phone'),
                email: clientData.get('email'),
                district: clientData.get('district'),
                street: clientData.get('street'),
                block: clientData.get('block'),
                floor: clientData.get('floor'),
                unit: clientData.get('unit'),
                timeLine:
                  clientData.get('timeLine') *
                  (clientData.get('timeLineFormat') === 'day' ? 1 : 7),
                remark: clientData.get('remark'),
                products: cart.map(({ productDetail, ...restProps }) => ({
                  productId: productDetail.id,
                  ...restProps,
                })),
                paymentTerms: paymentData.get('paymentTerms'),
                paid: Boolean(paymentData.get('paid')),
                dueDate: paymentData.get('dueDate'),
              })
              .then((response) => {
                // handle success
                props.history.push('/admin/order');
              })
              .catch(function (error) {
                // handle error
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.response.data.message,
                  allowOutsideClick: false,
                }).then(() => {});
                console.log(error);
              })
              .then(function () {
                // always executed
              });
          }
        }}
      >
        <Paper
          sx={{
            p: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: '100%', minWidth: '100%' }}>
            Payment Details
          </Typography>
          <TextField
            name="paymentTerms"
            margin="dense"
            size="small"
            sx={{ flexBasis: '100%', minWidth: '100%' }}
            label="Payment Terms"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="paid"
                defaultChecked={initialClient.paid}
                onChange={(e) => {
                  setPaid(e.target.checked);
                }}
              />
            }
            label="Paid"
          />
          <TextField
            margin="dense"
            size="small"
            type="date"
            disabled={paid}
            name="dueDate"
            label="Due Date"
            defaultValue={initialClient.dueDate}
            InputLabelProps={{ shrink: true }}
          />
        </Paper>
        <Button
          sx={{ marginTop: '10px' }}
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep(1);
          }}
        >
          Previous
        </Button>
        <Button sx={{ float: 'right', marginTop: '10px' }} type="submit">
          Finish
        </Button>
      </Box>
      <Dialog
        open={addOpen}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (e) => {
            e.preventDefault();
            setAddOpen(false);
            if (
              cart.find(
                (item) =>
                  item.productType === 'chair' &&
                  item.productDetail.id === productDetail.id
              )
            ) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'This product is already added.',
                allowOutsideClick: false,
              });
              return;
            }
            setCart(
              cart.concat({
                productType,
                productDetail,
                productAmount,
                productPrice: Math.max(e.currentTarget.unitPrice.value, 0),
              })
            );
          },
        }}
      >
        <DialogTitle>Price and Amount</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <FormControlLabel
            sx={{
              width: '200px',
              alignItems: 'baseline',
              m: 0,
            }}
            control={
              <TextField
                label="Unit Price"
                margin="dense"
                type="number"
                name="unitPrice"
                defaultValue={1000}
                fullWidth
                sx={{ m: '10px 5px 0 0' }}
              />
            }
            label="HKD"
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '200px',
              border: '1px solid #0000003b',
              borderRadius: '4px',
              mt: '10px',
              mx: 'auto',
              p: '5px 3px',
            }}
          >
            <Typography variant="span" sx={{ flexGrow: 1 }}>
              Amount
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.max(productAmount - 1, 1));
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="span" mx="10px">
              {productAmount}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                setProductAmount(Math.min(productAmount + 1, 9));
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              setAddOpen(false);
            }}
          >
            Cancle
          </Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
