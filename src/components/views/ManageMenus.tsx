import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; //Custom Hook สำหรับเรียก API แบบ authenticated
import { PageHeader, Input, Radio, TextArea, InputCombo, TooltipButton, InputWithValidation } from "@/components/ui-elements";//Custom UI Component
import { useModal } from "@/context/ModalProvider";//Custom Global Modal Context
import { Plus, Save, Pencil, Trash2, AlertCircle } from "lucide-react";
import { ICON_MAP, ICON_KEYS } from "@/components/IconPicker/iconRegistry"//ระบบเก็บ icon ทั้งหมด
import { toPascalCaseUrl, toUpperCaseNoSpace } from "@/utils/commonUtils";
import { AxiosResponse } from "axios";

export const ManageMenus = () => {
  //Control Mode
  const [mode, setMode] = useState<"create" | "edit">("create");
  //  ใช้ context เพื่อ global modal  
  const { showModal, hideModal } = useModal();
  //  init form state + errors state
  const MenuForm = {
    id: null,
    code: "",
    nameTH: "",
    nameEN: "",
    nameJP: "",
    url: "",
    icon: "",
    groupCode: "",
    menuParent: "00",
    info: "",
    status: "ACTIVE"
  };
  const SubMenuForm = {
    id: null,
    code: "",
    nameTH: "",
    nameEN: "",
    nameJP: "",
    url: "",
    icon: "",
    groupCode: "",
    menuParent: "",
    info: "",
    status: "ACTIVE"
  };
  const [errors, setErrors] = useState({});
  //  set form state
  const [form, setForm] = useState({
    ...MenuForm,
  });
  // set form state form sub menu 
  const [subMenus, setSubMenus] = useState<any[]>([]);

  //  axios instance refor auth + baseURL
  const axiosPrivate = useAxiosPrivate();
  //Search State for autocomplete
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);//autocomplete ข้อความที่ user พิมพ์ค้นหา
  const [isSelecting, setIsSelecting] = useState(false);//autocomplete result

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  //fn search autocomplete
  const fetchSuggestions = async (keyword) => {
    if (!keyword) {//ถ้า keyword ว่าง --> clear autocomplete
      setSuggestions([]);
      return [];
    }

    try {
      const res = await axiosPrivate.get(`/menus/autocomplete/search?q=${keyword}`);
      setSuggestions(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  const loadSubMenus = async (code) => {
    const res = await axiosPrivate.get(
      `/menus/datatable/${code}/submenus`
    );
    setSubMenus(
      res.data.map(item => ({
        ...item,
        icon: ICON_KEYS.includes(item.icon)//validate icon
          ? item.icon
          : "",   // หรือ fallback icon
        isEditing: false,//เพิ่ม state frontend ใช้ควบคุม table UI
        isSaved: true//เพิ่ม state frontend ใช้ควบคุม table UI
      }))
    );

  };


  useEffect(() => {
    if (isSelecting) return;//หยุดก่อน ถ้ากำลังเลือก autocomplete 
    if (!query) {//clear ทุกอย่าง ถ้า query ว่าง
      setSuggestions([]);//  clear autocomplete
      setIsSubMenuOpen(false);
      setSubMenus([]); //  clear datatable
      //  clear code ด้วย
      setForm(prev => ({
        ...prev,
        code: ""
      }));
      return;
    }

    const cleanup = handleSearch(query);
    return cleanup;

  }, [query]);

  const handleSearch = (keyword: string) => {
    setQuery(keyword);
    const timer = setTimeout(async () => {//Debounce Search กันยิง API ทุก keypress
      const result = await fetchSuggestions(keyword);//Search
      setSuggestions(result);

      if (result && result.length > 0) {//เปิด submenu section เปิด submenu section และ load
        // เจอ code
        setIsSubMenuOpen(true);

        // (optional) ถ้าต้อง load submenu จาก API จริง 
        //loadSubMenus(result[0].code)

      } else {
        //  ไม่เจอ code
        setIsSubMenuOpen(false);
        setSubMenus([]); // clear datatable 
        setForm(prev => ({ // ไม่มี autocomplete → clear code
          ...prev,
          code: ""
        }));
      }
    }, 300);

    return () => clearTimeout(timer);//Cleanup Timer กัน memory leak
  };

  // const handleSearch = (keyword: string) => {
  //   setQuery(keyword);

  //   const timer = setTimeout(async () => {
  //     const result = await fetchSuggestions(keyword);

  //     setSuggestions(result);

  //     if (!result || result.length === 0) {
  //       setIsSubMenuOpen(false);
  //       setSubMenus([]);
  //       setForm(prev => ({ ...prev, code: "" }));
  //     }
  //   }, 300);

  //   return () => clearTimeout(timer);
  // };

  const handleSelectMenu = async (item: any) => {
    setIsSelecting(true);
    // setForm({
    //   ...form,
    //   code: item.code ?? "",
    //   nameTH: item.nameTH ?? "",
    //   nameEN: item.nameEN ?? "",
    //   nameJP: item.nameJP ?? "",
    //   url: item.url ?? "",
    //   info: item.info ?? "",
    //   status: item.status ?? "ACTIVE"
    // });

    setForm(prev => ({
      ...prev,
      ...item
    }));

    setQuery(item.nameTH);//   sync UI
    setSuggestions([]);
    setMode("edit");

    //   load table ONLY here
    setIsSubMenuOpen(true);
    await loadSubMenus(item.code);

    setTimeout(() => {
      setIsSelecting(false);
    }, 0);
  };





  //first load → generate code   ทำครั้งแรกตอน page render
  useEffect(() => {
    (async () => {
      //const newCode = await getNextParentCode();
      setForm({
        ...MenuForm,
      });
      setMode('create');

    })();
  }, []);

  // Validation function เช็ค field required
  const validate = () => {
    const newErrors: any = {};
    //if (!form.code) newErrors.code = "Code is required"; backend is provided
    if (!form.nameTH) newErrors.nameTH = "Thai name is required";
    if (!form.nameEN) newErrors.nameEN = "English name is required";
    if (!form.groupCode) newErrors.groupCode = "Group code is required";
    if (!form.url) newErrors.url = "URL is required";
    //if (form.code.length < 3) newErrors.code = "Code too short";

    return newErrors;
  };
  //  handle input change for status radio buttons
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value //dynamic field update
    }));
  };
  //  handle form submit save menu parent
  const handleSubmit = async (e: any) => {
    e.preventDefault();//กัน reload page

    const controller = new AbortController();

    const validationErrors = validate();//validate ก่อน
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;//ถ้ามี error หยุด save

    try {
      showModal("loading", "กำลังอัปเดต...");//show user loading modal
      //Depend Control Mode
      let res: AxiosResponse;
      if (mode === "create") {
        res = await axiosPrivate.post(//ส่งข้อมูล form ไป backend
          "/menus/save", form,
          { signal: controller.signal, withCredentials: true }
        );
      } else {
        res = await axiosPrivate.put(//ส่งข้อมูล form ไป backend
          `/menus/edit/${form.id}`, form,
          { signal: controller.signal, withCredentials: true }
        );
      }


      console.log("Saved:", res.data);
      // หลัง save success → Clear Form 
      setForm(prev => ({
        ...prev,
        ...res.data
      }));
      //set mode
      setMode("edit");

      // reload table
      handleSearch(res.data.nameTH);

      // alert("Save success"); 
      hideModal(); // ปิด loading ก่อน
      showModal("success", "บันทึกสำเร็จ");
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

  //เพิ่ม row submenu ใหม่
  const handleAddRow = () => {
    const newRow = {//สร้าง object ใหม่
      ...SubMenuForm,
      //code: `C${Date.now()}`,
      menuParent: form.code,//ผูก parent menu
      groupCode: toUpperCaseNoSpace(form.nameEN) || "",//generate groupCode
      isSaved: false,//state frontend ยังไม่ save 
      isEditing: true,//state frontend กำลัง edit อยู่
      id: null
    };

    setSubMenus(prev => [...prev, newRow]);//append เข้า array
  };

  //save submenu ทีละ row
  const handleSaveRow = async (index: number) => {
    const row = subMenus[index];//ดึง row ปัจจุบัน

    const payload = {//build payload
      ...row,
      menuParent: form.code,
      nameTH: row.nameEN,
      nameJP: row.nameEN,
      groupCode: toUpperCaseNoSpace(form.nameEN) || ""
    };

    try {
      //const res = await axiosPrivate.post("/menus/submenu-save", payload);
      //Depend Control Mode
      let res: AxiosResponse;

      if (!row.isSaved) { // CREATE 
        res = await axiosPrivate.post("/menus/submenu-save", payload);
      } else { // UPDATE 
        res = await axiosPrivate.put(`/menus/submenu-edit/${row.id}`, payload);
      }

      const updated = [...subMenus];//update state
      updated[index] = {
        ...row,
        id: res.data.id,   // ได้ id จาก DB
        isSaved: true,//save แล้ว
        isEditing: false//หยุด edit
      };

      setSubMenus(updated);

    } catch (err) {
      console.error(err);
    }
  };
  //ลบ submenu
  const handleDeleteRow = async (index: number) => {
    const row = subMenus[index];

    //  ถ้ายังไม่ save DB → ลบเลย
    if (!row.isSaved) {
      setSubMenus(prev => prev.filter((_, i) => i !== index));
      return;
    }

    //  ถ้า save DB แล้ว → set inactive  ไม่ได้ delete จริง
    await axiosPrivate.put(`/menus/${row.id}/inactive`);

    const updated = [...subMenus];
    updated[index].status = "INACTIVE";

    setSubMenus(updated);
  };
  //เปิด edit mode
  const handleEditRow = (index: number) => {
    const updated = [...subMenus];
    updated[index].isEditing = true;
    setSubMenus(updated);
  };

  //update field ใน row
  const handleChangeRow = (index, field, value) => {
    setSubMenus(prev =>
      prev.map((row, i) =>//แก้เฉพาะ row ที่เลือก
        i === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };
  //clear parent form
  const handleClearParentMenuForm = () => {
    setForm({ ...MenuForm });
    setQuery("");//เพราะ InputCombo ใช้:valuedesc={query}
    setSuggestions([]);//ล้าง autocomplete dropdown
    setSubMenus([]);//ล้าง table submenu
    setIsSubMenuOpen(false);//ซ่อน section submenu
    setErrors({});//clear err
    setMode("create");
  };

  return (

    <form onSubmit={handleSubmit}>

      <div className="p-6 bg-gray-100 min-h-screen">

        <div className="max-w-6xl mx-auto space-y-6">
          <PageHeader
            title="Menus Management"
            breadcrumbs={[
              { label: "Home", path: "/Home" },
              { label: "Menus Management" }
            ]}
          />

          {/* Section:  Parent Menus  */}
          <div id="parentMenu" className="bg-white rounded-2xl shadow p-6 space-y-4">
            {/* header */}
            {/* <h2 className="text-lg font-semibold mb-4">Menus Management</h2> */}
            {/* MODE BADGE */}
            {/* <div className="flex items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2 py-1 font-medium ${mode === "edit"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
                  }`}
              >
                {mode === "edit"
                  ? "EDIT MODE"
                  : "CREATE MODE"}
              </span>

            </div> */}


            {/* HEADER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              {/* TITLE */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                  Menus Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create and manage application menus
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
            {/* Group input code+desc */}
            <InputCombo
              codePlaceholder="Code"
              descPlaceholder="Name"
              valuecode={form.code}
              onChangeCode={(e) => setForm({ ...form, code: e.target.value })}
              // valuedesc={form.nameTH} 
              valuedesc={query}
              //onChangeDesc={(e) => setForm({ ...form, nameTH: e.target.value })}  
              disabled={true}
              onChangeDesc={(e) => {
                setQuery(e.target.value)  //  hook search 
                setForm(prev => ({
                  ...prev,
                  nameTH: e.target.value
                }))

              }}

              // onBlurDesc={() => {
              //   setTimeout(() => {
              //     setIsSelecting(false);

              //     setForm(prev => ({
              //       ...prev,
              //       nameTH: query
              //     }));
              //   }, 150);
              //   setSuggestions([]);
              // }}
              suggestions={suggestions}
              onSelect={handleSelectMenu}
            // onSelect={(item) => {
            //   setIsSelecting(true);

            //   // setForm({
            //   //   ...form,
            //   //   code: item.code ?? "",
            //   //   nameTH: item.nameTH ?? "",
            //   //   nameEN: item.nameEN ?? "",
            //   //   nameJP: item.nameJP ?? "",
            //   //   url: item.url ?? "",
            //   //   info: item.info ?? "",
            //   //   status: item.status ?? "ACTIVE"
            //   // });
            //   setForm(prev => ({
            //     ...prev,
            //     ...item
            //   }));

            //   setQuery(item.nameTH); //   sync UI
            //   setSuggestions([]);

            //   setMode('edit')

            //   //(optional) ถ้าต้อง load submenu จาก API จริง
            //   loadSubMenus(item.code)

            //   setTimeout(() => {
            //     setIsSelecting(false);
            //   }, 0);
            // }}
            />


            <InputWithValidation name="nameEN" placeholder="English Description" value={form.nameEN} onChange={(e) => setForm({ ...form, nameEN: e.target.value, groupCode: toUpperCaseNoSpace(e.target.value) || "" })} describedBy="pwdnote"
              validator={(value) => value.trim() !== ""}
              errorMessage={
                <>
                  English Description used for automatic Menu Group generation<br />
                </>
              }
              required />
            <Input name="nameJP" placeholder="Japanese Description" value={form.nameJP} onChange={(e) => setForm({ ...form, nameJP: e.target.value })} />
            <Input name="url" placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
              onBlur={(e) =>
                setForm(prev => ({
                  ...prev,
                  url: toPascalCaseUrl(e.target.value)
                }))
              } />
            {/* <select name="menuParent"  className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                     value={form.menuParent}
                     onChange={(e) => setForm({ ...form, menuParent: e.target.value })
                }>
                <option value="00">Parent Menu</option>
                <option value="01">Menu 1</option>
                <option value="02">Menu 2</option>
              </select>  */}
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
            <div className="p-2 rounded-2xl">
              <h2 className="font-bold mb-6">Status</h2>
              <Radio name="status" label="Active" value="ACTIVE" checked={form.status === "ACTIVE"} onChange={handleStatusChange} />
              <Radio name="status" label="Inactive" value="INACTIVE" checked={form.status === "INACTIVE"} onChange={handleStatusChange} />
            </div>

          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button type="button" className="px-5 py-2 rounded-xl border" onClick={handleClearParentMenuForm}>
              Clear
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white"  >
              {mode === "create" ? "Publish Menu" : "Update Menu"}
            </button>
          </div>

          {/* Section: Sub Menus  */}
          {isSubMenuOpen && (
            <div id="subMenu" className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Sub Menus</h2>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-xl"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border rounded-xl overflow-hidden">
                    <thead>


                      <tr className="bg-gray-100">
                        <th className="p-3">Name</th>
                        <th className="p-3">URL</th>

                        <th className="p-3">Icon</th>
                        <th className="p-3 text-center">Preview</th>

                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {subMenus.map((row, index) => {
                        const Icon = row.icon && ICON_MAP[row.icon as keyof typeof ICON_MAP];
                        console.log("row.icon:", row.icon);
                        console.log("normalized:", (row.icon ?? "").trim());
                        console.log(
                          "match:",
                          ICON_KEYS.includes((row.icon ?? "").trim()) //Icon Dynamic Render
                        );

                        return (
                          <tr key={index} className="border-t">

                            {/* NAME */}
                            <td className="p-2">
                              <input
                                name="nameEN"
                                disabled={!row.isEditing}
                                value={row.nameEN || ""}
                                className="w-full border rounded-lg px-2 py-1"
                                onChange={(e) =>
                                  handleChangeRow(index, e.target.name, e.target.value)
                                }
                              />
                            </td>

                            {/* URL */}
                            <td className="p-2">
                              <input
                                name="url"
                                disabled={!row.isEditing}
                                value={row.url || ""}
                                className="w-full border rounded-lg px-2 py-1"
                                onChange={(e) =>
                                  handleChangeRow(index, e.target.name, toPascalCaseUrl(e.target.value))
                                }
                              />
                            </td>

                            {/* ICON */}
                            <td className="p-2">
                              <select
                                className="w-full border rounded-lg px-2 py-1"
                                name="icon"
                                disabled={!row.isEditing}
                                value={ICON_KEYS.includes((row.icon ?? "").trim()) ? (row.icon ?? "").trim() : ""}
                                onChange={(e) =>
                                  handleChangeRow(index, "icon", e.target.value)
                                }
                              >
                                <option value="">-- select --</option>

                                {ICON_KEYS.map((key) => (
                                  <option key={key} value={key}>
                                    {key}
                                  </option>
                                ))}
                              </select>
                            </td>
                            {/* PREVIEW */}
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center">
                                {Icon ? (
                                  <Icon className="w-6 h-6" strokeWidth={1.25} />
                                ) : (
                                  "-"
                                )}
                              </div>
                            </td>

                            {/* STATUS */}
                            <td className="p-2">
                              <select
                                name="status"
                                disabled={!row.isEditing}
                                value={row.status}
                                className="w-full border rounded-lg px-2 py-1"
                                onChange={(e) =>
                                  handleChangeRow(index, e.target.name, e.target.value)
                                }
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </td>

                            {/* ACTION */}
                            <td className="p-2">
                              <div className="flex gap-2 justify-center items-center">

                                {row.isEditing ? (
                                  <TooltipButton
                                    icon={Save}
                                    label="Save"
                                    className="text-blue-500"
                                    onClick={() => handleSaveRow(index)}
                                  />
                                ) : (
                                  <TooltipButton
                                    icon={Pencil}
                                    label="Edit"
                                    className="text-"
                                    onClick={() => handleEditRow(index)}
                                  />
                                )}

                                <TooltipButton
                                  icon={Trash2}
                                  label="Delete"
                                  onClick={() => handleDeleteRow(index)}
                                  className="text-red-500"
                                />

                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </form>

  );
}
