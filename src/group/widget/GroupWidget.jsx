import React, { useEffect, useState } from 'react';

const GroupWidget = groupPlugin => props => {

  const [ groupSize, setGroupSize ] = useState();

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

  return (
    <div className="r6o-widget group-plugin">
      Current size: {groupSize}
    </div>
  )

}

export default GroupWidget;