const Sequelize = require('sequelize');
const pdf = require('pdf-creator-node');
const fs = require('fs');

module.exports = {
  getChairDelivery,
  getDeskDelivery,
  getAccessoryDelivery,
  generateDeliveryPDF,
  signDelivery,
};

async function getChairDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.ChairToOrder.findAll({
      attributes: ['id', 'deliveryDate', 'from', 'to', 'delivered', 'signUrl'],
      where: {
        deliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signUrl, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Chair-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function getDeskDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.DeskToOrder.findAll({
      attributes: ['id', 'deliveryDate', 'from', 'to', 'delivered', 'signUrl'],
      where: {
        deliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signUrl, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Desk-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function getAccessoryDelivery(req, res, next) {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const result = await db.AccessoryToOrder.findAll({
      attributes: ['id', 'deliveryDate', 'from', 'to', 'delivered', 'signUrl'],
      where: {
        deliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: [
            'name',
            'phone',
            'email',
            'district',
            'street',
            'block',
            'floor',
            'unit',
          ],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const host = req.get('host');
    const protocol = req.protocol;

    res.json(
      result.map((item) => {
        const { SalesOrder, signUrl, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          pdfURL: `${protocol}://${host}/deliveryPDFs/Accessory-${restProps.id}.pdf`,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

async function signDelivery(req, res, next) {
  try {
    const host = req.get('host');
    const protocol = req.protocol;

    var { productType: type, deliveryId: id, signature } = req.body;
    type = type.charAt(0).toUpperCase() + type.slice(1);

    const delivery = await db[`${type}ToOrder`].findByPk(id);
    // if (delivery.delivered) throw 'This Delivery is already finished!';
    const dirpath = 'uploads/signature';
    const filepath = `${dirpath}/${Date.now()}.png`;
    fs.writeFileSync(`server/${filepath}`, signature, 'base64');
    Object.assign(delivery, { signUrl: filepath, delivered: true });
    await delivery.save();

    await _generateDeliveryPDF(type, delivery.id, `${protocol}://${host}`);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

function generateDeliveryPDF(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  var { productType: type, deliveryId: id } = req.body;
  type = type.charAt(0).toUpperCase() + type.slice(1);
  if (!fs.existsSync(`server/uploads/deliveryPDFs/${type}-${id}.pdf`))
    _generateDeliveryPDF(type, id, `${protocol}://${host}`)
      .then(() => {
        res.json({
          success: true,
          url: `${protocol}://${host}/uploads/deliveryPDFs/${type}-${id}.pdf`,
        });
      })
      .catch(next);
  else
    res.json({
      success: true,
      url: `${protocol}://${host}/uploads/deliveryPDFs/${type}-${id}.pdf`,
    });
}

async function _generateDeliveryPDF(type, id, host) {
  const html = fs.readFileSync('server/view/doc/delivery.hbs', 'utf8');

  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '20mm',
      contents:
        '<p style="text-align: center; text-transform: uppercase;">Delivery Sheet</p>',
    },
    footer: {
      height: '28mm',
      contents: {
        default:
          '<p style="text-align: center;"><span style="color: #444;">{{page}}</span>&nbsp;/&nbsp;<span>{{pages}}</span></p>', // fallback value
      },
    },
  };

  const deliveryInfo = await db[`${type}ToOrder`].findOne({
    where: { id },
    include: [
      {
        model: db.SalesOrder,
        where: {
          paid: true,
        },
        include: [
          {
            model: db.User,
            as: 'Seller',
            attributes: ['firstName', 'lastName'],
          },
        ],
      },
      {
        model: db[`${type}Stock`],
      },
    ],
  });

  if (!deliveryInfo) throw 'Delivery was not found.';

  const deliveryDate =
    deliveryInfo.SalesOrder.timeLine % 7 === 0
      ? `Est ${deliveryInfo.SalesOrder.timeLine / 7} working week${
          deliveryInfo.SalesOrder.timeLine / 7 === 1 ? '' : 's'
        } after payment`
      : `Est ${deliveryInfo.SalesOrder.timeLine} working day${
          deliveryInfo.SalesOrder.timeLine === 1 ? '' : 's'
        } after payment`;

  const client = {
    name: deliveryInfo.SalesOrder.name,
    email: deliveryInfo.SalesOrder.email,
    phone: deliveryInfo.SalesOrder.phone,
    unit: deliveryInfo.SalesOrder.unit,
    floor: deliveryInfo.SalesOrder.floor,
    block: deliveryInfo.SalesOrder.block,
    street: deliveryInfo.SalesOrder.street,
    district: deliveryInfo.SalesOrder.district,
  };

  const delivery = {
    dueDate: deliveryInfo.SalesOrder.dueDate,
    deliveryDate,
    sellerName: `${deliveryInfo.SalesOrder.Seller.firstName} ${deliveryInfo.SalesOrder.Seller.lastName}`,
    paymentTerms: deliveryInfo.SalesOrder.paymentTerms,
  };

  const product = {
    qty: deliveryInfo.qty,
    description:
      type === 'Chair'
        ? `Chair Brand: ${deliveryInfo.ChairStock.brand}\nChair Model: ${
            deliveryInfo.ChairStock.model
          }\n${
            deliveryInfo.ChairStock.withHeadrest
              ? 'With Headrest'
              : 'Without Headrest'
          }\n${
            deliveryInfo.ChairStock.withAdArmrest
              ? 'With Adjustable Armrest'
              : 'Without Adjustable Armrest'
          }\nFrameColor: ${deliveryInfo.ChairStock.frameColor}\nBack Color: ${
            deliveryInfo.ChairStock.backColor
          }\nSeat Color: ${deliveryInfo.ChairStock.seatColor}\nRemark: ${
            deliveryInfo.ChairStock.remark
          }\nWith delivery and installation included`
        : type === 'Desk'
        ? `Desk Model: ${deliveryInfo.DeskStock.model}\nColor of Legs: ${
            deliveryInfo.DeskStock.color
          }\nArmSize: ${deliveryInfo.DeskStock.armSize}\nFeetSize: ${
            deliveryInfo.DeskStock.feetSize
          }\nBeam Size: ${deliveryInfo.DeskStock.beamSize}\n${
            deliveryInfo.hasDeskTop
              ? `Table Top: ${deliveryInfo.topMaterial} ${deliveryInfo.topColor}\nTable Top Size: ${deliveryInfo.topLength}x${deliveryInfo.topWidth}x${deliveryInfo.topThickness}\nTable Top Color:\nRounded Corners: ${deliveryInfo.topRoundedCorners}, Radius: R${deliveryInfo.topCornerRadius}\nHoles Required: ${deliveryInfo.topHoleCount}, Holes Shaped: ${deliveryInfo.topHoleType}`
              : 'Without DeskTop'
          }\nWith delivery and installation included`
        : '',
  };

  var document = {
    html,
    data: {
      client,
      delivery,
      product,
      signUrl: deliveryInfo.signUrl ? `${host}/${deliveryInfo.signUrl}` : null,
    },
    path: `server/uploads/deliveryPDFs/${type}-${deliveryInfo.id}.pdf`,
    type: '',
  };
  await pdf.create(document, options);
}
