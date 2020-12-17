import React from 'react';
import { render } from 'react-dom';
import * as Icons from '../build/react.index';

render(<App />, document.getElementById('root'));

export default function App() {
  return (
    <div className="w-screen flex flex-row flex-wrap">
      {Object.entries(Icons).map(([name, Component]) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center p-4 border"
        >
          <div>{name}</div>
          <div className="text-red-500">
            <Component className="w-16 h-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
