import useAxiosPrivate from "@/hooks/useAxiosPrivate";  
import { useModal } from "@/context/ModalProvider";  
import { PageHeader,ToggleSwitch } from "@/components/ui-elements";  
import { useEffect, useState } from "react"; 
type Role = {
  id: string;
  code: string;
  name: string; // USER, ADMIN
};

type Menu = { 
  code: string,
  nameTH: string,
  nameEN: string,
  nameJP: string,
  url: string,
  menuParent: string,
  info: string,
  status: "ACTIVE"
};

type Permission = {
  roleCode: string;
  menuCode: string;
  enabled: boolean
};
 
export const ManagePermissions = () => {
    //  ใช้ context เพื่อ global modal  
    const { showModal, hideModal } = useModal(); 
     
    const axiosPrivate = useAxiosPrivate();

    const [roles, setRoles] = useState<Role[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    // fetch roles from backend
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [rolesRes, menusRes,permissions] = await Promise.all([
            axiosPrivate.get("/roles/all-roles"),
            axiosPrivate.post("/menus/menus-all", {}),
            axiosPrivate.get("/permissions/all-permissions" ),
          ]);

          setRoles(rolesRes.data);
          setMenus(menusRes.data);
          setPermissions(permissions.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }, []); 
      
   //  handle form submit save permissions
    const handleManageRolesSubmit = async (e: any) => { 
      e.preventDefault(); 

      const controller = new AbortController();
 

      try { 
        showModal("loading", "กำลังอัปเดต...");  
        const res = await axiosPrivate.post(
          "/permissions/save-permission", 
          permissions,
          { signal: controller.signal ,withCredentials: true }
        );

        console.log("Saved:", res.data);
        // alert("Save success"); 
        hideModal(); // ปิด loading ก่อน
        showModal("success", "บันทึกสำเร็จ");

        // force re-render (important)
        setPermissions([...permissions]);


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
  
   
  const handleToggle = (roleCode: string, menuCode: string) => {
    setPermissions((prev) => {
      const exists = prev.find(
        (p) => p.roleCode === roleCode && p.menuCode === menuCode
      );

      if (exists) {
        return prev.map((p) =>
          p.roleCode === roleCode && p.menuCode === menuCode
            ? { ...p, enabled: !p.enabled }
            : p
        );
      }

      return [...prev, { roleCode, menuCode, enabled: true }];
    });
  };
  const isEnabled = (roleCode: string, menuCode: string) => {
  return (
      permissions.find(
        (p) => p.roleCode === roleCode && p.menuCode === menuCode
      )?.enabled ?? false
    );
  };
  return (  
    <div className="overflow-hidden">   
    <form className="manage-roles" onSubmit={handleManageRolesSubmit}> 
        <div className="p-6 bg-gray-100 min-h-screen">
          
          <div className="max-w-6xl mx-auto space-y-6">
            <PageHeader
            title="Manage Permissions"
            breadcrumbs={[
                { label: "Home", path: "/Home" },
                { label: "Permissions" }
            ]}
          /> 
            {/* Section: Roles Description */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-4">Manage Permissions</h2>  

               {/* ================= ROLE × MENU MATRIX ================= */}
                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">

                    {/* HEADER */}
                    <div className="sticky top-0 z-10 grid grid-cols-[220px_repeat(6,minmax(120px,1fr))] bg-white border-b text-sm font-semibold">  
                      <div className="p-3">Screen</div>

                      {roles.map((role) => (
                        <div key={role.code} className="p-3 text-center flex items-center justify-center gap-1">
                          {role.name}
                        </div>
                      ))}
                    </div>

                    {/* BODY */}
                    {menus.map((menu, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[220px_repeat(6,minmax(120px,1fr))] border-b items-center hover:bg-gray-50"
                      >
                        {/* MENU NAME */}
                        <div className="p-3 flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 bg-gray-400 rounded-full" />
                          {/* <BarChart3 className="w-4 h-4 text-gray-500" />  */}
                          {menu.nameTH}
                        </div>

                        {/* TOGGLES */}
                       {roles.map((role) => {
                       // const roleCode = role.toLowerCase().replace(" ", "-"); 
                        return (
                          <div key={role.code} className="flex justify-center">
                            <ToggleSwitch
                              value={isEnabled(role.code, menu.code)}
                              onChange={() => handleToggle(role.code, menu.code)}
                            />
                          </div>
                        );
                      })}
                      </div>
                    ))}
                  </div>
                </div>

            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3">
            {/* <button className="px-5 py-2 rounded-xl border">
              Clear
            </button> */}
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white">
              Publish Role
            </button>
            </div>
          </div> 
          
        </div> 
    </form>
    </div>
   );
}
