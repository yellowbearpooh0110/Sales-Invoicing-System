import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Document,
  Image,
  Font,
  Page,
  PDFViewer,
  Text,
  StyleSheet,
  View,
  Tspan,
} from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

import microsoft_yahei from 'fonts/chinese.msyh.ttf';
import logoTitle from 'images/logo_title.png';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    fontFamily: 'Microsoft Yahei',
    width: '100%',
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Microsoft Yahei',
    fontSize: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  logo: {
    marginLeft: 'auto',
    width: 50,
  },
  info: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  companyInfo: {
    fontFamily: 'Microsoft Yahei',
    fontSize: 8,
    width: 200,
    paddingRight: 10,
    lineHeight: 1.2,
  },
  clientInfo: {
    fontFamily: 'Microsoft Yahei',
    fontSize: 8,
    width: 200,
    paddingRight: 10,
    lineHeight: 1.2,
  },
  email: {
    color: '#0000ff',
    textDecoration: 'underline',
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontWeight: 100,
    fontFamily: 'Microsoft Yahei',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
  table: {
    fontSize: 8,
    marginBottom: 10,
    border: '0.5px solid #808080',
  },
  tableRow: {
    fontSize: 8,
    borderBottom: '0.5px solid #808080',
    flexDirection: 'row',
    minHeight: 15,
  },
  tableColumn: {
    flex: 1,
    padding: '3px 5px',
    borderRight: '0.5px solid #808080',
  },
});

Font.register({
  family: 'Microsoft Yahei',
  src: microsoft_yahei,
});

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const mapStateToProps = (state) => {
  const loading = state.loading.value;
  return { loading };
};

