import React from 'react';
import Header from './Header';

interface MyComponentProps {
  children: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <>
        <Header />
        <div>
            {children}
        </div>
    </>
  );
};

export default MyComponent;
