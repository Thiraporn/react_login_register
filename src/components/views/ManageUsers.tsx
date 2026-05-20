import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { PageHeader, Input, Radio, TextArea, Checkbox, Select, InputWithValidation, InputCombo, InputSearch } from "@/components/ui-elements";
import { useModal } from "@/context/ModalProvider";
import { AlertCircle } from "lucide-react";
import { AxiosResponse } from "axios";


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
  //Control Mode
  const [mode, setMode] = useState<"create" | "edit">("create");
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
    id: null,
    username: "",
    password: "",
    nameTH: "",
    //nameEN: "",
    //nameJP: "",
    // refreshTokens: [] as string[],
    role: [] as string[],
    organization: "",
    status: "ACTIVE",
    info: ""
  };
  //state for form errors
  const [errors, setErrors] = useState({});
  //  set form state
  const [form, setForm] = useState({
    ...ManageUsers,
  });
  //Search State for autocomplete
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);//autocomplete ข้อความที่ user พิมพ์ค้นหา
  const [isSelecting, setIsSelecting] = useState(false);//autocomplete result ที่ user กำลังเลือกอยู่หรือไม่


  //set form to default + generate new code  ==> ใช้ตอนแรก load หน้า + หลัง save สำเร็จ เพื่อเคลียร์ form + generate code ใหม่
  const clearForm = () => {
    setForm({
      ...ManageUsers
    });

    setErrors({});
    setMode("create");
    setSuggestions([]);
    setQuery("");
    setIsSelecting(false);

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
    if (!form.role || form.role.length === 0) {
      newErrors.role = "At least one role is required";
    }   // else if (form.role.some((r) => !["USER", "SUPERUSER", "ADMIN", "EDITOR", "ANONYMOUS"].includes(r))) {
    //   newErrors.role = "Invalid role selected";
    // }

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
        roles: Object.fromEntries(form.role.map((r) => [r, r])), // แปลง array เป็น object เช่น ["USER", "ADMIN"] => { USER: "USER", ADMIN: "ADMIN" }
      };

      //Depend Control Mode
      let res: AxiosResponse;
      if (mode === "create") {
        res = await axiosPrivate.post(//ส่งข้อมูล form ไป backend
          "/users/save-user", payload,
          { signal: controller.signal, withCredentials: true }
        );
      } else {
        res = await axiosPrivate.put(//ส่งข้อมูล form ไป backend
          `/users/edit/${form.id}`, payload,
          { signal: controller.signal, withCredentials: true }
        );
      }

      console.log("Saved:", res.data);
      // alert("Save success"); 
      hideModal(); // ปิด loading ก่อน 
      showModal("success", mode === "create" ? "User created successfully" : "User updated successfully");
      clearForm();

      setMode("create");
      setSuggestions([]);

      setTimeout(() => {
        hideModal();
      }, 1200);



    } catch (err: any) {
      hideModal();
      showModal("error", err?.response?.data?.message ? err.response.data.message : "Save failed");
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err?.response?.status);
      console.log("DATA:", err?.response?.data);
      console.log("MESSAGE:", err?.response?.data?.message);
      setTimeout(() => {
        hideModal();
      }, 1800);
    }


  };
  //fn search autocomplete
  const fetchSuggestions = async (keyword) => {
    if (!keyword) {//ถ้า keyword ว่าง --> clear autocomplete
      setSuggestions([]);
      return [];
    }

    try {
      const res = await axiosPrivate.get(`/users/autocomplete/search?q=${keyword}`);
      setSuggestions(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleSearch = (keyword: string) => {
    const timer = setTimeout(async () => {//Debounce Search กันยิง API ทุก keypress
      const result = await fetchSuggestions(keyword);//Search 

      if (result && result.length > 0) {
        // เจอ code
        // FOUND → switch to EDIT
        setMode("edit");
        setSuggestions(result);

        // setForm(prev => ({
        //   ...prev,
        //   username: result.username ?? "",
        //   password: "",
        //   nameTH: result.nameTH ?? "",
        //   role: result.roles ? Object.keys(result.roles) : [],
        //   organization: result.organization ?? "",
        //   status: result.status ?? "ACTIVE"
        // }));


      } else {
        //  ไม่เจอ code
        // NOT FOUND → CREATE
        setMode("create");
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);//Cleanup Timer กัน memory leak
  };
  //  เมื่อ user เลือก autocomplete result ให้ populate form และ switch mode เป็น edit
  useEffect(() => {
    if (isSelecting) return;//หยุดก่อน ถ้ากำลังเลือก autocomplete 
    if (!query) {//clear ทุกอย่าง ถ้า query ว่าง
      setSuggestions([]);//  clear autocomplete  
      //  clear code ด้วย
      setForm(prev => ({
        ...prev,
        username: ""
      }));
      return;
    }

    const cleanup = handleSearch(query);
    return cleanup;

  }, [query]);
  //  เมื่อ user เลือก autocomplete result ให้ populate form และ switch mode เป็น edit
  const handleSelectSuggestion = (user: any) => {
    setIsSelecting(true);
    if (!user) return;
    // switch mode
    setMode("edit");
    // fill form
    setForm(prev => ({
      ...prev,
      id: user.id ?? null,
      username: user.username ?? "",
      password: user.username ?? "", //  ตั้ง password เป็น username ชั่วคราว เพื่อให้ผ่าน validation ถ้า user ไม่ได้แก้ password จะได้ไม่เด้ง error ว่า password ไม่ถูกต้อง
      nameTH: user.nameTH ?? "",
      role: user.roles
        ? Object.keys(user.roles)
        : [],
      organization: user.organization ?? "",
      status: user.status ?? "ACTIVE",
      info: user.info ?? ""
    }));

    // fill search input
    setQuery(user.username ?? "");

    // close dropdown
    setSuggestions([]);

    // clear validation errors
    setErrors({});

    // delay เล็กน้อยก่อนเปิดให้ search ใหม่ เพื่อป้องกันการยิง API ซ้ำตอนเลือก autocomplete
    setTimeout(() => {
      setIsSelecting(false);
    }, 0);
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
            {/* Section: Users Search */}
            <div id="searchUsers" className="bg-white rounded-2xl shadow p-6 space-y-4">
              {/* <h2 className="text-lg font-semibold mb-4">Search Users</h2> */}

              <InputSearch
                label="Search Users"
                placeholder="Search username or name..."
                value={query}
                // mode={mode}
                suggestions={suggestions.map((user) => ({
                  code: user.username,
                  nameTH: user.nameTH,
                  dataObject: user
                }))}
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onSelect={(user) => handleSelectSuggestion(user ? user.dataObject : null)}
              />

              {/* Group input code+desc */}
              {/* <InputCombo
                codePlaceholder="Username or Email"
                descPlaceholder="Search Username/Name TH"
                disabled={true}
                onChangeCode={(e) => setForm({ ...form, username: e.target.value })}
                onChangeDesc={(e) => {
                  setQuery(e.target.value); // Update the search query
                  handleSearch(e.target.value);
                }}
                suggestions={suggestions}
              /> */}
            </div>
            {/* Section: Users Description */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              {/* <h2 className="text-lg font-semibold mb-4">Users Management</h2> */}
              {/* HEADER */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                {/* TITLE */}
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                    Users Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Create and manage application users
                  </p>
                </div>
                {/* MODE BADGE */}
                <div className="flex items-center">
                  <span
                    className={` inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide shadow-sm border ${mode === "edit"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>

                    {/* STATUS DOT */}
                    <span
                      className={`h-2 w-2 rounded-full${mode === "edit"
                        ? "bg-amber-500"
                        : "bg-emerald-500"}`} />  {mode === "edit" ? "EDIT MODE" : "CREATE MODE"}
                  </span>

                </div>

              </div>
              {/* ⚠️ WARNING BOX */}
              {Object.keys(errors).length > 0 && (
                <div role="alert" className=" flex flex-col sm:flex-row  sm:items-start  gap-2 sm:gap-3  p-4 mb-4  text-sm rounded-xl border bg-red-50 border-red-200 text-red-700  ">

                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-red-500" />

                  <div className="flex flex-col">
                    <span className="font-semibold">
                      Please fix the following errors:
                    </span>

                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {Object.values(errors).map((msg: any, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
              }

              {/* Details */}
              {/* input validation  dynamic */}
              <InputWithValidation
                name="username"
                placeholder="Email Address"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  setEmailSignup(e.target.value);
                }}
                validator={(value) => EMAIL_REGEX.test(value)}
                validator-describedBy="uidnote"
                validator-errorMessage="Please enter a valid email"
                required
                disabled={mode === "edit"}

              />
              {/* ห้าม update ในนี้ ---> future feature : change password */}
              {mode === "create" && (
                <>
                  {/* input validation  dynamic */}
                  < InputWithValidation
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

                </>
              )}





              <Input name="nameTH" placeholder="nameTH" value={form.nameTH} onChange={(e) => setForm({ ...form, nameTH: e.target.value })} />
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
                value={form.info}
                onChange={(e) => {
                  console.log("info:", e.target.value);

                  setForm(prev => ({
                    ...prev,
                    info: e.target.value
                  }));
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-2 rounded-2xl">
                  <h2 className="font-bold mb-4">Checkbox</h2>
                  {roles.map((role) => (
                    <Checkbox
                      key={role.code}
                      label={role.name}
                      value={role.name}
                      checked={form.role.includes(role.name)}
                      onChange={(e) =>
                        handleSelectRoleChange(role.name, e.target.checked)
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
