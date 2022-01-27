import React from 'react';
import { BiCheck } from 'react-icons/bi';

const OrderingControl = props => {

  return (
    <div className="group-plugin ordering-control">
      <span className="ordering">{props.ordering}/{props.groupSize}</span>

      <button
        className="simple" 
        onClick={props.onMoveUp}>Up</button>

      <button 
        className="simple"
        onClick={props.onMoveDown}>Down</button>

      <button
        className="close-ordering-control" 
        onClick={props.onClose}>
        <BiCheck />
      </button>
    </div>
  )

}

export default OrderingControl;