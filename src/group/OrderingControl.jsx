import React from 'react';

const OrderingControl = props => {

  return (
    <div className="group-plugin ordering-control">
      <span>{props.ordering}/{props.groupSize}</span>
      <button onClick={props.onMoveUp}>+</button>
      <button onClick={props.onMoveDown}>-</button>
    </div>
  )

}

export default OrderingControl;