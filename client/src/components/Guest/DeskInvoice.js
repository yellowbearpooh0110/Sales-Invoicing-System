import React, { useEffect, useState } from 'react';
import {
  Document,
  Font,
  Page,
  PDFViewer,
  Text,
  Image,
  StyleSheet,
  View,
  Tspan,
} from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Warning as WarningIcon } from '@mui/icons-material';

import microsoft_sans_serif from 'fonts/Microsoft Sans Serif.ttf';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontFamily: 'Microsoft Sans Serif',
    fontSize: 40,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  detail: {
    fontFamily: 'Microsoft Sans Serif',
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  info: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  companyInfo: {
    fontFamily: 'Microsoft Sans Serif',
    fontSize: 8,
    width: 200,
    paddingRight: 10,
    lineHeight: 1.2,
  },
  clientInfo: {
    fontFamily: 'Microsoft Sans Serif',
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
    fontFamily: 'Microsoft Sans Serif',
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
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

Font.register({
  family: 'Microsoft Sans Serif',
  src: microsoft_sans_serif,
});

export default () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const source = axios.CancelToken.source();
    getOrder({ id, cancelToken: source.token });
    return () => source.cancel('Brand Component got unmounted');
  }, [id]);

  const getOrder = ({ id, cancelToken }) => {
    axios
      .get(`/deskorder/${id}`, { cancelToken })
      .then((response) => {
        // handle success
        setSuccess(true);
        setOrder(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        setSuccess(false);
        console.log(error);
      })
      .then(function () {
        // always executed
        setLoading(false);
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
          <Text style={styles.header} fixed>
            Desk Invoice
          </Text>
          <Text style={styles.title}>Invoice</Text>
          <View style={styles.detail}>
            <Text>No: 20211127</Text>
            <Text>Date: October 15, 2021</Text>
            <Text>PO No: 9500011259</Text>
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
              <Text>Client's Name: {order.clientName}</Text>
              <Text>{order.clientUnit}</Text>
              <Text>{order.clientFloor}</Text>
              <Text>{order.clientBlock}</Text>
              <Text>{order.clientStreet}</Text>
              <Text>{order.clientDistrict}</Text>
              <Text>Phone: {order.clientPhone}</Text>
            </View>
          </View>
          <View style={styles.table}>
            {[
              {
                cells: [
                  { content: 'Salesperson', width: '15%' },
                  { content: 'Delivery Date', width: '55%' },
                  { content: 'Payment Terms', width: '15%' },
                  { content: 'Due Date', width: '15%' },
                ],
                backgroundColor: '#dbe5f1',
                textTransform: 'uppercase',
              },
              {
                cells: [
                  { content: 'QTY', width: '15%' },
                  { content: order.deliveryDate, width: '55%' },
                  { content: '', width: '15%' },
                  { content: order.deliveryDate, width: '15%' },
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
                  ({ content, width, cellRestProps }, index, cellArr) => (
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
                  { content: 'Line Total (HKD)', width: '15%' },
                ],
                backgroundColor: '#dbe5f1',
                textTransform: 'uppercase',
              },
              {
                cells: [
                  { content: order.QTY, width: '15%' },
                  {
                    content: `${order.stock.deskModel.name}, ${order.stock.color.name}, ${order.stock.beam}, ${order.stock.akInfo}`,
                    width: '55%',
                  },
                  { content: `${order.unitPrice} HKD`, width: '15%' },
                  {
                    content: `${order.unitPrice * order.QTY} HKD`,
                    width: '15%',
                  },
                ],
              },
              {
                cells: [
                  { content: '', width: '15%' },
                  { content: '', width: '55%' },
                  { content: '', width: '15%' },
                  { content: '', width: '15%' },
                ],
              },
              {
                cells: [
                  { content: '', width: '15%' },
                  { content: '', width: '55%' },
                  { content: '', width: '15%' },
                  { content: '', width: '15%' },
                ],
              },
              {
                cells: [
                  { content: '', width: '15%' },
                  { content: '', width: '55%' },
                  { content: '', width: '15%' },
                  { content: '', width: '15%' },
                ],
              },
              {
                cells: [
                  { content: '', width: '15%' },
                  { content: '', width: '55%' },
                  { content: '', width: '15%' },
                  { content: '', width: '15%' },
                ],
              },
              {
                cells: [
                  {
                    content: ``,
                    width: '70%',
                    fontSize: 12,
                  },
                  { content: 'SUBTOTAL', width: '15%' },
                  {
                    content: `${order.unitPrice * order.QTY} HKD`,
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
                  { content: 'SALES TAX', width: '15%' },
                  {
                    content: '0 HKD',
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
                    content: `${order.unitPrice * order.QTY} HKD`,
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
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
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
};
