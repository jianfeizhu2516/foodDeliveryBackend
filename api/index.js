import express from 'express'
import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json())
 
app.use('/api/products', productRoutes);
app.use("/api/auth", authRoutes);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  console.log('Items:', items); // 输出接收到的 items
  const line_items = items.map(item => ({
    price: item.price,
    quantity: item.quantity,
  }));

  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/successfulPayment`,
      cancel_url: `${process.env.FRONTEND_URL}/failedPayment`,
    });
    console.log('Session created:', session); // 输出创建的 session

    res.json({ url: session.url });
  }catch(err){
    console.log('Error creating checkout session:', err);
    res.status(500).send('Internal Server Error!');
  }
  
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(8800, () => { 
  console.log('server at 8800');
});
