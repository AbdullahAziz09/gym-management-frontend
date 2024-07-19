// TokenHandler.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import{ jwtDecode} from 'jwt-decode';
import { useIdleTimer } from 'react-idle-timer';

const TokenHandler = () => {
    const navigate = useNavigate();

   
    // Get (verify) the token from localStorage
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Token is valid:', decoded);
                return true;
            } catch (error) {
                console.error('Invalid token:', error);
                return false;
            }
        } else {
            console.log('No token found');
            return false;
        }
    };

    // Remove the token from localStorage
    const removeToken = () => {
        localStorage.removeItem('token');
        console.log('Token removed');
        navigate('/'); // Redirect to login after token removal
    };

    // Handle token expiration due to idle state
    const handleOnIdle = () => {
        removeToken();
        console.log('Token expired due to idle state');
    };

    useIdleTimer({
        timeout: 6000000, // 1 minute
        onIdle: handleOnIdle,
        debounce: 500,
    });

    // Check the token on component mount
    useEffect(() => {
        if (!getToken()) {
            navigate('/'); // Redirect to login if token is not valid
        }
    }, [navigate]);

    return null; 
};

export default TokenHandler;
