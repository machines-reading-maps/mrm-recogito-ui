import React, { useEffect, useState } from 'react';
import { GrObjectUngroup } from 'react-icons/gr';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

const GroupWidget = groupPlugin => props => {

  const [ group, setGroup ] = useState();

  const [ groupSize, setGroupSize ] = useState(0);

  const [ isOrdered, setIsOrdered ] = useState(false);

  const [ ordering, setOrdering ] = useState();

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

  return (
    <div className="r6o-widget group-plugin r6o-nodrag">
      <div className="group-status">
        <GrObjectUngroup /> 
        {groupSize > 1 ? 
          (isOrdered ? 
            <>
              <label className="order">{ordering}/{groupSize}</label>
              <button 
                className="change-order">
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
    </div>
  )

}

export default GroupWidget;