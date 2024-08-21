import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { cartAction, getTotalPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import { formatCurrency } from '../../utils/helpers';
import store from '../../store';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const errorData = useActionData();
  const isSubmitting = useNavigation().state === 'submitting';
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useSelector((state) => state.user);
  let totalCartPrice = useSelector(getTotalPrice);
  let priorityPrice;
  priorityPrice = withPriority ? 0.2 * totalCartPrice : 0;
  totalCartPrice = totalCartPrice + priorityPrice;
  const isLoadingAddress = addressStatus === 'loading';
  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-bold">Ready to order? Let&apos;s go!</h2>

      <button onClick={() => dispatch(fetchAddress())}>
        Get User&apos;s location{' '}
      </button>
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            {errorData && Object.keys(errorData).length > 0 && (
              <p className="mt-2 rounded-full bg-red-100 p-2 text-xs text-red-700 ">{`${errorData.phone}`}</p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            <input
              type="hidden"
              name="position"
              value={
                position.latitude && position.longitude
                  ? `${position.latitude}, ${position.longitude}`
                  : ''
              }
            />
            {addressError && (
              <p className="mt-2 rounded-full bg-red-100 p-2 text-xs text-red-700 ">
                {addressError}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[5px] md:right-[5px] md:top-[5px]">
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                GET POSITION
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:outline-2 focus:ring focus:ring-yellow-400"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? 'PLACING ORDER'
              : `ORDER NOW FOR ${formatCurrency(totalCartPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const error = {};

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };
  const isValid = isValidPhone(order.phone);
  if (!isValid) {
    error.phone =
      'You must provide a valid phone number, which we might need during delivery';
    return error;
  }
  const { id } = await createOrder(order);
  store.dispatch(cartAction.clearCart());

  return redirect(`/order/${id}`);
}

export default CreateOrder;
