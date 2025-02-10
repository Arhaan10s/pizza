const Admin = require("../Models/Admin");
const Otp = require("../Models/Otps");
const Menu = require("../Models/Menu");
const Order = require("../Models/Order");
const User = require("../Models/User");
const Cart = require("../Models/Cart");
const Helper = require('../Helper/Helper');
const { v4: uuidv4 } = require('uuid'); // Add this line

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment-timezone");

exports.register = async (req, res) => {
  const { id, name, email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({
      where: { email: email },
    });
    if (adminExists) {
      return res.status(404).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      adminId: id,
      adminname: name,
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(200).json({
        message: "Your admin account has been created successfully",
        data: admin,
      });
    } else {
      res.status(404).json({ message: "Error creating admin account" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      where: { email },
    });

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await jwt.sign(
      {
        adminId: admin.adminId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Admin.update(
      { token ,status:1 },
      {
        where: { email},
      }
    );

    res.status(200).json({
      adminId: admin.adminId,
      name: admin.adminname,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdmin = async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await Admin.findAll({
      where: { adminId: id, status:1},
    });
    res.status(200).json({admin,message:"admin not found or not loggedIN"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logOut = async (req, res) => {
  const  {adminname} = req.body;
  try {
    const admin = await Admin.findOne({
      where: { adminname, status:1 },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found or not LoggedIn" });
    }
    await Admin.update({ status:0, token: null }, { where: { adminname } });
    res.status(200).json({
      message: "Admin LoggedOut successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email, otp: inputOtp, password: inputPassword } = req.body;
  const currentTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  const disableTime = moment()
    .tz("Asia/Kolkata")
    .add(1, "minute")
    .format("YYYY-MM-DD HH:mm:ss");
  try {
    const admin = await Admin.findOne({
      where: { email, status:1 },
    });

    if (!admin) {
      res.status(404).json({ message: "No admin found or not LoggedIn" });
    }
    const otpp = await Otp.findOne({
      where: { email, status: 1 },
    });
    if (inputOtp && !inputPassword) {
      if (!otpp) {
        return res
          .status(404)
          .json({ message: "Please verify your email first" });
      }
      console.log("<<", otpp.otp_expires);
      console.log(">>", currentTime);
      // return console.log("<<", otpp.otp_expires > currentTime);
      if (otpp.otp_expires < currentTime) {
        await Otp.update(
          {
            otp_attempts: 0,
            otp_expires: null,
            status: 0,
          },
          {
            where: { email, status: 1 }, // Include conditions here
          }
        );

        return res.status(200).json({
          message: "OTP has expired. Please request a new one.",
        });
      }

      console.log("otp tbale", otpp.otp);
      if (otpp.otp !== +inputOtp) {
        const attempts = otpp.otp_attempts || 0;

        if (otpp.otp_attempts > 2) {
          await Otp.update(
            {
              otp_attempts: 0,
              otp_expires: null,
              status: 0,
            },
            {
              where: { email, status: 1 },
              order: [["id", "DESC"]],
            }
          );

          // Disable admin for 1 minute
          // const disableTime = moment()
          //   .tz("Asia/Kolkata")
          //   .add(1, "minute")
          //   .format("YYYY-MM-DD HH:mm:ss");

          await Admin.update(
            {
              disable: disableTime,
              status: 1,
            },
            {
              where: { email },
            }
          );

          return res.status(401).json({
            message: `Maximum attempts reached. Please try again after ${disableTime}`,
          });
        }

        await Otp.update(
          {
            otp_attempts: attempts + 1,
          },
          {
            where: { email, status: 1 },
          }
        );
        return res.status(400).json({
          message: "Invalid Otp",
          attempts: attempts + 1,
        });
      }

      // await Otp.update(
      //   {
      //     otp_attempts: 0,
      //     otp_expires: null,
      //     status: 0,
      //   },
      //   {
      //     where: { email,status:1 },
      //   }
      // );
      return res.status(200).json({
        message: " Otp verified and please input New password",
      });
    }

    if (inputOtp && inputPassword) {
      if (otpp.otp !== +inputOtp) {
        return res.status(400).json({
          message: "OTP verification required before changing password",
        });
      }

      const hashedPassword = await bcrypt.hash(inputPassword, 10);

      if (hashedPassword === admin.password) {
        return res
          .status(200)
          .json({ message: "Password can not be the same" });
      } else {
        await Admin.update(
          {
            password: hashedPassword,
            disable: null,
            status: 1,
          },
          { where: { email } }
        );

        await Otp.update(
          {
            otp_attempts: 0,
            otp_expires: null,
            status: 0,
          },
          {
            where: { email, status: 1 },
          }
        );

        return res
          .status(200)
          .json({ message: "Password changed successfully!" });
      }
    }

    if (!inputOtp && !inputPassword) {
      const otp = crypto.randomInt(100000, 1000000);
      const otpExpires = moment()
        .tz("Asia/Kolkata")
        .add(1, "minute")
        .format("YYYY-MM-DD HH:mm:ss"); // Set OTP expiry to 1 minute later

      const presentTime = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      // Check if admin.dataValues.disable is null
      let disableTimes;
      if (admin.dataValues.disable) {
        disableTimes = moment(admin.dataValues.disable)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        disableTimes = null; // Assign null or set a default value if required
      }

      if (!disableTimes || presentTime > disableTimes) {
        await Otp.create({
          otp,
          email,
          otp_expires: otpExpires,
          otp_attempts: 0,
          status: 1,
        });

        return res.status(200).send({
          otp,
          message: "Otp sent successfully!",
        });
      } else {
        return res
          .status(404)
          .send({ message: `Please try after ${disableTimes}` });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.body;
  try{

    const admin = await Admin.findOne({
      where: { adminId : id, status:1 }
    })

    if(!admin)
    {
      return res.status(404).send({ message:"Admin not found or not LoggedIn"});
    }

    const deletedAdmin = await Admin.destroy({
      where: { adminId :id }
    })
    return res.status(200).send({ admin:admin.adminname,message: "Admin deleted successfully"})
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }

};


exports.addPizza = async (req, res) => {
  const { adminId, pizza, categories, basePrice, toppings, size } = req.body;

  try {
    // Ensure admin is valid
    const admin = await Admin.findOne({ where: { adminId, status: 1 } });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found or not logged in" });
    }

    // Parse toppings into an array
    const toppingsArray = Array.isArray(toppings) ? toppings : JSON.parse(toppings);

    // Parse sizes into an array
    const sizesArray = Array.isArray(size) ? size : size.split(',').map(s => s.trim());

    // Validate toppings and sizes
    if (!toppingsArray.every(topping => Helper.allowedToppings.includes(topping))) {
      return res.status(400).send({ message: `Invalid topping(s). Allowed toppings are: ${Helper.allowedToppings.join(', ')}` });
    }

    if (!sizesArray.every(siz => Helper.allowedSizes.includes(siz))) {
      return res.status(400).send({ message: `Invalid size(s). Allowed sizes are: ${Helper.allowedSizes.join(', ')}` });
    }

    if (!['Veg', 'Non-Veg'].includes(categories)) {
      return res.status(400).send({ message: 'Invalid category. Allowed categories are: Veg, NonVeg' });
    }

    // Calculate total price
    const totalPrice = Helper.calculateTotalPrice(basePrice, categories, sizesArray[0], toppingsArray);

    const image = req.file ? req.file.filename : null;

    // Generate pizzaId as an incrementing integer
    const lastPizza = await Menu.findOne({ order: [['pizzaId', 'DESC']] });
    const pizzaId = lastPizza ? lastPizza.pizzaId + 1 : 1;

    const pizzaData = await Menu.create({
      pizzaId,
      adminId,
      pizza,
      categories,
      basePrice,
      totalPrice,
      toppings: toppingsArray,
      sizes: sizesArray,
      image
    });

    return res.status(201).send({ message: "Pizza created successfully", pizza: pizzaData });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


exports.getAvailableOptions = async (req, res) => {
  try {
    const availableToppings = Helper.allowedToppings;
    const availableSizes = Helper.allowedSizes;
    const availableCategories = ['Veg', 'Non-Veg'];

    res.status(200).json({
      toppings: availableToppings,
      sizes: availableSizes,
      categories: availableCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPizza = async(req,res)=>{
  const {adminId} = req.body;
  try{

    const admin = await Admin.findOne({
      where: {adminId ,status:1}
    })
    if(!admin)
      {
        return res.status(404).send({ message:"Admin not found or not logged In"});
      }
      
      const pizza = await Menu.findAll({
        where:{adminId}
      })
      return res.status(200).send({ message:"Pizzas are--",pizza})
    }
  catch(err)
  {
    return res.status(500).send({message:err.message})
  }
  

}

exports.getOrders = async (req, res) => {
  const { adminId } = req.query;

  try {
      // Ensure admin is valid
      const admin = await Admin.findOne({ where: { adminId, status: 1 } });
      if (!admin) {
          return res.status(404).send({ message: "Admin not found or not logged in" });
      }

      // Fetch all orders
      const orders = await Order.findAll({
          include: [
              { model: User, attributes: ['username', 'email'] },
          ]
      });

      return res.status(200).send({ orders });
  } catch (error) {
      return res.status(500).send({ message: error.message });
  }
};

exports.getAvailableOptions = async (req, res) => {
  try {
    const availableToppings = Helper.allowedToppings;
    const availableSizes = Helper.allowedSizes;
    const availableCategories = ['Veg', 'Non-Veg'];

    res.status(200).json({
      toppings: availableToppings,
      sizes: availableSizes,
      categories: availableCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
