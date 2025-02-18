const Payment = require('../Models/Payment');
const Order = require('../Models/Order');

exports.completePayment = async (req, res) => {
    const { paymentId, transactionId, amount } = req.body;
  
    try {
      
      const payment = await Payment.findOne({ where: { paymentId } });
  
      if (!payment) {
        return res.status(404).send({ message: "Payment record not found." });
      }
      const paymentProcessed = true; // Simulated payment status
      
      if(+amount !== payment.amount) {
        paymentProcessed = false;
        return res.status(404).send({ message: "Payment failed please enter whole amount" });
      }
      
      
      
      if(payment.transactionId !== transactionId)
      {
        return res.status(404).send({ message: "Transaction Id not found." });
      }

      payment.paymentStatus = paymentProcessed ? "Completed" : "Failed";
      await payment.save();
      
    //   return console.log(payment)
      
      if (payment.paymentStatus === "Completed") {
        const updatedOrders = await Order.update(
          { status: "Dispatched" },
          { where: { orderId: payment.orderId } }
        );
  
        if (updatedOrders[0] === 0) {
          return res.status(404).send({ message: "No corresponding order found." });
        }
  
        return res.status(200).send({
          message: "Payment completed successfully, and order status updated.",
          transactionId: payment.transactionId,
        });
      }
  
      return res.status(200).send({
        message: "Payment failed. Order status remains unchanged.",
        transactionId: payment.transactionId,
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

exports.getPayment = async (req, res) =>{
    const { userId } = req.body;
    try {
        const payment = await Payment.findAll({ where: { id: userId } });
        if (!payment) {
          return res.status(404).send({ message: "Payment record not found." });
        }
        return res.status(200).send(payment);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    }

  