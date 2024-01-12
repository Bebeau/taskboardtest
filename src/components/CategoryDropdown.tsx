import {useState, useEffect} from 'react';
import {SingleItem} from '../interfaces/results';
import HelperUtils from '../utils/HelperUtils';

const Dropdown = (props: {
  options: SingleItem[],
  updateField: (item: SingleItem) => void,
  placeholder: string,
  selected?: string
}) => {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const handleOptionSelect = (item: SingleItem) => {
    setShowDropdown(false);
    setSelected(item.label);
    if (item.meta.color) {
      setColor(item.meta.color);
    }
    props.updateField(item);
  };

  useEffect(() => {
    if (props.selected) {
      const cat = HelperUtils.retrieveCategoryByID(props.selected, props.options);
      if (cat && cat.meta) {
        setSelected(cat.label);
        setColor(cat.meta.color as string);
      }
    }
  }, [props.selected, props.options]);

  const dropdownClasses = `
    ${showDropdown ? 'absolute top-100 left-0 mt-1 border bg-white w-full' : 'h-0 overflow-hidden'}
  `;

  return (
    <>
      {
        props.options.length > 0 && (
          <div className="bg-slate-100 relative border rounded-lg text-lg p-2 w-full">
            <div className="selected flex" onClick={() => setShowDropdown(true)}>
              <div style={{backgroundColor: `${color}`}} className="w-10 h-10 rounded-md border"></div>
              <div className="self-center ml-2">
                {selected ? selected : props.placeholder}
              </div>
            </div>
            <div className={dropdownClasses}>
              {props.options.map((category: any, index: number) => {
                return(
                  <button key={`color-${index}`} className="flex w-full text-left hover:bg-slate-100" onClick={() => handleOptionSelect(category)}>
                    <div style={{backgroundColor: `${category.meta.color}`}} className="w-10 h-10"></div>
                    <div className="self-center ml-2">{category.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      }
    </>
  );
}

export default Dropdown;
