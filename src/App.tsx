import React, { useEffect } from 'react';
import { mockServer } from './mockServer';

mockServer();

export const App = () => {

  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((json) => console.table(json.employees));
  }, [])

  return (
    <div>App</div>
  )
}
