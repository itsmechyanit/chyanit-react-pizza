import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { cartAction } from './cartSlice';

function UpdateItem({ pizzaId, quantityOfItem }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-1 md:gap-3">
      <Button
        type="round"
        onClick={() => dispatch(cartAction.decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>
      <span className="font-semibold">{quantityOfItem}</span>
      <Button
        type="round"
        onClick={() => dispatch(cartAction.increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
}

export default UpdateItem;
