import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../ui-elements/PageHeader/PageHeader";

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
            { label: "Home", path: "/" },
            { label: "Menus Settings" }
        ]}
      />

        {/* Section: Product Description */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Products Description</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Product Name" className="input" />
            <select className="input">
              <option>Select Category</option>
            </select>

            <select className="input">
              <option>Select Brand</option>
            </select>
            <select className="input">
              <option>Select Color</option>
            </select>

            <input placeholder="Weight (KG)" className="input" />
            <input placeholder="Length (CM)" className="input" />
            <input placeholder="Width (CM)" className="input md:col-span-2" />

            <textarea
              placeholder="Description"
              className="input md:col-span-2 h-32"
            />
          </div>
        </div>

        {/* Section: Pricing */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Availability</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Weight (KG)" className="input" />
            <input placeholder="Length (CM)" className="input" />
            <input placeholder="Width (CM)" className="input" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

            {/* Quantity */}
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                //onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 bg-gray-100"
              >
                -
              </button>
              {/* <div className="flex-1 text-center">{quantity}</div> */}
              <button
                //onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-gray-100"
              >
                +
              </button>
            </div>

            <select className="input">
              <option>Select Availability</option>
            </select>
          </div>
        </div>

        

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 rounded-xl border">Draft</button>
          <button className="px-5 py-2 rounded-xl bg-blue-600 text-white">
            Publish Product
          </button>
        </div>
      </div> 
      
    </div> 
    
  );
}
