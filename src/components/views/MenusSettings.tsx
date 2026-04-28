import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Input,Radio, TextArea, InputCombo} from "@/components/ui-elements";
 
export const MenusSettings = () => {
  const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getMenus = async () => {
            try {
                const response = await axiosPrivate.post('/users', {
                    signal: controller.signal
                });
                const userNames = response.data.map(user => user.username);
                console.log(response.data);
                isMounted && setUsers(userNames);
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
        title="Menus Settings"
        breadcrumbs={[
            { label: "Home", path: "/Home" },
            { label: "Menus Settings" }
        ]}
      />

        {/* Section: Menus Description */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Menus Description</h2>

          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-1">
              <Input placeholder="Code" />
            </div>

            <div className="md:col-span-3">
              <Input placeholder="Name" />
            </div>
          </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Input placeholder="Code" />
              </div>

              <div className="md:col-span-3">
                <Input placeholder="Name" />
              </div>
            </div> */}
             

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
              <h2 className="font-bold mb-4">Radio</h2>
              <Radio name="r" label="Active" />
              <Radio name="r" label="Inactive" />
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <Input placeholder="Code"  className="input md:col-span-14" />  
            <Input placeholder="Name" className="input md:col-span-3" />
            <Input placeholder="Length (CM)" className="input md:col-span-12" />
            <Input placeholder="Width (CM)" className="input md:col-span-4" />
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-bold mb-4">Radio</h2>
              <Radio name="r" label="Default" />
              <Radio name="r" label="Selected" />
            </div>
            <TextArea placeholder="Description" className="input md:col-span-4 h-32" />
          </div> */}
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
