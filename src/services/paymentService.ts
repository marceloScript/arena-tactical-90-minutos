import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

const paymentService = {
  async createCheckoutSession() {
    const response = await axios.post(`${API_URL}/create-checkout-session`);
    return response.data;
  }
};

export default paymentService;
