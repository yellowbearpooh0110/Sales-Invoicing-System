import React, { useState } from 'react';
import Detail from './Detail';

const Create = (props) => {
  const [phone, setPhone] = useState('');
  return (
    <Detail
      componentType="create"
      initialClient={{ phone, setPhone, paid: true }}
      initialCart={[]}
      {...props}
    />
  );
};

export default Create;
