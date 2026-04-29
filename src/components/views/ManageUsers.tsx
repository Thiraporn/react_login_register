import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { PageHeader, Input,Radio, TextArea,  Checkbox} from "@/components/ui-elements"; 
import { useModal } from "@/context/ModalProvider";


//regex for user and password, if the input is out of range, it will be rejected
//const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;//user reject when out of rage
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;//password reject when out of rage
type Role = "USER" | "SUPERUSER" | "ADMIN" | "EDITOR" | "ANONYMOUS";
const roles: { label: string; value: Role }[] = [
  { label: "User", value: "USER" },
  { label: "Super User", value: "SUPERUSER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Editor", value: "EDITOR" },
  { label: "Anonymous", value: "ANONYMOUS" },
];

const organizations = [
  { label: "Organization Test", value: "DEMO" },
  { label: "Organization B", value: "B" },
  { label: "Organization C", value: "C" },
];

export const ManageUsers = () => {
    //  ใช้ context เพื่อ global modal  
    const { showModal, hideModal } = useModal(); 
    //state for signup  
    const [emailSignup, setEmailSignup] = useState('')
    const [validEmailSignup, setValidEmailSignup] = useState(false);
    const [emailSignupFocus, setEmailSignupFocus] = useState(false);
    //state for password and confirm password
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

     //state for confirm password
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

     //  init form state + errors state
     const ManageUsers = {
        username: "",
        password: "",
        nameTH: "",
        //nameEN: "",
        //nameJP: "",
        // refreshTokens: [] as string[],
        role: [] as Role[],
        organization: "",
        status: "ACTIVE"
    };
    const [errors, setErrors] = useState({});
     //  set form state
    const [form, setForm] = useState({
       ...ManageUsers,
      });

     //set form to default + generate new code  ==> ใช้ตอนแรก load หน้า + หลัง save สำเร็จ เพื่อเคลียร์ form + generate code ใหม่
    const clearForm = () => {
      setForm({
        ...ManageUsers
        });

        setErrors({});
    };
    const axiosPrivate = useAxiosPrivate(); 
    
    // const { auth } = useAuth();
    // useEffect(() => {
    //     if (!auth?.accessToken) return;
    //     let isMounted = true;
    //     const controller = new AbortController();
    //     const getMenus = async () => {
    //        try {
    //             const response = await axiosPrivate.post(
    //                 '/all-users',
    //                 {}, // body
    //                 { signal: controller.signal ,
    //                    withCredentials: true
    //                 } // config
    //             );
    //             console.log(response.data);
    //             // const userNames = response.data.map(user => user.username);
    //             // isMounted && setUsers(userNames);
    //         } catch (err) {
    //             console.log("ERROR:", err);
    //         }
             
    //     }
    //     getMenus();
    //     return () => {
    //         isMounted = false;
    //         controller.abort();
    //     };

    // }, [auth]);
    // Validation function
     //validate the email input
    useEffect(() => {
            setValidEmailSignup(EMAIL_REGEX.test(emailSignup));
        }, [emailSignup]);
    //validate the password input
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);

    }, [password, matchPwd]);
       //  handle input change for status radio buttons
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    };
    // const handleSelectRoleChange = (value, checked) => {
    //   setForm((prev) => {
    //     let newRoles;

    //     if (checked) {
    //       newRoles = [...prev.role, value]; // เพิ่ม
    //     } else {
    //       newRoles = prev.role.filter((r) => r !== value); // ลบ
    //     } 
    //     return {
    //       ...prev,
    //       role: newRoles,
    //     };
    //   });
    // };
    const handleSelectRoleChange = (value: Role, checked: boolean) => {
      console.log("value:", value);
      console.log("checked:", checked);

      setForm((prev) => {
        let updatedRoles = [...prev.role];

        if (checked) {
          updatedRoles.push(value);
        } else {
          updatedRoles = updatedRoles.filter((r) => r !== value);
        }

        console.log("updatedRoles:", updatedRoles);

        return {
          ...prev,
          role: updatedRoles
        };
      });
    };
    const validate = () => {
      const newErrors: any = {};  
       if (!form.username) {
         newErrors.username = "Username is required";
        } else if (!EMAIL_REGEX.test(form.username)) {
          newErrors.username = "Invalid username format";
        } else if (form.username.length < 3) {
          newErrors.username = "Username too short";
        }

        if (!form.password) {
          newErrors.password = "Password is required";
        } else if (!PWD_REGEX.test(form.password)) {
          newErrors.password = "Invalid password format";
        }

        if (!form.nameTH) {
          newErrors.nameTH = "Thai name is required";
        }

      return newErrors;
    };
    //  handle form submit save user
    const handleUserSaveSubmit = async (e: any) => { 
      e.preventDefault(); 

      const controller = new AbortController();

      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) return;

      try { 
        showModal("loading", "กำลังอัปเดต...");
         const payload = {
          ...form,
          roles: Object.fromEntries(
            form.role.map((r) => [r, r])
          )
        };
        const res = await axiosPrivate.post(
          "/users/save-user",
          payload,
          { signal: controller.signal ,withCredentials: true }
        );

        console.log("Saved:", res.data);
        // alert("Save success"); 
        hideModal(); // ปิด loading ก่อน
        showModal("success", "บันทึกสำเร็จ");
        setTimeout(() => {
          hideModal();
        }, 1200);

         

      } catch (err: any) {
        hideModal();
        showModal("error", "Save failed");
        console.log(err); 
        setTimeout(() => {
          hideModal();
        }, 1200);
      }
    };

  return ( 
    <div className="overflow-hidden"> 

    <form className="signup" onSubmit={handleUserSaveSubmit}> 
        <div className="p-6 bg-gray-100 min-h-screen">
          
          <div className="max-w-6xl mx-auto space-y-6">
            <PageHeader
            title="Users Management"
            breadcrumbs={[
                { label: "Home", path: "/Home" },
                { label: "Users Management" }
            ]}
          /> 
            {/* Section: Users Description */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-4">Users Management</h2>     
                 <div className="relative w-full">
                    <Input
                      name="username"
                      placeholder="Email Address"
                      value={form.username}
                      className={`input pr-10 ${
                        emailSignup.length === 0
                          ? "valid"
                          : validEmailSignup
                          ? "valid"
                          : "invalid"
                      }`}
                      onChange={(e) => {
                        setForm({ ...form, username: e.target.value });
                        setEmailSignup(e.target.value);
                      }}
                      onFocus={() => setEmailSignupFocus(true)}
                      onBlur={() => setEmailSignupFocus(false)}
                      aria-describedby="uidnote"
                      required
                    /> 
                    {emailSignup && (
                      <span className="absolute  right-3 top-1/2 -translate-y-1/2">
                        {validEmailSignup ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        )}
                      </span>
                    )} 
                  
                  </div>
                   <p id="uidnote" className={emailSignupFocus && emailSignup && !validEmailSignup ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter a valid email<br />
                 </p>
                 <div className="relative w-full">
                    <Input
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={form.password}
                      className={`input pr-10 ${
                        emailSignup.length === 0
                          ? "valid"
                          : validEmailSignup
                          ? "valid"
                          : "invalid"
                      }`}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setPassword(e.target.value);
                      }}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      aria-describedby="pwdnote"
                      required
                    />

                    {password && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validPassword ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
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
                 
                 <div className="relative w-full">
                    <Input
                      name="confirm_pwd"
                      placeholder="Confirm Password"
                      type="password" 
                      className={`input pr-10 ${ 
                            validMatch
                          ? "valid"
                          : "invalid"
                      }`}
                      onChange={(e) => setMatchPwd(e.target.value)}
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      aria-describedby="confirmnote" 
                      required
                    />
                    {matchPwd && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validMatch ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        )}
                      </span>
                    )}
                     
                  </div>
                  <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Must match password in put field.
                  </p>

                 
                <Input name="nameTH" placeholder="nameTH"  value={form.nameTH}  onChange={(e) => setForm({ ...form, nameTH: e.target.value })}/> 
                {/* <Input name="nameEN" placeholder="nameEN"  value={form.nameEN}  onChange={(e) => setForm({ ...form, nameEN: e.target.value })}/> 
                <Input name="nameJP" placeholder="nameJP"  value={form.nameJP}  onChange={(e) => setForm({ ...form, nameJP: e.target.value })}/>  */}
                <select className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }>
                    {/* <option value="">-- Select Organization --</option> */}
                    {/* <option value="DEMO">Organization Test</option>
                    <option value="B">Organization B</option>
                    <option value="C">Organization C</option> */}
                    {organizations.map((org) => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                </select>  
                <TextArea
                    placeholder="Additional Information (less than 100 characters)"
                    className="md:col-span-4 h-32"
                  /> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-2 rounded-2xl">
                      <h2 className="font-bold mb-4">Checkbox</h2>
                      
                      {/* <Checkbox
                        label="User"
                        value="USER"
                        checked={form.role.includes("USER")}
                        onChange={(e) => handleSelectRoleChange("USER", e.target.checked)}
                      />

                      <Checkbox
                        label="Super User"
                        value="SUPERUSER"
                        checked={form.role.includes("SUPERUSER")}
                        onChange={(e) => handleSelectRoleChange("SUPERUSER", e.target.checked)}
                      />

                      <Checkbox
                        label="Admin"
                        value="ADMIN"
                        checked={form.role.includes("ADMIN")}
                        onChange={(e) => handleSelectRoleChange("ADMIN", e.target.checked)}
                      /> */}
                      {roles.map((role) => (
                        <Checkbox
                          key={role.value}
                          label={role.label}
                          value={role.value} 
                          checked={Array.isArray(form.role) && form.role.includes(role?.value)}
                          onChange={(e) => handleSelectRoleChange(role.value, e.target.checked)}
                        />
                      ))}
                      {/* USER คนทั่วไป */}
                      {/* SUPERUSER เป็นพนักงานที่ต้องการสิทธิ์มากกว่าปกติ เช่น แก้ไขข้อมูลต่างๆ ในระบบ */}
                      {/* ADMIN เป็นผู้ดูแลระบบที่มีสิทธิ์มากที่สุด */}
                      {/* EDITOR เป็นผู้แก้ไขเนื้อหาในระบบ */}
                      {/* ANONYMOUS เป็นผู้ใช้งานที่ไม่ได้ลงทะเบียน  เช่น คนอื่นมาดูผลงาน */}
                  </div>
                  <div className="p-2 rounded-2xl">
                    <h2 className="font-bold mb-6">Status</h2>
                     <Radio name="status" label="Active" value="ACTIVE" checked={form.status === "ACTIVE"} onChange={handleStatusChange} />
                     <Radio name="status" label="Inactive" value="INACTIVE" checked={form.status === "INACTIVE"} onChange={handleStatusChange} />
                  </div>

                </div>
                
                
                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="USER">User</option>  
                    <option value="SUPERUSER">Super User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option> 
                    <option value="ANONYMOUS">Anonymous</option> 
                  </select>    
                </div>*/}
                
              
              
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button className="px-5 py-2 rounded-xl border" onClick={async () => clearForm()}>
              Clear
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white">
              Publish User
            </button>
            </div>
          </div> 
          
        </div> 
    </form>
    </div>
   );
}
