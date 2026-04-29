export default function ModalUI({ modal }) {
  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    loading: "bg-indigo-500",
  };

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
    loading: "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[300px] text-center animate-fadeIn">
        
        {/* Spinner */}
        {modal.type === "loading" && (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Icon */}
        {modal.type !== "loading" && (
          <div
            className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full text-white text-xl mb-3 ${colorMap[modal.type]}`}
          >
            {iconMap[modal.type]}
          </div>
        )}

        {/* Message */}
        <p className="text-gray-700 font-medium">
          {modal.message || "Processing..."}
        </p>
      </div>
    </div>
    
  );
}

// export default function ModalUI({ open, type, title, message, onClose }: any) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">

//         {/* Icon */}
//         {type === "error" && (
//           <div className="text-red-500 text-3xl">⚠</div>
//         )}

//         {/* Title */}
//         <h3 className="text-lg font-bold mt-2">{title}</h3>

//         {/* Message */}
//         <p className="text-sm text-gray-500 mt-2">{message}</p>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             onClick={onClose}
//             className="px-3 py-1 rounded bg-gray-200"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onClose}
//             className="px-3 py-1 rounded bg-red-600 text-white"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// <!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
// <!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
// <button command="show-modal" commandfor="dialog" class="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10">Open dialog</button>
// <el-dialog>
//   <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
//     <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

//     <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
//       <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
//         <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//           <div class="sm:flex sm:items-start">
//             <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-red-600">
//                 <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
//               </svg>
//             </div>
//             <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//               <h3 id="dialog-title" class="text-base font-semibold text-gray-900">Deactivate account</h3>
//               <div class="mt-2">
//                 <p class="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//           <button type="button" command="close" commandfor="dialog" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
//           <button type="button" command="close" commandfor="dialog" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
//         </div>
//       </el-dialog-panel>
//     </div>
//   </dialog>
// </el-dialog>
