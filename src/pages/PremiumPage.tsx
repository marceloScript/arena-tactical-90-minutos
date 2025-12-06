import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import paymentService from "../services/paymentService";

// Carrega apenas uma vez (corrige o erro de tipo do Stripe)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PremiumPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBecomePremium = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Cria sessão no backend
      const response = await paymentService.createCheckoutSession();
      const { sessionId } = response;

      if (!sessionId) {
        setError("Erro ao criar sessão de pagamento.");
        setLoading(false);
        return;
      }

      // 2. Carrega Stripe JS com a chave publicável (AGORA CERTA)
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Erro ao carregar Stripe.");
        setLoading(false);
        return;
      }

      // 3. Redireciona para o checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Plano Premium ⚽</h1>

      <p>
        Torne-se Premium e desbloqueie:
        <br />
        • Acesso total ao simulador 3D
        <br />
        • Funções avançadas de táticas
        <br />
        • Análise automatizada
        <br />
        • E muito mais!
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleBecomePremium}
        disabled={loading}
        style={{
          padding: "12px 22px",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {loading ? "Redirecionando..." : "Tornar-se Premium"}
      </button>
    </div>
  );
};

export default PremiumPage;
