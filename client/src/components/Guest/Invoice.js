import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';

const details = [
  'Should the delivery of goods involved any staircases at the provided location, there will be an additional delivery fee of HK$100 per level to be charged in advance.',
  'If you have special assembling requirements, please let us know prior to delivery.  Otherwise, all chairs will be assembled before delivery and all desks will be assembled on site.',
  'If the delivery address is located in a remote area within Hong Kong, we reserve the rights to charge the client extra for delivery charges.  In such cases, we will provide a quotation upon investigation of the detailed address.  Client will be notified of such extra cost prior to delivery.',
  'Delivery date for pre-orders stated above is an estimate only. While we will try our best to deliver the products as soon as possible, the actual delivery date may be adjusted depending on actual freight schedule. We do NOT accept refund in case of delay arising from delivery delay.',
  'You understand that pre-orders are non-refundable.  Decision to switch to another product after purchase can only be treated as store credits. ',
];

const StyledTableCell = styled(TableCell)(() => ({
  padding: '5px 10px',
  [`&.${tableCellClasses.head}`]: {
    '@media print': {
      backgroundColor: '#dbe5f1',
      WebkitPrintColorAdjust: 'exact',
    },
    backgroundColor: '#dbe5f1',
    color: '#000000',
    textTransform: 'uppercase',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const useInvoiceStyles = makeStyles({
  root: {
    '@media print': {
      size: 'A4 portrait',
    },
    padding: 10,
    '& *': {
      fontFamily: 'Microsoft Sans Serif',
    },
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 10,
    '& table': {
      borderCollapse: 'collapse',
      '& th, & tr, & td': {
        border: '.5px solid #000000',
      },
    },
  },
  detail: {
    color: '#808080',
  },
});

export default () => {
  const classes = useInvoiceStyles();
  const printDocument = () => {
    // const input = document.getElementById('divToPrint');
    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgData, 'JPEG', 0, 0);
    //   // pdf.output('dataurlnewwindow');
    //   pdf.save('download.pdf');
    // });
  };

  return (
    <Box id="divToPrint" className={classes.root}>
      <Button onClick={printDocument}>aaa</Button>
      <Typography className={classes.title}>Invoice</Typography>
      <Typography>Date: October 15, 2021</Typography>
      <Typography>No: 20211127</Typography>
      <Typography>PO No: 9500011259</Typography>
      <Typography>
        Blueocean Int’l (HK) Ltd 19/F Bel Trade Commercial Building 3 Burrows
        Street Wanchai, Hong Kong Tel: 2169 3337
      </Typography>
      <Typography>Client's Info</Typography>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Salesperson</StyledTableCell>
              <StyledTableCell>Delivery Date</StyledTableCell>
              <StyledTableCell>Payment Terms</StyledTableCell>
              <StyledTableCell>Due Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell>Andy</StyledTableCell>
              <StyledTableCell>
                Est 2-3 Working days after payment received
              </StyledTableCell>
              <StyledTableCell>100% Bank transfer</StyledTableCell>
              <StyledTableCell>Oct 22, 2021</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>QTY</StyledTableCell>
              <StyledTableCell>DESCRIPTION</StyledTableCell>
              <StyledTableCell>UNIT PRICE</StyledTableCell>
              <StyledTableCell>LINE TOTAL (HKD)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell>1</StyledTableCell>
              <StyledTableCell>
                Duorest A80H with headrest, upholstered back and mesh seat,
                color: black, with delivery and installation included
              </StyledTableCell>
              <StyledTableCell>5500</StyledTableCell>
              <StyledTableCell>5500</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={2} rowSpan={3}>
                NOTE: Please deposit to HSBC 023-472038-838 (bank code: 004,
                Bank address: 1 Queen's Road Central, Hong Kong. SWIFT code:
                HSBCHKHHHKH or FPS: info@ergoseatings.com
              </StyledTableCell>
              <StyledTableCell>SUBTOTAL</StyledTableCell>
              <StyledTableCell>5500</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>SUBTOTAL</StyledTableCell>
              <StyledTableCell>5500</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>SUBTOTAL</StyledTableCell>
              <StyledTableCell>5500</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <List dense>
        {details.map((item, index) => (
          <ListItem key={index} className={classes.detail}>
            <ListItemIcon>
              <CheckBoxOutlineBlankIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Settings</ListSubheader>}>
        {details.map((item, index) => (
          <ListItem key={index} className={classes.detail}>
            <ListItemIcon>
              <CheckBoxOutlineBlankIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
