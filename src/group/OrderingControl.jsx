import React from 'react';

const OrderingControl = props => {

  return (
    <div className="group-plugin ordering-control">
      <span className="ordering">{props.ordering}/{props.groupSize}</span>
      <button onClick={props.onMoveUp}>+</button>
      <button onClick={props.onMoveDown}>-</button>
      <button onClick={props.onClose}>X</button>
    </div>
  )

}

export default OrderingControl;