const Sequelize = require('sequelize');
const pdf = require('pdf-creator-node');
const fs = require('fs');

module.exports = {
  getChairDelivery,
  getDeskDelivery,
  getPDFLink,
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
        if (
          !fs.existsSync(
            `server/uploads/deliveryPDFs/Chair-${restProps.id}.pdf`
          )
        ) {
          _generateDeliveryPDF('Chair', restProps.id, '');
        }
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          signURL: `${protocol}://${host}/deliveryPDFs/Chair-${restProps.id}.pdf`,
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
    const desks = await db.DeskToOrder.findAll({
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
    const accessories = await db.AccessoryToOrder.findAll({
      attributes: ['id', 'deliveryDate', 'from', 'to'],
      where: {
        deliveryDate: {
          [Sequelize.Op.gte]: fromDate,
          [Sequelize.Op.lte]: toDate,
        },
      },
      include: [
        {
          attributes: ['name', 'phone'],
          model: db.SalesOrder,
          where: {
            paid: true,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(
      desks.concat(accessories).map((item) => {
        const { SalesOrder, signUrl, ...restProps } = item.get();
        return {
          clientName: SalesOrder.name,
          clientPhone: SalesOrder.phone,
          clientDistrict: SalesOrder.district,
          clientStreet: SalesOrder.street,
          clientBlock: SalesOrder.block,
          clientFloor: SalesOrder.floor,
          clientUnit: SalesOrder.unit,
          signURL: signUrl,
          ...restProps,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}
async function getPDFLink(req, res, next) {
  try {
    // Read HTML Template
    // const { type, id } = req.body;
    const result = fs.existsSync(
      `server/uploads/deliveryPDFs/Chair-bb1798b2-5ba1-4cf8-b690-06e7f712a61b.pdf`
    );
    res.json(result);
    // _generateDeliveryPDF('Chair', 'iii')
    //   .then(res.json({ message: 'successfully successfully generated' }))
    //   .catch(next);
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

    _generateDeliveryPDF(
      type,
      delivery.id,
      `${protocol}://${host}/${filepath}`
      // `${protocol}://${host}/uploads/signature/1636960957004.png`
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function _generateDeliveryPDF(type, id, signUrl) {
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
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page',
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

  // const product = {
  //   qty: deliveryInfo.SalesOrder.dueDate,
  //   deliveryDate,
  //   sellerName: `${deliveryInfo.SalesOrder.Seller.firstName} ${deliveryInfo.SalesOrder.Seller.lastName}`,
  //   paymentTerms: deliveryInfo.SalesOrder.paymentTerms,
  // };

  var document = {
    html,
    data: {
      client,
      delivery,
      signUrl,
    },
    path: `server/uploads/deliveryPDFs/Chair-${deliveryInfo.id}.pdf`,
    type: '',
  };

  return await pdf.create(document, options);
}
