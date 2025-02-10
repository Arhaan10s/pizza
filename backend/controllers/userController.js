const User = require("../Models/User");
const Otp = require("../Models/Otps");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment-timezone");
const Order = require("../Models/Order");
const Menu = require("../Models/Menu");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({
      where: { email: email },
    });
    if (userExists) {
      return res.status(404).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json({
        message: "Your User account has been created successfully",
        data: user,
      });
    } else {
      res.status(404).json({ message: "Error creating User account" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.update(
      { token,status:1 },
      {
        where: { email },
      }
    );

    res.status(200).json({
      userId: user.userId,
      username: user.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({
      where: { userId: id , status:1},
    });

    if(!user)
    {
        return res.status(404).json({message:"User not found or user not logged in"})
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logOut = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({
      where: {  username: username},
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ status: 0, token: null }, { where: { username } });
    res.status(200).json({
      message: "User LoggedOut successfully",
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
    const user = await User.findOne({
      where: { email, status:1 },
    });

    if (!user) {
      res.status(404).json({ message: "No User found or not loggedIn" });
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

          // Disable User for 1 minute
          // const disableTime = moment()
          //   .tz("Asia/Kolkata")
          //   .add(1, "minute")
          //   .format("YYYY-MM-DD HH:mm:ss");

          await User.update(
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

      if (hashedPassword === user.password) {
        return res
          .status(200)
          .json({ message: "Password can not be the same" });
      } else {
        await User.update(
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

      // Check if User.dataValues.disable is null
      let disableTimes;
      if (user.dataValues.disable) {
        disableTimes = moment(user.dataValues.disable)
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

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({
      where: { userId: id,status:1 },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found or not Signed In" });
    }

    const deletedUser = await User.destroy({
      where: { userId: id },
    });
    return res
      .status(200)
      .send({ user: user.username, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  const { id} = req.body;
  try{
    const user = await User.findOne({
      where: { id, status: 1 }
    })
    if(!user)
    {
      return res.status(404).send({ message: "User not found or not logged In" });
    }
  const order = await Order.findAll({
    where :{ id}
  })
  
  if(!order)
    {
      return res.status(200).send({message: 'No Orders done yet'});
    }

    return res.status(200).send({message:"Orders are---",Orders: order})
  }
  catch(err){
    return res.status(500).send({message: err.message});
  }

};

exports.recieved = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // Validate user
    const user = await User.findOne({
      where: { userId, status: 1 },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found or not logged in." });
    }
    const order = await Order.findOne({
      where: { orderId },
    });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Update order status from "Dispatched" to "Completed"
    const [affectedRows] = await Order.update(
      { status: "Completed" },
      { where: { userId, status: "Dispatched", orderId } }
    );

    // Check if any rows were updated
    if (affectedRows === 0) {
      return res.status(404).send({
        message: "No orders found ",
      });
    }

    return res.status(200).send({
      message: "Orders  'Completed'",
      affectedOrders: affectedRows,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.cancelOrder = async (req,res) =>{
  const { orderId, userId} = req.body;
  try{
    const user = await User.findOne({
      where: { userId, status:1 }
    })

    if(!user)
    {
      return res.status(404).send({message: 'User not found or not loggedIn'})
    }

    const order = await Order.findOne({
      where:{
        userId, orderId
      }
    })

    if(!order){
      return res.status(404).send({message: 'No order placed for this Id'})
    }


     if(order.dataValues.status === 'Completed' )
     {
        return res.status(200).send({message: 'Order is already Delivered'});
     }

    const data = await Order.update({
      status:"Cancelled",
    },{
      where:{orderId, userId}
    })
 
    return res.status(200).send({message:"Order Cancelled successfully",Data:data})

  }
  catch(err){
    return res.status(500).send({message:err.message});
  }

}

exports.getPizza = async(req,res)=>{
  // const {id} = req.body;
  try{

    // const user = await User.findOne({
    //   where: {id ,status:1}
    // })
    // if(!user)
    //   {
    //     return res.status(404).send({ message:"user not found or not logged In"});
    //   }
      
      const pizza = await Menu.findAll();
      return res.status(200).send({ message:"Pizzas are--",pizza})
    }
  catch(err)
  {
    return res.status(500).send({message:err.message})
  }
  

}