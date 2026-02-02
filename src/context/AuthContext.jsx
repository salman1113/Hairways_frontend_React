import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, loginUser as apiLogin, logoutUser } from '../services/api'; 

const AuthContext = createContext();

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores full user details (id, username, email...)
    const [loading, setLoading] = useState(true); // To prevent flickering on load

    // 🔄 1. Check if user is already logged in (On Page Load)
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // ടോക്കൺ ഉണ്ടെങ്കിൽ, അത് വെച്ച് യൂസറുടെ വിവരങ്ങൾ എടുക്കുന്നു
                    const userData = await getUserProfile();
                    setUser(userData);
                } catch (error) {
                    console.error("Session expired:", error);
                    // ടോക്കൺ തെറ്റാണെങ്കിൽ ലോഗൗട്ട് ചെയ്യുന്നു
                    logout(); 
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // 🔐 2. Login Function
    const login = async (email, password) => {
        // api.js ലെ loginUser വിളിക്കുന്നു (ഇത് ടോക്കൺ ഓട്ടോമാറ്റിക് ആയി സേവ് ചെയ്യും)
        await apiLogin(email, password);
        
        // ലോഗിൻ വിജയിച്ചാൽ ഉടനെ യൂസർ പ്രൊഫൈൽ എടുക്കുന്നു
        const userData = await getUserProfile();
        setUser(userData);
        return userData;
    };

    // 🚪 3. Logout Function
    const logout = () => {
        logoutUser(); // Clears LocalStorage
        setUser(null); // Clears State
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;