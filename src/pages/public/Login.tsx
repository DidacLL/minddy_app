import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";

interface LoginProps {
    onSubmit: (userName: string,navigator:any) => void
}

export const Login = ({onSubmit}: LoginProps) => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [userName, setUserName] = useState("");



    const [saveUser, setSaveUser] = useState<boolean>();
    const navigate = useNavigate();
    const isNew = searchParams.get('new');

    function login() {
        const savedUser = localStorage.getItem(userName)
        if (!isNew) {
            if (savedUser && savedUser.match(password)) {
                onSubmit(userName, navigate('/dashboard'));
            } else {
                navigate('/login?new=true')
                alert("User or password are wrong, try again or register as new user")
            }
        } else {
            if (password === passwordRepeat) {
                localStorage.setItem(userName, password);
                onSubmit(userName,navigate('/dashboard'));
            } else {
                alert("Password does not match, try again");
                setPassword("");
                setUserName("");
                setPasswordRepeat("");
                setSaveUser(false);
            }
        }
        if (saveUser) {
            localStorage.setItem("saved_user", userName);
        }
        setPassword("")
        setUserName("")
        setSaveUser(false)
    }

    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        // overflow:"hidden",
        flexGrow: 1
    }}>
        <div style={{padding: "1em", textAlign: "center", border: "0.1em solid white", borderRadius: "1em"}}>
            <div style={{textAlign: "right"}}>
                <label> UserName: </label>
                <input style={{margin: "1em"}}
                       type={"text"}
                       onChange={(e) => setUserName(e.target.value)}
                       value={userName}
                />
            </div>

            <div style={{textAlign: "right"}}>
                <label> Password: </label>
                <input style={{margin: "1em"}}
                       onChange={(e) => setPassword(e.target.value)}
                       type={"password"}
                       value={password}
                />
            </div>

            {isNew ?
                <div style={{textAlign: "right"}}>
                    <label> Repeat Password: </label>
                    <input style={{margin: "1em"}}
                           onChange={(e) => setPasswordRepeat(e.target.value)}
                           type={"password"}
                           value={passwordRepeat}
                    />
                </div> : ''
            }
            <div style={{textAlign: "right"}}>
                <label> Save user: </label>
                <input style={{margin: "1em"}}
                       onChange={(e) => setSaveUser(e.target.checked)}
                       type={"checkbox"}
                       checked={saveUser}

                />
            </div>
            <button
                disabled={userName.length === 0 || password.length === 0}
                onClick={login}
            > {isNew ? "REGISTER" : "LOG IN"}</button>
        </div>
    </div>;
}