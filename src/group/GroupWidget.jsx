import React, { useEffect, useState } from 'react';
import { GrObjectUngroup } from 'react-icons/gr';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

import OrderingControl from './OrderingControl';

const GroupWidget = groupPlugin => props => {

  const [ group, setGroup ] = useState();

  const [ groupSize, setGroupSize ] = useState(0);

  const [ isOrdered, setIsOrdered ] = useState(false);

  const [ ordering, setOrdering ] = useState();

  const [ editOrdering, setEditOrdering ] = useState(false);

  const [ requireCtrlKey, setRequireCtrlKey ] = useState(true);

  useEffect(() => {
    const onChangeGroup = group => {
      setGroup(group);
      setGroupSize(group?.size || 0);
      setIsOrdered(group?.isOrdered);
      setOrdering(group?.getOrdering(props.annotation));
    }

    onChangeGroup(groupPlugin.group);

    groupPlugin.on('selectGroup', onChangeGroup);
    groupPlugin.on('changeGroup', onChangeGroup);

    // Cleanup
    return () => {
      groupPlugin.off('selectGroup', onChangeGroup);
      groupPlugin.off('changeGroup', onChangeGroup);
    }
  }, []);

  const onToggleAddToGroup = () => {
    groupPlugin.requireCtrlKey = !requireCtrlKey;
    setRequireCtrlKey(!requireCtrlKey);
  }

  const onClearGroup = () => {
    setGroupSize(0);
    groupPlugin.clearGroup();
  }

  const onToggleOrdered = () => {
    if (group) {
      setIsOrdered(!group.isOrdered);
      groupPlugin.setOrdered(!group.isOrdered);

      if (group.isOrdered) 
        setOrdering(group.getOrdering(props.annotation));
    }
  }

  const onIncreaseOrdering = () => {
    if (group) {
      group.moveUp(props.annotation);

      let updated = ordering + 1;
      if (updated > group.size)
        updated = 1;

      setOrdering(updated);
    }
  }

  const onDecreaseOrdering = () => {
    if (group) {
      group.moveDown(props.annotation);

      let updated = ordering - 1;
      if (updated === 0)
        updated = group.size;

      setOrdering(updated);
    }
  }

  return (
    <div className="r6o-widget group-plugin r6o-nodrag">
      <div className="group-status">
        <GrObjectUngroup /> 
        {groupSize > 1 ? 
          (isOrdered ? 
            <>
              <label className="order">{ordering}/{groupSize}</label>
              <button 
                className="change-order"
                onClick={() => setEditOrdering(!editOrdering)}>
                Change order
              </button>
            </> :
            <label>{groupSize} grouped annotations</label> 
          ) :
          <label className="not-grouped">Not grouped</label>
        }
      </div>

      <div className="buttons">
        <button 
          className="group-ordered"
          onClick={onToggleOrdered}>
          {isOrdered ? 
            <MdCheckBox /> : <MdCheckBoxOutlineBlank /> }
          Ordered
        </button>

        <button onClick={onToggleAddToGroup}>
         {requireCtrlKey ? 'Add or remove' : 'Done' }
        </button>
        <button
          disabled={!group} 
          onClick={onClearGroup}>Clear</button>
      </div>

      {isOrdered && editOrdering &&
        <OrderingControl 
          ordering={ordering}
          groupSize={groupSize} 
          onMoveUp={onIncreaseOrdering}
          onMoveDown={onDecreaseOrdering} 
          onClose={() => setEditOrdering(false)} />
      }
    </div>
  )

}

export default GroupWidget;