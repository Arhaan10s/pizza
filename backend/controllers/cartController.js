const User = require("../Models/User");
const Menu = require("../Models/Menu");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const Payment = require("../Models/Payment");
const Helper = require("../Helper/Helper");
const { Model } = require("sequelize");
const moment = require("moment-timezone");


exports.addCart = async (req, res) => {
  const { id, pizzaId, toppings, category, size, quantity } = req.body;
  try {
    const user = await User.findOne({
      where: { id, status: 1 },
    });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User Not found or not logged in" });
    }

    const pizza = await Menu.findOne({
      where: { pizzaId },
    });
    if (!pizza) {
      return res.status(404).send({ message: "Pizza not available" });
    }

    const toppingsArray = Array.isArray(toppings)
      ? toppings
      : toppings.split(",").map((t) => t.trim());

    if (
      !toppingsArray.every((topping) =>
        Helper.allowedToppings.includes(topping)
      )
    ) {
      return res.status(400).send({
        message: `Invalid topping(s). Allowed toppings are: ${Helper.allowedToppings.join(
          ", "
        )}`,
      });
    }

    const sizeArray = Array.isArray(size)
      ? size
      : size.split(",").map((s) => s.trim());

    if (!sizeArray.every((s) => Helper.allowedSizes.includes(s))) {
      return res.status(400).send({
        message: `Invalid size(s). Allowed sizes are: ${Helper.allowedSizes.join(
          ", "
        )}`,
      });
    }

    if (!["Veg", "Non-Veg"].includes(category)) {
      return res.status(400).send({
        message: "Invalid category. Allowed categories are: Veg, Non-Veg",
      });
    }
    const menuItem = await Menu.findOne({
      where: { pizzaId },
    });
    const basePrice = menuItem.basePrice;
    const Price = Helper.calculateTotalPrice(
      basePrice,
      category,
      sizeArray[0],
      toppingsArray
    );
    const totalPrice = quantity * Price;

    const cartData = await Cart.create({
      id,
      pizzaId,
      categories: category,
      toppings,
      sizes: size,
      quantity,
      totalPrice,
    });
    return res
      .status(200)
      .send({ message: "Pizza added successfully", cart: cartData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.updateCart = async (req, res) => {
  const { cartId, username, toppings, size, quantity } = req.body;
 
  try {
    const user = await User.findOne({
        where: { username, status: 1 },
      });
    const cartItem = await Cart.findOne({
        where: { cartId, username },
      });

    if (cartId && username && !toppings && !size && !quantity) {
      
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found or not logged in" });
      }

      if (!cartItem) {
        return res.status(404).send({ message: "Cart not found" });
      }

      return res.status(200).send({
        message: "Enter updation you have to do ---",
        toppings: `Toppings available are: ${Helper.allowedToppings.join(
          ", "
        )}`,
        sizes: `Sizes available are: ${Helper.allowedSizes.join(", ")}`,
      });
    }
    if (cartId && username && toppings && size && quantity) {

      const toppingsArray = Array.isArray(toppings)
        ? toppings
        : toppings.split(",").map((t) => t.trim());

      if (
        !toppingsArray.every((topping) =>
          Helper.allowedToppings.includes(topping)
        )
      ) {
        return res.status(400).send({
          message: `Invalid topping(s). Allowed toppings are: ${Helper.allowedToppings.join(
            ", "
          )}`,
        });
      }

      const sizeArray = Array.isArray(size)
        ? size
        : size.split(",").map((s) => s.trim());

      if (!sizeArray.every((s) => Helper.allowedSizes.includes(s))) {
        return res.status(400).send({
          message: `Invalid size(s). Allowed sizes are: ${Helper.allowedSizes.join(
            ", "
          )}`,
        });
      }
      const pizId = cartItem.dataValues.pizzaId
      
      const menu = await Menu.findOne({
        where:{pizzaId : pizId}
      })
      const basePrice = menu.dataValues.basePrice;
      const category = cartItem.dataValues.categories;
      console.log("??",category)
      
      const Price = Helper.calculateTotalPrice(
        basePrice,
        category,
        sizeArray[0],
        toppingsArray
      );
      const totalPrice = quantity*Price;
    //   console.log("totalPrice", basePrice);return;
      const cartUp = await Cart.update({
        toppings,
        sizes:size,
        quantity,
        totalPrice,
      },{
        where:{cartId,username}
      }
    )
      return res.status(200).send({
        message:"Cart updated successfully",
        cartUpdate:{
            toppings:toppings,
            size:size,
            quantity:quantity,
            totalPrice:totalPrice,
        }
        
      })
      
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({
      where: { id, status: 1 },
    });
    if (!user) {
      return res
        .status(402)
        .send({ message: "User not found or not logged in" });
    }

    const cartItems = await Cart.findAll({
      where: { id },
      include: [
        {
          model: Menu,
          attributes: ["pizza"],
        },
      ],
    });
    if (!cartItems.length) {
      return res.status(200).send({
        message: "Your cart is empty",
        Total: 0,
        Price: 0,
      });
    }

    const cartDetails = cartItems.map((item) => ({
      pizzaName: item.Menu.pizza,
      toppings: item.toppings,
      size: item.sizes,
      category: item.categories,
      quantity: item.quantity,
      price: item.totalPrice,
    }));

    const totalItem = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    return res.status(200).send({
      message: "Your Cart is",
      TotalItems: totalItem,
      TotalPrice: totalPrice,
      message: "Your Cart items are----",
      Cart: cartDetails,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.removeCart = async (req, res) => {
  const { cartId, username } = req.body;
  try {
    const user = await User.findOne({
      where: { username, status: 1 },
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found or not logged in" });
    }

    const cartItem = await Cart.findOne({
      where: { cartId, username },
    });
    if (!cartItem) {
      return res.status(404).send({ message: "Cart not found" });
    }

    const remove = await Cart.destroy({
      where: { cartId, username },
    });
    return res.status(200).send({ message: "Cart removed successfully" });
  } catch (err) {
    return res.status(404).send({ message: err.message });
  }
};


exports.checkOut = async (req, res) => {
  const { id, paymentMethod, deliveryAddress, contactNumber } = req.body;

  try {
    const currentTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Validate the user
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ message: "User not found or not logged in" });
    }

    // Retrieve cart items for the user
    const cartItems = await Cart.findAll({
      where: { id },
      include: [
        {
          model: Menu,
          attributes: ["pizza", "pizzaId"],
        },
      ],
    });

    if (!cartItems.length) {
      return res.status(200).send({
        message: "Your cart is empty",
        totalItems: 0,
        totalPrice: 0,
      });
    }

    
    if (!["Cash", "Card", "UPI"].includes(paymentMethod)) {
      return res.status(400).send({
        message: "Invalid payment method. Allowed options: Cash, UPI, Card",
      });
    }

    
    let totalQuantity = 0;
    let totalPrice = 0;
    const orders = cartItems.map((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.totalPrice;

      return {
        id,
        pizzaId: item.Menu.pizzaId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        status: "Pending",
        payment: paymentMethod,
        deliveryAddress,
        contactNumber,
        orderDate: currentTime,
      };
    });

    const createdOrders = await Order.bulkCreate(orders);

    // Create a payment record for each order
    const paymentRecords = createdOrders.map(async (order) => {
      return Payment.create({
        id,
        orderId: order.orderId,
        paymentMethod,
        amount: order.totalPrice,
        paymentStatus: "Pending",
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      });
    });

    await Promise.all(paymentRecords);

    // Clear the user's cart after successful checkout
    await Cart.destroy({ where: { id } });

    return res.status(200).send({
      message: "Checkout completed successfully",
      totalItems: totalQuantity,
      totalPrice: totalPrice,
      orders: createdOrders,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

