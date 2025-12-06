// src/controllers/paymentController.js

const Stripe = require('stripe');
const User = require('../models/User');

// Inicializa Stripe com a SECRET_KEY do .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

module.exports = {
  // -----------------------------------------------------------
  // 1) CRIAR SESSÃO DE CHECKOUT PARA ASSINATURA PREMIUM
  // -----------------------------------------------------------
  async createCheckoutSession(req, res) {
    try {
      const userId = req.user.id; // Injectado pelo middleware de autenticação

      // ID DO PREÇO DO PLANO (criado no Stripe Dashboard)
      const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],

        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],

        // Envia o ID do usuário para identificar no webhook
        client_reference_id: userId,

        success_url: `${process.env.FRONTEND_URL}/premium/sucesso`,
        cancel_url: `${process.env.FRONTEND_URL}/premium/cancelado`
      });

      return res.json({ sessionId: session.id });

    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      return res.status(500).json({ error: 'Erro ao criar sessão do Stripe' });
    }
  },

  // -----------------------------------------------------------
  // 2) WEBHOOK PARA PROCESSAR EVENTOS DO STRIPE
  // -----------------------------------------------------------
  async stripeWebhook(req, res) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      // Verificar assinatura do Stripe
      const signature = req.headers['stripe-signature'];
      const event = stripe.webhooks.constructEvent(
        req.rawBody, // IMPORTANTE: o app deve usar rawBody para este endpoint
        signature,
        webhookSecret
      );

      // Evento: pagamento concluído
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.client_reference_id;

        // Atualizar usuário no banco → vira Premium
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          lives: 999
        });

        console.log(`Usuário ${userId} agora é Premium!`);
      }

      return res.sendStatus(200);

    } catch (error) {
      console.error('Erro no Webhook do Stripe:', error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
};
