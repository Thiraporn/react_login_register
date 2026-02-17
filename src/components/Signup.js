import { useState, useRef, useEffect } from "react";
import useInput from "../hooks/useInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
//regex for user and password, if the input is out of range, it will be rejected
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;//user reject when out of rage
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;//password reject when out of rage

//url for signup 
const SIGNUP_URL = '/signup';
const Signup = () => {
    //+++++++++++++++++++++++++ Signup : START ++++++++++++++++++++++++++++++++++++
    //ref for signup
    const emailSignupRef = useRef();
    const errRef = useRef();


    //state for signup  
    const [emailSignup, setEmailSignup, emailSignupAttributeObj] = useInput('emailSignup', '');
    const [validEmailSignup, setValidEmailSignup] = useState(false);
    const [emailSignupFocus, setEmailSignupFocus] = useState(false);
    //state for password and confirm password
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    //state for confirm password
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    //state for error message
    const [errMsg, setErrMsg] = useState('');


    //focus on the email input when the component is mounted
    useEffect(() => {
        emailSignupRef.current?.focus();
    }, []);
    //validate the email input
    useEffect(() => {
        setValidEmailSignup(USER_REGEX.test(emailSignup));
    }, [emailSignup]);

    //validate the password input
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
        
    }, [pwd, matchPwd]);

    //clear the error message when the user input changes
    useEffect(() => {
        setErrMsg('');
    }, [emailSignup, pwd, matchPwd]);

    useEffect(() => {
        setEmailSignup("");
    }, []);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        // signup success
        navigate(from, { replace: true });
    }
    //+++++++++++++++++++++++++ Signup : END +++++++++++++++++++++++++++++++++++++ 
    return (
        <form className="signup" onSubmit={handleSignupSubmit}>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <div className="field input-wrapper"  >
                <input type="text"
                    className={validEmailSignup ? "input valid" : "input invalid"}
                    id="emailSignup"
                    placeholder="Email Address"
                    ref={emailSignupRef}
                    {...emailSignupAttributeObj}
                    //value={emailSignup}
                    // onChange={(e) => {
                    //     console.log("typing...");
                    //     setEmailSignup(e.target.value);
                    // }}
                    onFocus={() => setEmailSignupFocus(true)}
                    onBlur={() => setEmailSignupFocus(false)}
                    required
                />
                {!validEmailSignup && emailSignup && (
                    <FontAwesomeIcon icon={faTimes} className="input-icon invalid-icon" />
                )}
                {validEmailSignup && emailSignup && (
                    <FontAwesomeIcon icon={faCheck} className="input-icon valid-icon" />
                )}

            </div>

            <div className="field">
                <input type="password" placeholder="Password" required />
            </div>

            <div className="field">
                <input
                    type="password"
                    placeholder="Confirm password"
                    required
                />
            </div>

            <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
            </div>
        </form>
    )
}

export default Signup