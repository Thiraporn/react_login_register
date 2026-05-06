import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { PageHeader, Input,Radio, TextArea, InputCombo, TooltipButton} from "@/components/ui-elements";
import { useModal } from "@/context/ModalProvider"; 
import { Plus,  Save, Pencil, Trash2  } from "lucide-react";
import {ICON_MAP, ICON_KEYS } from "@/components/IconPicker/iconRegistry" 
 
export const ManageMenus = () => {
  //  ใช้ context เพื่อ global modal  
  const { showModal, hideModal } = useModal(); 
  //  init form state + errors state
  const MenuForm = {
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
 
    const [query, setQuery] = useState("");  
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    const fetchSuggestions = async (keyword) => {
      if (!keyword) {
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
          icon: ICON_KEYS.includes(item.icon)
            ? item.icon
            : "",   // หรือ fallback icon
          isEditing: false,
          isSaved: true
        }))
      );
      
    };
 
   useEffect(() => {
      if (isSelecting) return;
      if (!query) {
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

      const timer = setTimeout(async () => {
      const result = await fetchSuggestions(query);

      if (result && result.length > 0) {
        // เจอ code
        setIsSubMenuOpen(true);

        // (optional) ถ้าต้อง load submenu จาก API จริง 
        loadSubMenus(result[0].code)

      } else {
        //  ไม่เจอ code
        setIsSubMenuOpen(false);
        setSubMenus([]); // clear datatable 
        setForm(prev => ({ //  สำคัญ: ไม่มี autocomplete → clear code
          ...prev,
          code: ""
        }));
      }
    }, 300);

     return () => clearTimeout(timer);
    }, [query]);

    

    //first load → generate code
    useEffect(() => {
      (async () => {
        //const newCode = await getNextParentCode();
        setForm({
        ...MenuForm,
        });

      })();
    }, []);

    // Validation function
    const validate = () => {
      const newErrors: any = {}; 
      if (!form.code) newErrors.code = "Code is required";
      if (!form.nameTH) newErrors.nameTH = "Thai name is required";
      if (!form.nameEN) newErrors.nameEN = "English name is required";
      // if (!form.nameJP) newErrors.nameJP = "Japanese name is required";
      //if (form.code.length < 3) newErrors.code = "Code too short";

      return newErrors;
    };
    //  handle input change for status radio buttons
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    };
    //  handle form submit save menu
    const handleSubmit = async (e: any) => { 
      e.preventDefault(); 

      const controller = new AbortController();

      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) return;

      try { 
        showModal("loading", "กำลังอัปเดต...");
        const res = await axiosPrivate.post(
          "/menus/save",
          form,
          { signal: controller.signal ,withCredentials: true }
        );

        console.log("Saved:", res.data);
        // alert("Save success"); 
        hideModal(); // ปิด loading ก่อน
        showModal("success", "บันทึกสำเร็จ");
        setTimeout(() => {
          hideModal();
        }, 1200);

        // หลัง save success → Clear Form
        setForm({
        ...MenuForm,
        });

      } catch (err: any) {
        hideModal();
        showModal("error", "Save failed");
        console.log(err); 
        setTimeout(() => {
          hideModal();
        }, 1200);
      }
    };
  
    
    const handleAddRow = () => {
      const newRow = {
        ...SubMenuForm,
        //code: `C${Date.now()}`,
        menuParent: form.code,
        groupCode: form.nameEN?.toUpperCase() || "",
        isSaved: false,
        isEditing: true,
        id: null
      };

      setSubMenus(prev => [...prev, newRow]);
    };
    const handleSaveRow = async (index: number) => {
        const row = subMenus[index];

        const payload = {
          ...row,
          menuParent: form.code,
          groupCode: form.nameEN?.toUpperCase() || ""
        };

        try {
          const res = await axiosPrivate.post("/menus/submenu-save", payload);

          const updated = [...subMenus];
          updated[index] = {
            ...row,
            id: res.data.id,   // ได้ id จาก DB
            isSaved: true,
            isEditing: false
          };

          setSubMenus(updated);

        } catch (err) {
          console.error(err);
        }
      };
      const handleDeleteRow = async (index: number) => {
        const row = subMenus[index];

        //  ยังไม่ save → ลบเลย
        if (!row.isSaved) {
          setSubMenus(prev => prev.filter((_, i) => i !== index));
          return;
        }

        //  save แล้ว → set inactive
        await axiosPrivate.put(`/menus/${row.id}/inactive`);

        const updated = [...subMenus];
        updated[index].status = "INACTIVE";

        setSubMenus(updated);
      }; 
      const handleEditRow = (index: number) => {
        const updated = [...subMenus];
        updated[index].isEditing = true;
        setSubMenus(updated);
      };

    
      const handleChangeRow = (index, field, value) => {
        setSubMenus(prev =>
          prev.map((row, i) =>
            i === index
              ? { ...row, [field]: value }
              : row
          )
        );
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
            <h2 className="text-lg font-semibold mb-4">Menus Management</h2>  
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
                  onChangeDesc={(e) => setQuery(e.target.value)} //  hook search 
                  suggestions={suggestions}
                  onSelect={(item) => {
                    setIsSelecting(true);
                    setForm({
                      ...form,
                      code: item.code,
                      nameTH: item.nameTH,
                    });

                    setQuery(item.nameTH); //   sync UI
                    setSuggestions([]);
                    
                    setTimeout(() => {
                        setIsSelecting(false);
                      }, 0);
                    }}
                />


              <Input name="nameEN" placeholder="English Description"  value={form.nameEN}  onChange={(e) => setForm({ ...form, nameEN: e.target.value })}/> 
              <Input name="nameJP" placeholder="Japanese Description"  value={form.nameJP}  onChange={(e) => setForm({ ...form, nameJP: e.target.value })}/> 
              <Input name="url" placeholder="URL"  value={form.url}  onChange={(e) => setForm({ ...form, url: e.target.value })}/> 
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
                  value={form.info} onChange={(e) => setForm({ ...form, info: e.target.value })}
                /> 
              <div className="p-2 rounded-2xl">
                <h2 className="font-bold mb-6">Status</h2>
                <Radio name="status" label="Active" value="ACTIVE" checked={form.status === "ACTIVE"} onChange={handleStatusChange} />
                <Radio name="status" label="Inactive" value="INACTIVE" checked={form.status === "INACTIVE"} onChange={handleStatusChange} />
              </div>
            
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2 rounded-xl border" onClick={async () => {setForm({...MenuForm});}}>
              Clear
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white">
              Publish Menu
            </button>
          </div>

          {/* Section: Sub Menus  */}
          {isSubMenuOpen && (
          <div  id="subMenu"  className="bg-white rounded-2xl shadow p-6 space-y-4">
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
                     const Icon =  row.icon && ICON_MAP[row.icon as keyof typeof ICON_MAP];
                     console.log("row.icon:", row.icon);
                     console.log("normalized:", (row.icon ?? "").trim());
                     console.log(
                        "match:",
                        ICON_KEYS.includes((row.icon ?? "").trim())
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
                              handleChangeRow(index, e.target.name, e.target.value)
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
