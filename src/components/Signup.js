import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
//regex for user and password, if the input is out of range, it will be rejected
//const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;//user reject when out of rage
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;//password reject when out of rage

//url for signup 
const SIGNUP_URL = '/register';
const Signup = () => {
    //+++++++++++++++++++++++++ Signup : START ++++++++++++++++++++++++++++++++++++
    //ref for signup
    const emailSignupRef = useRef();
    const errRef = useRef();


    //state for signup  
    const [emailSignup, setEmailSignup] = useState('')
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
        setValidEmailSignup(EMAIL_REGEX.test(emailSignup));
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



    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const _username = EMAIL_REGEX.test(emailSignup);
        const _password = PWD_REGEX.test(pwd);
        if (!_username || !_password) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(
                SIGNUP_URL,
                JSON.stringify({ emailSignup, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            // signup success
            // navigate(from, { replace: true });
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No server response');
            } else if (error.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();

        }
    }
    //+++++++++++++++++++++++++ Signup : END +++++++++++++++++++++++++++++++++++++ 
    return (
        <form className="signup" onSubmit={handleSignupSubmit}>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <div className="field input-wrapper"  >
                <input type="text"
                    autoComplete="off"
                    className={  emailSignup.length === 0 ? "input valid" : validEmailSignup ? "input valid" : "input invalid"}
                    id="emailSignup"
                    placeholder="Email Address"
                    ref={emailSignupRef} 
                    onChange={(e) => setEmailSignup(e.target.value)}
                    onFocus={() => setEmailSignupFocus(true)}
                    onBlur={() => setEmailSignupFocus(false)}
                    aria-describedby="uidnote"
                    required
                />

                {validEmailSignup && emailSignup && (
                    <FontAwesomeIcon icon={faCheck} className="input-icon valid-icon" />
                )}
                {!validEmailSignup && emailSignup && (
                    <FontAwesomeIcon icon={faTimes} className="input-icon invalid-icon" />
                )}



            </div>

            <p id="uidnote" className={emailSignupFocus && emailSignup && !validEmailSignup ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                 Please enter a valid email<br />
            </p>



            <div className="field input-wrapper">
                <input
                    type="password"
                    id="password"
                    autoComplete="off"
                    placeholder="Password"
                    className={pwd.length === 0 ? "input valid" : validPwd ? "input valid" : "input invalid"}
                    onChange={(e) => setPwd(e.target.value)}
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    aria-describedby="pwdnote"
                    required />
                {validPwd && pwd && (
                    <FontAwesomeIcon icon={faCheck} className="input-icon valid-icon" />
                )}
                {!validPwd && pwd && (
                    <FontAwesomeIcon icon={faTimes} className="input-icon invalid-icon" />
                )}

            </div>
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and special characters.<br />
                Allowed Special characters:
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span>
                <span aria-label="percent">%</span>
            </p>
            <div className="field input-wrapper">
                <input
                    type="password"
                    id="confirm_pwd"
                    placeholder="Confirm password"
                    className={validMatch ? "input valid" : "input invalid"}
                    onChange={(e) => setMatchPwd(e.target.value)}
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                    aria-describedby="confirmnote"
                    required />
                {validMatch && matchPwd && (
                    <FontAwesomeIcon icon={faCheck} className="input-icon valid-icon" />
                )}
                {validMatch || !matchPwd && (
                    <FontAwesomeIcon icon={faTimes} className="input-icon invalid-icon" />
                )}

            </div>
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match password in put field.
            </p>
            <div className={`field btn ${(!validEmailSignup || !validPwd || !validMatch) ? "disabled" : ""}`}>
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" disabled={!validEmailSignup || !validPwd || !validMatch} />
            </div>
        </form>
    )
}

export default Signup