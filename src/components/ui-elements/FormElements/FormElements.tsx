 type InputProps = {
  label?: string;//   optional
  placeholdercode?: string;//   optional
  placeholderdesc?: string;//   optional
  name?: string;//   optional
  type?: React.HTMLInputTypeAttribute;//   optional
  placeholder?: string; //   optional
  className?: string; //   optional
  value?: string; //   optional 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  required?: boolean; //   optional
};
export const Input = ({ label, type = "text", placeholder,name, value, onChange, onFocus, onBlur,required }: InputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value} 
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      required={required}
      className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
export const InputCombo = ({
  type = "text",
  codePlaceholder,
  descPlaceholder,
  namecode,
  namedesc,
  valuecode,
  valuedesc,
  onChangeCode,
  onChangeDesc,
  disabled
}: {
  type?: string;
  codePlaceholder?: string;
  descPlaceholder?: string;
  namecode?: string;
  namedesc?: string;
  valuecode?: string;
  valuedesc?: string; 
  onChangeCode?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDesc?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  
}) => ( 
  <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
    <input
      type={type}
      placeholder={codePlaceholder}
      name={namecode}
      value={valuecode} 
      onChange={onChangeCode}
      className={`border rounded-xl px-4 py-2 w-full md:col-span-3 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      disabled={disabled}   
    />

    <input
      type={type}
      placeholder={descPlaceholder}
      name={namedesc}
      value={valuedesc} 
      onChange={onChangeDesc}
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

export const Checkbox = ({ label, value, checked, onChange }: { label: string; value: string; checked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" value={value} checked={checked} onChange={onChange} /> {label}
  </label>
);

export const Radio = ({ label, name, value, checked, onChange }: {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex items-center gap-2">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} /> {label}
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