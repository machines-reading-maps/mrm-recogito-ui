import React, { useEffect, useState } from 'react';
import { GrObjectUngroup } from 'react-icons/gr';

const GroupWidget = groupPlugin => props => {

  const [ groupSize, setGroupSize ] = useState();

  const [ requireCtrlKey, setRequireCtrlKey ] = useState(true);

  useEffect(() => {
    setGroupSize(groupPlugin.group?.size || 0);

    const onChangeGroup = annotations =>
      setGroupSize(annotations.length);

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

  return (
    <div className="r6o-widget group-plugin r6o-nodrag">
      <div className="group-status">
        <GrObjectUngroup /> 
        {groupSize > 1 ? 
          <label>{groupSize} annotations in group</label> :
          <label className="not-grouped">Not grouped</label>
        }
      </div>

      <div className="buttons">
        <button onClick={onToggleAddToGroup}>
         {requireCtrlKey ? 'Add or remove' : 'Done' }
        </button>
        <button onClick={onClearGroup}>Clear group</button>
      </div>
    </div>
  )

}

export default GroupWidget;