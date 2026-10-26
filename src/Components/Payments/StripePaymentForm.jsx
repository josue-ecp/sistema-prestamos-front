import { useCallback, useEffect, useState } from 'react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../api';
import './StripePaymentForm.css';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const elementOptions = {
  style: {
    base: {
      color: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#dc2626' },
  },
};

function CardPaymentFields({ clientSecret, authorizedIntentId: existingAuthorizedIntentId, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholder, setCardholder] = useState('');
  const [isCvcFocused, setIsCvcFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authorizedIntentId, setAuthorizedIntentId] = useState(existingAuthorizedIntentId);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setError('');

    let paymentIntentId = authorizedIntentId;

    if (!paymentIntentId) {
      try {
        const { error: confirmationError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: { name: cardholder.trim() },
            },
          },
        );

        if (confirmationError) {
          setError(confirmationError.message || 'No fue posible validar la tarjeta.');
          setIsProcessing(false);
          return;
        }

        if (!paymentIntent || paymentIntent.status !== 'requires_capture') {
          setError('El pago no quedó autorizado. Verifica la tarjeta e inténtalo de nuevo.');
          setIsProcessing(false);
          return;
        }

        paymentIntentId = paymentIntent.id;
        setAuthorizedIntentId(paymentIntentId);
      } catch (stripeError) {
        setError(stripeError.message || 'No fue posible comunicarse con Stripe. Inténtalo de nuevo.');
        setIsProcessing(false);
        return;
      }
    }

    try {
      const response = await api.post('/payments/confirm', {
        payment_intent_id: paymentIntentId,
      });
      await onSuccess(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'No fue posible registrar el pago. Contacta a soporte antes de volver a intentarlo.',
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`payment-card-scene ${isCvcFocused ? 'is-flipped' : ''}`} aria-hidden="true">
        <div className="payment-card">
          <div className="payment-card-face payment-card-front">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Credurix</span>
              <span className="payment-card-chip" />
            </div>
            <p className="mt-7 text-lg font-semibold tracking-[0.18em] text-white">•••• •••• •••• ••••</p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <span className="truncate text-xs uppercase tracking-wider text-blue-100">
                {cardholder || 'Nombre del titular'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-100">Tarjeta</span>
            </div>
          </div>
          <div className="payment-card-face payment-card-back">
            <div className="mt-5 h-9 bg-slate-950/80" />
            <div className="mt-5 flex items-center gap-3 px-5">
              <span className="text-[10px] uppercase text-blue-100">CVC</span>
              <span className="flex h-8 flex-1 items-center justify-end rounded bg-white px-3 text-sm tracking-[0.3em] text-slate-700">
                •••
              </span>
            </div>
            <p className="mt-4 px-5 text-right text-[9px] uppercase tracking-wider text-blue-100">
              Campo protegido por Stripe
            </p>
          </div>
        </div>
      </div>

      {authorizedIntentId ? (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-xs font-semibold text-blue-800">
          La tarjeta ya fue autorizada. Finaliza el pago para aplicar el abono a tu crédito.
        </p>
      ) : (
        <>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Nombre del titular</span>
            <input
              autoComplete="cc-name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              maxLength={100}
              onChange={(event) => setCardholder(event.target.value)}
              placeholder="Como aparece en la tarjeta"
              required
              value={cardholder}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Número de tarjeta</span>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
              <CardNumberElement options={elementOptions} />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Expiración</span>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <CardExpiryElement options={elementOptions} />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">CVC</span>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <CardCvcElement
                  onBlur={() => setIsCvcFocused(false)}
                  onFocus={() => setIsCvcFocused(true)}
                  options={elementOptions}
                />
              </div>
            </label>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          className="rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          disabled={isProcessing}
          onClick={onClose}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="rounded-xl bg-blue-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!stripe || isProcessing}
          type="submit"
        >
          {isProcessing ? 'Procesando pago...' : (authorizedIntentId ? 'Finalizar pago' : 'Confirmar pago')}
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentForm({ amount, onSuccess, onClose }) {
  const [clientSecret, setClientSecret] = useState('');
  const [quotedAmount, setQuotedAmount] = useState(Number(amount) || 0);
  const [authorizedIntentId, setAuthorizedIntentId] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(Boolean(publishableKey));
  const [error, setError] = useState('');

  const createIntent = useCallback(async () => {
    if (!publishableKey) {
      setError('Falta configurar VITE_STRIPE_PUBLISHABLE_KEY en el frontend.');
      return;
    }

    setIsCreatingIntent(true);
    setError('');

    try {
      const response = await api.post('/payments/intent');
      setClientSecret(response.data.client_secret);
      const responseAmount = response.data?.amount
        ?? response.data?.quote?.amount
        ?? response.data?.quote?.monto
        ?? response.data?.data?.amount
        ?? response.data?.data?.quote?.monto;
      const parsedAmount = Number(responseAmount ?? amount);
      setQuotedAmount(Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : (Number(amount) || 0));
      setAuthorizedIntentId(response.data.authorized ? response.data.payment_intent_id : '');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'No se pudo iniciar el pago. Inténtalo de nuevo.',
      );
    } finally {
      setIsCreatingIntent(false);
    }
  }, [amount]);

  useEffect(() => {
    createIntent();
  }, [createIntent]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        aria-labelledby="stripe-payment-title"
        aria-modal="true"
        className="max-h-[95vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-slate-50 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        role="dialog"
      >
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">Pago seguro</p>
            <h2 className="mt-1 text-lg font-black text-slate-900" id="stripe-payment-title">
              Pagar {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(quotedAmount) || 0)}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Tu tarjeta se procesa directamente en Stripe.</p>
          </div>
          <button
            aria-label="Cerrar formulario de pago"
            className="rounded-full p-2 text-xl leading-none text-slate-500 hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        {isCreatingIntent ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
            <p className="text-xs font-bold text-slate-500">Preparando el pago...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold text-red-700" role="alert">
              {error}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600"
                onClick={onClose}
                type="button"
              >
                Cerrar
              </button>
              <button
                className="rounded-xl bg-blue-800 py-3 text-xs font-bold text-white"
                onClick={createIntent}
                type="button"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : clientSecret ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CardPaymentFields
              authorizedIntentId={authorizedIntentId}
              clientSecret={clientSecret}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </Elements>
        ) : null}
      </section>
    </div>
  );
}
