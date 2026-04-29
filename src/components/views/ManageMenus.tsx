import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { PageHeader, Input,Radio, TextArea, InputCombo} from "@/components/ui-elements";
import { useModal } from "@/context/ModalProvider";

 
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
        menuParent: "",
        info: "",
        status: "ACTIVE"
    };
    const [errors, setErrors] = useState({});
    //  set form state
    const [form, setForm] = useState({
       ...MenuForm,
      });

    //  axios instance refor auth + baseURL
    const axiosPrivate = useAxiosPrivate();   

    //set form to default + generate new code  ==> ใช้ตอนแรก load หน้า + หลัง save สำเร็จ เพื่อเคลียร์ form + generate code ใหม่
    const clearForm = (newCode: string) => {
      setForm({
        ...MenuForm,
          code: newCode
        });

        setErrors({});
    };

    //first load → generate code
    useEffect(() => {
      (async () => {
        const newCode = await getNextCode();
        clearForm(newCode);
      })();
    }, []);

    // Validation function
    const validate = () => {
      const newErrors: any = {}; 
      if (!form.code) newErrors.code = "Code is required";
      if (!form.nameTH) newErrors.nameTH = "Thai name is required";
      if (!form.nameEN) newErrors.nameEN = "English name is required";
      // if (!form.nameJP) newErrors.nameJP = "Japanese name is required";
      if (form.code.length < 3) newErrors.code = "Code too short";

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

        //  หลัง save success → generate code ใหม่
        const newCode = await getNextCode();
        clearForm(newCode);

      } catch (err: any) {
        hideModal();
        showModal("error", "Save failed");
        console.log(err); 
        setTimeout(() => {
          hideModal();
        }, 1200);
      }
    };
  
    //  function to get next menu code by getting count from backend + generate code
    const  getNextCode = async () : Promise<string> => { 
     let nextCode = "";
     const controller = new AbortController(); 
      try {  
        const response = await axiosPrivate.post(
                    "/menus/count",
                    {}, // body
                    { signal: controller.signal ,
                       withCredentials: true
                    } // config
                );
               
        const count = response.data;
        nextCode = `M${String(count + 1).padStart(4, "0")}`;  

      } catch (err: any) {
        console.error("Error getting count:", err); 
      }
      return nextCode;
      
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

          {/* Section: Menus Description */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Menus Management</h2>  
              {/* Group input code+desc */}
              <InputCombo codePlaceholder="Code"   descPlaceholder="Name"  valuecode={form.code} onChangeCode={(e) => setForm({ ...form, code: e.target.value })} valuedesc={form.nameTH} onChangeDesc={(e) => setForm({ ...form, nameTH: e.target.value })}  disabled={true}  />
              <Input name="nameEN" placeholder="English Description"  value={form.nameEN}  onChange={(e) => setForm({ ...form, nameEN: e.target.value })}/> 
              <Input name="nameJP" placeholder="Japanese Description"  value={form.nameJP}  onChange={(e) => setForm({ ...form, nameJP: e.target.value })}/> 
              <Input name="url" placeholder="URL"  value={form.url}  onChange={(e) => setForm({ ...form, url: e.target.value })}/> 
              <select name="menuParent"  className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500">
                <option value="00">Parent Menu</option>
                <option value="01">Menu 1</option>
                <option value="02">Menu 2</option>
              </select> 
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
            <button className="px-5 py-2 rounded-xl border" onClick={async () => clearForm(await getNextCode())}>
              Clear
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white">
              Publish Menu
            </button>
          </div>
        </div> 
        
      </div> 
    </form>
    
  );
}
