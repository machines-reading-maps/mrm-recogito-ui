import React, { useEffect, useState } from 'react';
import { GrObjectUngroup } from 'react-icons/gr';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

const GroupWidget = groupPlugin => () => {

  const [ groupSize, setGroupSize ] = useState();

  const [ isOrdered, setIsOrdered ] = useState(false);

  const [ requireCtrlKey, setRequireCtrlKey ] = useState(true);

  useEffect(() => {
    setIsOrdered(groupPlugin.group?.isOrdered);
    setGroupSize(groupPlugin.group?.size || 0);

    const onChangeGroup = group => {
      setIsOrdered(group.isOrdered);
      setGroupSize(group.size);
    }

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
    groupPlugin.clearGroup();
  }

  const onToggleOrdered = () => {
    groupPlugin.setOrdered(!isOrdered);
    setIsOrdered(!isOrdered);
  }

  return (
    <div className="r6o-widget group-plugin r6o-nodrag">
      <div className="group-status">
        <GrObjectUngroup /> 
        {groupSize > 1 ? 
          <label>{groupSize} grouped annotations</label> :
          <label className="not-grouped">Not grouped</label>
        }
      </div>

      <div className="buttons">
        <button 
          className="group-ordered"
          onClick={onToggleOrdered}>
          { isOrdered ? 
            <MdCheckBox /> : <MdCheckBoxOutlineBlank /> }
          Ordered
        </button>

        <button onClick={onToggleAddToGroup}>
         {requireCtrlKey ? 'Add or remove' : 'Done' }
        </button>
        <button
          disabled={groupSize === 0} 
          onClick={onClearGroup}>Clear</button>
      </div>
    </div>
  )

}

export default GroupWidget;