export default connect(mapStateToProps)((props) => {
  const { loading } = props;
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState({
    Seller: {},
    ChairStocks: [],
    DeskStocks: [],
    AccessoryStocks: [],
  });
  const { id } = useParams();
  useEffect(() => {
    const source = axios.CancelToken.source();
    getOrder({ id, cancelToken: source.token });
    return () => source.cancel('Brand Component got unmounted');
  }, [id]);

  const getDateString = (time) => {
    const tmp = new Date(time);
    return `${
      monthNames[tmp.getMonth()]
    } ${tmp.getDate()}, ${tmp.getFullYear()}`;
  };

  const getOrder = ({ id, cancelToken }) => {
    axios
      .get(`/salesOrder/${id}`, { cancelToken })
      .then((response) => {
        // handle success
        setSuccess(true);
        setOrder(response.data);
      })
      .catch(function (error) {
        // handle error
        setSuccess(false);
      });
  };

  return loading ? (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : success ? (
    <PDFViewer height="100%">
      <Document>
        <Page style={styles.body} wrap>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Invoice</Text>
              <Text>Date: {getDateString(order.createdAt)}</Text>
              <Text>
                {`No: I-${order.Seller.prefix}${new Date(
                  order.createdAt
                ).getFullYear()}-${('000' + order.invoiceNum).substr(-3)}`}
              </Text>
            </View>
            <View style={styles.logo}>
              <Image src={logoTitle} />
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.companyInfo}>
              <Text>Blueocean Int’l (HK) Ltd</Text>
              <Text>19/F</Text>
              <Text>Bel Trade Commercial Building</Text>
              <Text>3 Burrows Street</Text>
              <Text>Wanchai, Hong Kong</Text>
              <Text>Tel: 2169 3337</Text>
              <Text>
                Email: <Tspan style={styles.email}>info@ergoseatings.com</Tspan>
              </Text>
            </View>
            <View style={styles.clientInfo}>
              <Text>Client's Name: {order.name}</Text>
              {order.unit ? <Text>Unit {order.unit}</Text> : null}
              {order.floor ? <Text>Floor {order.floor}</Text> : null}
              {order.block ? <Text>Block {order.block}</Text> : null}
              <Text>{order.street}</Text>
              <Text>{order.district}</Text>
              <Text>Phone: {order.phone}</Text>
              <Text>
                Email: <Tspan style={styles.email}>{order.email}</Tspan>
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            {[
              {
                cells: [
                  { content: 'Salesperson', width: '15%' },
                  { content: 'Estimated Delivery Date', width: '55%' },
                  { content: 'Payment Terms', width: '15%' },
                  { content: 'Due Date', textAlign: 'right', width: '15%' },
                ],
                backgroundColor: '#dbe5f1',
                textTransform: 'uppercase',
              },
              {
                cells: [
                  {
                    content: `${order.Seller.firstName} ${order.Seller.lastName}`,
                    width: '15%',
                  },
                  {
                    content:
                      order.timeLine % 7 === 0
                        ? `Est ${order.timeLine / 7} working week${
                            order.timeLine / 7 === 1 ? '' : 's'
                          } after payment`
                        : `Est ${order.timeLine} working day${
                            order.timeLine === 1 ? '' : 's'
                          } after payment`,
                    width: '55%',
                  },
                  { content: order.paymentTerms, width: '15%' },
                  {
                    content: order.paid ? 'Paid' : order.dueDate,
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
              },
            ].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    borderBottom:
                      rowIndex === rowArr.length - 1 ? 'none' : null,
                    ...rowRestProps,
                  },
                ]}
              >
                {cells.map(
                  ({ content, width, ...cellRestProps }, index, cellArr) => (
                    <Text
                      key={index}
                      style={[
                        styles.tableColumn,
                        {
                          borderRight:
                            index === cellArr.length - 1 ? 'none' : null,
                          flexBasis: width,
                          maxWidth: width,
                          ...cellRestProps,
                        },
                      ]}
                    >
                      {content}
                    </Text>
                  )
                )}
              </View>
            ))}
          </View>
          <View style={styles.table}>
            {[
              {
                cells: [
                  { content: 'QTY', width: '15%' },
                  { content: 'Description', width: '55%' },
                  { content: 'Unit Price', width: '15%' },
                  {
                    content: 'Line Total (HKD)',
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
                backgroundColor: '#dbe5f1',
                textTransform: 'uppercase',
              },
              ...order.ChairStocks.map((item) => ({
                cells: [
                  {
                    content: `${item.ChairToOrder.qty}`,
                    width: '15%',
                  },
                  {
                    content: `Chair Brand: ${item.brand}\nChair Model: ${
                      item.model
                    }\n${
                      item.withHeadrest ? 'With Headrest' : 'Without Headrest'
                    }\n${
                      item.withAdArmrest
                        ? 'With Adjustable Armrest'
                        : 'Without Adjustable Armrest'
                    }\nFrameColor: ${item.frameColor}\nBack Color: ${
                      item.backColor
                    }\nSeat Color: ${item.seatColor}\nRemark: ${
                      item.remark
                    }\nWith delivery and installation included`,
                    width: '55%',
                  },
                  {
                    content: `${item.ChairToOrder.unitPrice}`,
                    textAlign: 'right',
                    width: '15%',
                  },
                  {
                    content: `${
                      item.ChairToOrder.unitPrice * item.ChairToOrder.qty
                    }`,
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
              })),
              ...order.DeskStocks.map((item) => ({
                cells: [
                  {
                    content: `${item.DeskToOrder.qty}`,
                    width: '15%',
                  },
                  {
                    content: `Desk Model: ${item.model}\nColor of Legs: ${
                      item.color
                    }\nArmSize: ${item.armSize}\nFeetSize: ${
                      item.feetSize
                    }\nBeam Size: ${item.beamSize}\n${
                      item.DeskToOrder.hasDeskTop
                        ? `Table Top: ${item.DeskToOrder.topMaterial} ${item.DeskToOrder.topColor}\nTable Top Size: ${item.DeskToOrder.topLength}x${item.DeskToOrder.topWidth}x${item.DeskToOrder.topThickness}\nTable Top Color:\nRounded Corners: ${item.DeskToOrder.topRoundedCorners}, Radius: R${item.DeskToOrder.topCornerRadius}\nHoles Required: ${item.DeskToOrder.topHoleCount}, Holes Shaped: ${item.DeskToOrder.topHoleType}`
                        : 'Without DeskTop'
                    }\nWith delivery and installation included`,
                    width: '55%',
                  },
                  {
                    content: `${item.DeskToOrder.unitPrice}`,
                    textAlign: 'right',
                    width: '15%',
                  },
                  {
                    content: `${
                      item.DeskToOrder.unitPrice * item.DeskToOrder.qty
                    }`,
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
              })),
              ...order.AccessoryStocks.map((item) => ({
                cells: [
                  {
                    content: `${item.AccessoryToOrder.qty}`,
                    width: '15%',
                  },
                  {
                    content: `Accessory Name: ${item.name}\nAccessory Color: ${item.color}\nRemark: ${item.remark}\nWith delivery and installation included`,
                    width: '55%',
                  },
                  {
                    content: `${item.AccessoryToOrder.unitPrice}`,
                    textAlign: 'right',
                    width: '15%',
                  },
                  {
                    content: `${
                      item.AccessoryToOrder.unitPrice *
                      item.AccessoryToOrder.qty
                    }`,
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
              })),
              ...Array(
                Math.max(
                  0,
                  6 -
                    order.ChairStocks.length -
                    order.DeskStocks.length -
                    order.AccessoryStocks.length
                )
              ).fill({
                cells: [
                  { content: '', width: '15%' },
                  { content: '', width: '55%' },
                  { content: '', width: '15%' },
                  { content: '', width: '15%' },
                ],
              }),
              {
                cells: [
                  {
                    content: ``,
                    width: '70%',
                    fontSize: 12,
                  },
                  { content: 'SUBTOTAL', width: '15%' },
                  {
                    content: `${
                      (order.ChairStocks.length
                        ? order.ChairStocks.map(
                            (item) =>
                              item.ChairToOrder.unitPrice *
                              item.ChairToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (order.DeskStocks.length
                        ? order.DeskStocks.map(
                            (item) =>
                              item.DeskToOrder.unitPrice * item.DeskToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (order.AccessoryStocks.length
                        ? order.AccessoryStocks.map(
                            (item) =>
                              item.AccessoryToOrder.unitPrice *
                              item.AccessoryToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0)
                    }`,
                    textAlign: 'right',
                    width: '15%',
                    borderBottom: '0.5px solid #808080',
                  },
                ],
                borderBottom: 'none',
              },
              {
                cells: [
                  {
                    content: ``,
                    width: '70%',
                    fontSize: 12,
                  },
                  { content: 'DISCOUNT', width: '15%' },
                  {
                    content: `${
                      order.discountType
                        ? order.discount
                        : (((order.ChairStocks.length
                            ? order.ChairStocks.map(
                                (item) =>
                                  item.ChairToOrder.unitPrice *
                                  item.ChairToOrder.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (order.DeskStocks.length
                              ? order.DeskStocks.map(
                                  (item) =>
                                    item.DeskToOrder.unitPrice *
                                    item.DeskToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (order.AccessoryStocks.length
                              ? order.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToOrder.unitPrice *
                                    item.AccessoryToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            order.discount) /
                          100
                    }`,
                    textAlign: 'right',
                    width: '15%',
                    borderBottom: '0.5px solid #808080',
                  },
                ],
                borderBottom: 'none',
              },
              {
                cells: [
                  {
                    content: ``,
                    width: '70%',
                    fontSize: 12,
                  },
                  { content: 'SURCHARGE', width: '15%' },
                  {
                    content: `${
                      order.surchargeType
                        ? order.surcharge
                        : (((order.ChairStocks.length
                            ? order.ChairStocks.map(
                                (item) =>
                                  item.ChairToOrder.unitPrice *
                                  item.ChairToOrder.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (order.DeskStocks.length
                              ? order.DeskStocks.map(
                                  (item) =>
                                    item.DeskToOrder.unitPrice *
                                    item.DeskToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (order.AccessoryStocks.length
                              ? order.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToOrder.unitPrice *
                                    item.AccessoryToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            order.surcharge) /
                          100
                    }`,
                    textAlign: 'right',
                    width: '15%',
                    borderBottom: '0.5px solid #808080',
                  },
                ],
                borderBottom: 'none',
              },
              {
                cells: [
                  {
                    content: ``,
                    width: '70%',
                    fontSize: 12,
                  },
                  { content: 'TOTAL', width: '15%' },
                  {
                    content: `${
                      (order.ChairStocks.length
                        ? order.ChairStocks.map(
                            (item) =>
                              item.ChairToOrder.unitPrice *
                              item.ChairToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (order.DeskStocks.length
                        ? order.DeskStocks.map(
                            (item) =>
                              item.DeskToOrder.unitPrice * item.DeskToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (order.AccessoryStocks.length
                        ? order.AccessoryStocks.map(
                            (item) =>
                              item.AccessoryToOrder.unitPrice *
                              item.AccessoryToOrder.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) -
                      (order.discountType
                        ? order.discount
                        : (((order.ChairStocks.length
                            ? order.ChairStocks.map(
                                (item) =>
                                  item.ChairToOrder.unitPrice *
                                  item.ChairToOrder.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (order.DeskStocks.length
                              ? order.DeskStocks.map(
                                  (item) =>
                                    item.DeskToOrder.unitPrice *
                                    item.DeskToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (order.AccessoryStocks.length
                              ? order.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToOrder.unitPrice *
                                    item.AccessoryToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            order.discount) /
                          100) +
                      (order.surchargeType
                        ? order.surcharge
                        : (((order.ChairStocks.length
                            ? order.ChairStocks.map(
                                (item) =>
                                  item.ChairToOrder.unitPrice *
                                  item.ChairToOrder.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (order.DeskStocks.length
                              ? order.DeskStocks.map(
                                  (item) =>
                                    item.DeskToOrder.unitPrice *
                                    item.DeskToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (order.AccessoryStocks.length
                              ? order.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToOrder.unitPrice *
                                    item.AccessoryToOrder.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            order.surcharge) /
                          100)
                    }`,
                    textAlign: 'right',
                    width: '15%',
                  },
                ],
              },
            ].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    borderBottom:
                      rowIndex === rowArr.length - 1 ? 'none' : null,
                    ...rowRestProps,
                  },
                ]}
              >
                {cells.map(
                  ({ content, width, ...cellRestProps }, index, cellArr) => (
                    <Text
                      key={index}
                      style={[
                        styles.tableColumn,
                        {
                          borderRight:
                            index === cellArr.length - 1 ? 'none' : null,
                          flexBasis: width,
                          maxWidth: width,
                          ...cellRestProps,
                        },
                      ]}
                    >
                      {content}
                    </Text>
                  )
                )}
              </View>
            ))}
            <Text
              style={{
                fontSize: 12,
                padding: 3,
                position: 'absolute',
                width: '70%',
                bottom: 0,
                left: 0,
              }}
            >
              NOTE: Please deposit to HSBC 023-472038-838 (bank code: 004, Bank
              address: 1 Queen's Road Central, Hong Kong. SWIFT code:
              HSBCHKHHHKH or FPS: info@ergoseatings.com
            </Text>
          </View>
          {[
            `Should the delivery of goods involved any staircases at the provided location, there will be an additional delivery fee of HK$100 per level to be charged in advance.`,
            `If you have special assembling requirements, please let us know prior to delivery.  Otherwise, all chairs will be assembled before delivery and all desks will be assembled on site.`,
            `If the delivery address is located in a remote area within Hong Kong, we reserve the rights to charge the client extra for delivery charges.  In such cases, we will provide a quotation upon investigation of the detailed address.  Client will be notified of such extra cost prior to delivery.`,
            `Delivery date for pre-orders stated above is an estimate only. While we will try our best to deliver the products as soon as possible, the actual delivery date may be adjusted depending on actual freight schedule. We do NOT accept refund in case of delay arising from delivery delay.`,
            `You understand that pre-orders are non-refundable.  Decision to switch to another product after purchase can only be treated as store credits. `,
          ].map((text, index) => (
            <View key={index} style={{ flexDirection: 'row', margin: '5px 0' }}>
              <View
                style={{
                  width: 2,
                  fontSize: 10,
                  lineHeight: 1.2,
                  margin: '0 10px 0 0',
                  color: '#888888',
                }}
              >
                <Text>•</Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  fontSize: 10,
                  lineHeight: 1.2,
                  color: '#888888',
                }}
              >
                <Text>{text}</Text>
              </View>
            </View>
          ))}
          <Text
            style={{
              marginTop: '5px',
              fontSize: 10,
              lineHeight: 1.2,
              color: '#888888',
            }}
          >
            The warranty is effective from the date of purchase from Blueocean
            International (HK) Ltd by the original purchaser. Such warranty
            applies under the following terms and conditions and is covered by
            the original manufacturers for specific period stated:
          </Text>
          {[
            `Nightingale chairs: 5 years for defective parts under regular usage, by Nightingale Corp.`,
            `Allseating chairs:  5 years for defective parts under regular usage, by Allseating Corp.`,
            `Standing desks: 5 years by manufacturer`,
            `Okamura chairs:  5 years for defective parts under regular usage, by Okamura Salotto HK Ltd.`,
            `Sidiz chairs: 3 years for defective parts under regular usage, by Sidiz, Inc.`,
            `Duorest chairs: 3 years for defective parts under regular usage, by Duoback Co. Ltd.`,
            `Wagner chairs: 5 years for defective parts under regular usage, by Topstar GMBH`,
            `Topstar chairs: 3 years for defective parts under regular usage, by Topstar GMBH`,
            `Ergohuman chairs: 2 years for defective parts under regular usage, by manufacturer`,
            `HAG chairs: 2 years for defective parts under regular usage, by manufacturer`,
          ].map((text, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', marginLeft: '10px' }}
            >
              <View
                style={{
                  width: 2,
                  fontSize: 10,
                  lineHeight: 1.2,
                  margin: '0 10px 0 0',
                  color: '#888888',
                }}
              >
                <Text>•</Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  fontSize: 10,
                  lineHeight: 1.2,
                  color: '#888888',
                }}
              >
                <Text>{text}</Text>
              </View>
            </View>
          ))}
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              color: '#888888',
            }}
          >
            Claiming of any aforementioned warranties only covers replacement of
            the defective or broken parts only and does not include the
            following cost, which shall be borne by the claimant. A quotation
            will be provided in advance for approval by the claimant: 1) labor
            costs of technician for replacing the parts; 2) transportation costs
            incurred for sending the product(s) to our company and delivering
            back to the claimant from our shop after service. I, the
            undersigned, have read and understand these policies and agree to
            all the above.
          </Text>
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              marginTop: 10,
              color: '#888888',
            }}
          >
            Agreement to this invoice represents that client understands our
            refund policy and terms and condition as stated in our website
            ergoseatings.com and ergoseatings.com.hk
          </Text>
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              marginTop: 10,
              color: '#888888',
            }}
          >
            Initials: _________________
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.2,
              marginTop: 12,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Thank you for your business!
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  ) : (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <WarningIcon />
      <Typography>This url is not a valid invoice url.</Typography>
    </Backdrop>
  );
});
