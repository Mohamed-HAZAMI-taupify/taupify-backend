const express = require("express");
const stripe = require("stripe")(process.env.STRIPEKEY);
const router = express.Router();
router.post("/", async (req, res, next) => {
  const { items } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.everest-sportclub.fr/buy-t-shirt-everest",
      cancel_url: "https://www.everest-sportclub.fr/buy-t-shirt-everest",
    });
    res.json({
      url: session.url,
    });
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;