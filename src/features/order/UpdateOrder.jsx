import { Form } from 'react-router-dom';
import Button from '../../ui/Button';

function UpdateOrder() {
  return (
    <Form className="text-right" method="PATCH">
      <Button type="primary">Make Priority</Button>
    </Form>
  );
}

export default UpdateOrder;
