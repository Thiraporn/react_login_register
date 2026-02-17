import { useLocation, useNavigate } from "react-router-dom"; 
import Login from "./Login";
import Signup from "./Signup";


const AuthenticationForm = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const isLogin = location.pathname === "/" || location.pathname === "/login";
    const from = location.state?.from?.pathname || "/";

    return (
        <section>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Login Form</div>
                    <div className="title signup">Signup Form</div>
                </div>

                <div className="form-container">
                    <div className="slide-controls">
                        <input
                            type="radio"
                            name="slide"
                            id="login"
                            checked={isLogin} 
                            onChange={() => navigate("/login")}
                        />
                        <input
                            type="radio"
                            name="slide"
                            id="signup"
                            checked={!isLogin} 
                            onChange={() => navigate("/signup")}
                        />

                        <label htmlFor="login" className="slide login"> Login </label>
                        <label htmlFor="signup" className="slide signup"> Signup </label>

                        <div className="slider-tab"></div>
                    </div>

                    <div className="form-inner">
                        {isLogin ? <Login /> : <Signup />}
                    </div>
                </div>
            </div>
        </section>);
}
export default AuthenticationForm