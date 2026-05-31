import { createOrderApi, verifyPaymentApi } from "../services/order.api.js";

// Dynamically loads Razorpay SDK
const loadRazorpayScript = () =>
	new Promise((resolve) => {
		if (document.getElementById("razorpay-script")) return resolve(true);
		const script = document.createElement("script");
		script.id = "razorpay-script";
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});

export const useRazorpay = () => {
	const handleCheckout = async ({ userName, userEmail, userContact, onSuccess, onError }) => {
		const loaded = await loadRazorpayScript();
		if (!loaded) {
			onError?.("Failed to load Razorpay. Check your internet connection.");
			return;
		}

		try {
			const { order, key } = await createOrderApi();

			const options = {
				key,
				amount: order.amount,
				currency: order.currency,
				name: "Snitch",
				description: "Order Payment",
				order_id: order.id,
				prefill: {
					name: userName,
					email: userEmail,
					contact: userContact,
				},
				theme: { color: "#6366f1" }, // match your brand color
				handler: async (response) => {
					// response = { razorpay_order_id, razorpay_payment_id, razorpay_signature }
					try {
						const verification = await verifyPaymentApi(response);
						if (verification.success) {
							onSuccess?.(verification);
						}
					} catch {
						onError?.("Payment verification failed.");
					}
				},
				modal: {
					ondismiss: () => onError?.("Payment cancelled by user."),
				},
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (err) {
			onError?.(err?.response?.data?.message || "Failed to initiate payment.");
		}
	};

	return { handleCheckout };
};
