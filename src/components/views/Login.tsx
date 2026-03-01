
import { useInput, useAuth, useToggle } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "@/api/axios";
//url for login
const LOGIN_URL = '/authen';

export const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const emailLoginRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLInputElement | null>(null);
    //+++++++++++++++++++++++++ Login : START ++++++++++++++++++++++++++++++++++++
    const [emailLogin, resetEmailLogin, emailLoginAttributeObj] = useInput('emailLogin', '');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    //+++++++++++++++++++++++++ Login : END ++++++++++++++++++++++++++++++++++++++ 
    const [check, toggleCheck] = useToggle('persist', false);


    useEffect(() => {
        emailLoginRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [emailLogin, pwd]);

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user: emailLogin, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            //const roles = response?.data?.roles;
            setAuth({ user: emailLogin, accessToken });
            //setUser('');
            resetEmailLogin();
            setPwd('');
            //setSuccess(true);
            // login success
            navigate(from, { replace: true });

        } catch (error: any) {
            if (!error?.response) {
                setErrMsg('No server response');
            } else if (error.response?.status === 401) {
                setErrMsg('Missing Username or Password');
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();

        }

    }

    return (
        <form className="login" onSubmit={handleLoginSubmit}>
            <p ref={errRef} className={errMsg ? "instructions" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <div className="field  input-wrapper">
                <input type="text" id="emailLogin"
                    placeholder="Email Address"
                    ref={emailLoginRef}
                    {...emailLoginAttributeObj}
                    required />
            </div>

            <div className="field  input-wrapper">
                <input type="password"
                    placeholder="Password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required />
            </div>


            {/* <div className="inline-flex items-center">
                <label className="flex items-center cursor-pointer relative" htmlFor="persist">
                    <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} className="peer h-5 w-5 cursor-pointer  " />
                    <label htmlFor="persist">{" "}Trust This Device</label>
                </label>
            </div>
             */}
            <Link to="/forgot-password">
                <div className="pass-link"> <p className="text-blue-400 text-opacity-100  "> Forgot password{" "}?</p>
                </div>
            </Link>
            <div className="inline-flex items-center gap-5">
                <div className="persistCheck" >
                    <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
                    <label htmlFor="persist">{" "}Trust This Device</label>
                </div>
            </div> 
            <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
            </div>
            <Link to="/signup">
                <div className="signup-link" >
                    <p className="text-blue-400 text-opacity-100  ">Not a member{" "}?</p>

                </div>
            </Link>

        </form>
    )
} 