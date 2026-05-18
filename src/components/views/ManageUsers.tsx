import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { PageHeader, Input,Radio, TextArea,  Checkbox, Select, InputWithValidation} from "@/components/ui-elements"; 
import { useModal } from "@/context/ModalProvider"; 


//regex for user and password, if the input is out of range, it will be rejected
//const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;//user reject when out of rage
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;//password reject when out of rage

type Role = {
    id: string;
    name: string;       
    code: string;
    description: string;
};
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
    //state for password and confirm password
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false); 

     //state for confirm password
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false); 
    //state for roles from backend
    const [roles, setRoles] = useState<Role[]>([]); 
    //  init form state + errors state
    const ManageUsers = {
        username: "",
        password: "",
        nameTH: "",
        //nameEN: "",
        //nameJP: "",
        // refreshTokens: [] as string[],
        role: [] as string[],
        organization: "",
        status: "ACTIVE"
    };
    //state for form errors
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
   
    // fetch roles from backend
   useEffect(() => {
      const controller = new AbortController(); 
      const fetchRoles = async () => {
        try {
          const res = await axiosPrivate.get(
            "/roles/all-roles", 
            {
              signal: controller.signal,
              withCredentials: true,
            }
          );

          setRoles(res.data);
        } catch (err: any) {
          console.error(err);
        }
      }; 
      fetchRoles(); 
      return () => {
        controller.abort(); // cleanup
      };
    }, []);

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
     
    const handleSelectRoleChange = (value: string, checked: boolean) => {
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
                 {/* input validation  dynamic */}   
                  <InputWithValidation
                    name="username"
                    placeholder="Email Address"
                    value={form.username}
                    onChange={(e) =>{
                        setForm({ ...form, username: e.target.value });
                        setEmailSignup(e.target.value);
                      }}
                    validator={(value) => EMAIL_REGEX.test(value)}
                    validator-describedBy="uidnote"
                    validator-errorMessage="Please enter a valid email" 
                    required
                  />  
                   
                  {/* input validation  dynamic */}  
                  <InputWithValidation
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setPassword(e.target.value);
                      }}
                      validator={(value) =>
                        PWD_REGEX.test(value)  
                      }
                      describedBy="pwdnote"
                      errorMessage={
                        <>
                          8 to 24 characters.<br />
                          Must include uppercase and lowercase letters, a number and special characters.<br />
                          Allowed Special characters: ! @ # $ %
                        </>
                      }
                      required
                    /> 
                 
                 {/* input validation  dynamic */}   
                  <InputWithValidation
                    name="confirm_pwd"
                    placeholder="Confirm Password"
                    value={matchPwd}
                    onChange={(e) => setMatchPwd(e.target.value)}
                    validator={(value) =>
                       PWD_REGEX.test(form.password) && value === form.password
                    }
                    describedBy="confirmnote1"
                    errorMessage={<>Passwords must match</>}
                    required
                  />
                
                <Input name="nameTH" placeholder="nameTH"  value={form.nameTH}  onChange={(e) => setForm({ ...form, nameTH: e.target.value })}/> 
                {/* <Input name="nameEN" placeholder="nameEN"  value={form.nameEN}  onChange={(e) => setForm({ ...form, nameEN: e.target.value })}/> 
                <Input name="nameJP" placeholder="nameJP"  value={form.nameJP}  onChange={(e) => setForm({ ...form, nameJP: e.target.value })}/>  */}
                <Select 
                //className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500  border-gray-300"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }> 
                    {organizations.map((org) => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                </Select>  
                 
                <TextArea
                    placeholder="Additional Information (less than 100 characters)"
                    className="md:col-span-4 h-32"
                  /> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-2 rounded-2xl">
                      <h2 className="font-bold mb-4">Checkbox</h2> 
                      {roles.map((role) => (
                        <Checkbox
                            key={role.code}                        
                            label={role.name}           
                            value={role.name}                 
                            checked={form.role.includes(role.name  )}
                            onChange={(e) =>
                              handleSelectRoleChange(role.name  ,  e.target.checked)
                            }
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
