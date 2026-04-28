 type InputProps = {
  label?: string;
  placeholdercode?: string;
  placeholderdesc?: string;
  name?: string;//   optional
  type?: React.HTMLInputTypeAttribute;//   optional
  placeholder?: string; //   optional
  className?: string; //   optional
};
export const Input = ({ label, type = "text", placeholder }: InputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
export const InputCombo = ({
  type = "text",
  codePlaceholder,
  descPlaceholder,
}: {
  type?: string;
  codePlaceholder?: string;
  descPlaceholder?: string;
}) => ( 
  <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
    <input
      type={type}
      placeholder={codePlaceholder}
      className="border rounded-xl px-4 py-2 w-full md:col-span-3"
    />

    <input
      type={type}
      placeholder={descPlaceholder}
      className="border rounded-xl px-4 py-2 w-full md:col-span-9"
    />
  </div>
);
 
export const Select = ({ label }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select className="border rounded-xl px-4 py-2 w-full outline-none">
      <option>Select option</option>
    </select>
  </div>
);

export const Checkbox = ({ label }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" /> {label}
  </label>
);

export const Radio = ({ label, name }: InputProps) => (
  <label className="flex items-center gap-2">
    <input type="radio" name={name} /> {label}
  </label>
);

export const TextArea = ({ label, placeholder }: InputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea     placeholder={placeholder} className="border rounded-xl px-4 py-2 w-full outline-none" rows={4} />
  </div>
);

export const FileInput = () => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Upload file</label>
    <input type="file" className="border rounded-xl px-4 py-2 w-full" />
  </div>
);

export const Toggle = () => (
  <div className="flex items-center gap-2">
    <input type="checkbox" className="w-5 h-5" />
    <span>Toggle</span>
  </div>
);
// export const FromElements = () => {
// //export default function FromElements() {
//   return (
//     <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Default Inputs</h2> 
//         <Input label="Input" />
//         <Input label="With Placeholder" placeholder="info@gmail.com" />
//         <Select label="Select Input" />
//         <Input label="Password" type="password" />
//         <Input label="Date" type="date" />
//         <Input label="Time" type="time" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Input Group</h2>
//         <Input label="Email" placeholder="info@gmail.com" />
//         <Input label="Phone" placeholder="+1" />
//         <FileInput />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Checkbox</h2>
//         <Checkbox label="Default" />
//         <Checkbox label="Checked" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Radio</h2>
//         <Radio name="r" label="Default" />
//         <Radio name="r" label="Selected" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Textarea</h2>
//         <TextArea label="Description" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="font-bold mb-4">Toggle</h2>
//         <Toggle />
//       </div>
//     </div>
//   );
// }
