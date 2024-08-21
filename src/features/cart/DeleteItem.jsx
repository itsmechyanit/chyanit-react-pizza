import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { cartAction } from './cartSlice';

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();
  return (
    <Button
      type="small"
      onClick={() => dispatch(cartAction.deleteItem(pizzaId))}
    >
      Delete
    </Button>
  );
}

export default DeleteItem;
