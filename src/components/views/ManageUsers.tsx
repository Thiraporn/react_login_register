import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate"; 
import { PageHeader, Input,Radio, TextArea, InputCombo} from "@/components/ui-elements";
import { useAuth } from "@/hooks/useAuth";
 
export const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate(); 
    const { auth } = useAuth();
    useEffect(() => {
        if (!auth?.accessToken) return;
        let isMounted = true;
        const controller = new AbortController();
        const getMenus = async () => {
           try {
                const response = await axiosPrivate.post(
                    '/users',
                    {}, // body
                    { signal: controller.signal ,
                       withCredentials: true
                    } // config
                );
                console.log(response.data);
                // const userNames = response.data.map(user => user.username);
                // isMounted && setUsers(userNames);
            } catch (err) {
                console.log("ERROR:", err);
            }
             
        }
        getMenus();
        return () => {
            isMounted = false;
            controller.abort();
        };

    }, [auth]);

  return (  
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
            {/* Group input code+desc */}
            <InputCombo codePlaceholder="Code" descPlaceholder="Name" />
            <Input placeholder="Other Description" /> 
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500">
                <option>User</option>
                <option>Super User</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Anonymous</option>
              </select>

              <select className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500">
                <option>Organization A</option>
                <option>Organization B</option>
                <option>Organization C</option>
              </select>
            </div>
              
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
            Publish User
          </button>
        </div>
      </div> 
      
    </div> 
    
  );
}
