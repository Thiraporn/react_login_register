import { useState } from "react";

const AuthenticationForm = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {

    }
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
                            onChange={() => setIsLogin(true)}
                        />
                        <input
                            type="radio"
                            name="slide"
                            id="signup"
                            checked={!isLogin}
                            onChange={() => setIsLogin(false)}
                        />

                        <label htmlFor="login" className="slide login">
                            Login
                        </label>
                        <label htmlFor="signup" className="slide signup">
                            Signup
                        </label>

                        <div className="slider-tab"></div>
                    </div>

                    <div className="form-inner">
                        {isLogin ? (
                            <form className="login" onSubmit={handleSubmit}>
                                <div className="field">
                                    <input type="text" placeholder="Email Address" required />
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
                        ) : (
                            <form className="signup" onSubmit={handleSubmit}>
                                <div className="field">
                                    <input type="text" placeholder="Email Address" required />
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
                        )}
                    </div>
                </div>
            </div>
        </section>);
}
export default AuthenticationForm