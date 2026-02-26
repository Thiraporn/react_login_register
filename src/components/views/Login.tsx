
import useInput from "../../hooks/useInput";
import { useNavigate, useLocation } from "react-router-dom";
//url for login
const LOGIN_URL = '/authen';

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    //+++++++++++++++++++++++++ Login : START ++++++++++++++++++++++++++++++++++++
    const [emailLogin, resetEmailLogin, emailLoginAttributeObj] = useInput('emailLogin', '');
   

    //+++++++++++++++++++++++++ Login : END ++++++++++++++++++++++++++++++++++++++ 

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        // login success
        navigate(from, { replace: true });
    }

    return (
        <form className="login" onSubmit={handleLoginSubmit}>
            <div className="field">
                <input type="text" id="emailLogin" placeholder="Email Address"   {...emailLoginAttributeObj} required />
            </div>

            <div className="field">
                <input type="password" placeholder="Password" required />
            </div>

            <div className="pass-link">
                {/* <a href="">Forgot password?</a> */}
            </div>

            <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
            </div>

            <div className="signup-link" >
                Not a member?{" "}
                {/* <a href="" onClick={() => setIsLogin(false)}> 
                                        Signup now
                                    </a>   */}
            </div>
        </form>
    )
} 