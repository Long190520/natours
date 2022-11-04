/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51LzJKkK49vPExP4tLxDc4OgJuNJUtvu0PnDqTAqunMbtr1y6FHXm0td8f4rnklrZG10GLFZokwqZrwgiGHBtS3gq005PVY4P6A'
);

export const bookTour = async (tourId) => {
  try {
    // Get checked out session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
