import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem("id");
        if (!session) {
            navigate("/login");
        }
    }, [navigate]);

    return children ? children : <Outlet />;
};

export default PrivateRoute;