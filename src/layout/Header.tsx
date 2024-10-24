import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin'); 
    navigate('/login'); 
  };

  const isAuthenticated = localStorage.getItem('isAdmin') === 'true'; 

  return (
        <Navbar bg="light" expand="lg" style={{position:'sticky',top:0,zIndex:99}}>
            <Navbar.Brand as={Link} to="/">Job Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                    {isAuthenticated ? (
                        <Button variant="outline-danger" onClick={handleLogout}>
                            Logout
                        </Button>
                        ) : (
                        <nav>
                            <Link  to="/login" >
                                Login
                            </Link>
                        </nav>
                    )}
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
  );
};

export default Header;
