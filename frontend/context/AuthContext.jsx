import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginCustomer,
    loginWorker,
    registerCustomer,
    registerWorker,
    saveAuthData,
    logout as logoutUser,
    getCurrentUser,
    getCurrentToken
} from "../services/authServices";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const storedUser = getCurrentUser();
        const storedToken = getCurrentToken();

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }

        setLoading(false);

    }, []);


    const login = async (
        email,
        password,
        role
    ) => {

        const response =
            role === "worker"
                ? await loginWorker({
                      email,
                      password
                  })
                : await loginCustomer({
                      email,
                      password
                  });


        const loggedInUser =
            saveAuthData(
                response,
                role
            );


        setUser(loggedInUser);
        setToken(response.token);


        return {
            ...response,
            user: loggedInUser
        };
    };


    const register = async (
        formData,
        role
    ) => {

        const response =
            role === "worker"
                ? await registerWorker(formData)
                : await registerCustomer(formData);


        const registeredUser =
            saveAuthData(
                response,
                role
            );


        setUser(registeredUser);
        setToken(response.token);


        return {
            ...response,
            user: registeredUser
        };
    };


    const logout = () => {

        logoutUser();

        setUser(null);
        setToken(null);
    };


    const isAuthenticated =
        Boolean(user && token);


    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context =
        useContext(AuthContext);


    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
};


export default AuthContext;