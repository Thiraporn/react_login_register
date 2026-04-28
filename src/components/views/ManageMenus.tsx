import { useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { PageHeader, Input,Radio, TextArea, InputCombo} from "@/components/ui-elements";
 
export const ManageMenus = () => { 
    const axiosPrivate = useAxiosPrivate(); 
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getMenus = async () => {
            try {
                
                console.log("GET MENUS: fetching menus...");
                 ;
            } catch (error: any) {
                // console.log(error);
                // navigate('/login', { state: { from: location }, replace: true })
                //console.log("GET USERS ERROR:", error); 
                // if (error?.response?.status === 401 ||
                //     error?.response?.status === 403) {
                //     navigate('/login', { state: { from: location }, replace: true });
                // }

            }
        }
        getMenus();
        return () => {
            isMounted = false;
            controller.abort();
        };

    }, []);

  return (  
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
            <InputCombo codePlaceholder="Code" descPlaceholder="Name" />
            <Input placeholder="Other Description" /> 
            <select className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500">
              <option>Parent Menu</option>
              <option>Menu 1</option>
              <option>Menu 2</option>
            </select> 
              <TextArea
                placeholder="Additional Information (less than 100 characters)"
                className="md:col-span-4 h-32"
              /> 
            <div className="p-2 rounded-2xl">
              <h2 className="font-bold mb-6">Status</h2>
              <Radio name="status" label="Active" />
              <Radio name="status" label="Inactive" />
            </div>
           
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 rounded-xl border">Clear</button>
          <button className="px-5 py-2 rounded-xl bg-blue-600 text-white">
            Publish Menu
          </button>
        </div>
      </div> 
      
    </div> 
    
  );
}
