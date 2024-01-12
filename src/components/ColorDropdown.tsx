import {useState, useEffect} from 'react';

const colorLabels = ['#386c50', '#7a601d', '#dab43d', '#9a4d1b', '#a0392c', '#5b4eac', '#2254c5'];

const ColorDropdown = (props: {
  update: (value: string) => void,
  placeholder: string,
  selected?: string
}) => {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');

  const handleOptionSelect = (value: string) => {
    setShowDropdown(false);
    setSelected(value);
    props.update(value);
  };

  const dropdownClasses = `
    ${showDropdown ? 'absolute top-100 left-0 mt-1 border bg-white w-full' : 'h-0 overflow-hidden'}
  `;

  useEffect(() => {
    if (props.selected) {
      setSelected(props.selected);
    }
  }, [props.selected]);

  return (
    <>
      {
        colorLabels.length > 0 && (
          <div className="bg-slate-100 relative border rounded-lg text-lg p-2 w-full">
            <div className="selected flex" onClick={() => setShowDropdown(true)}>
              <div style={{backgroundColor: `${selected}`}} className="w-10 h-10 rounded-md border"></div>
              <div className="self-center ml-2">
                {selected ? selected : props.placeholder}
              </div>
            </div>
            <div className={dropdownClasses}>
              {colorLabels.map((item: any, index: number) => {
                return(
                  <button key={`color-${index}`} className="flex w-full text-left hover:bg-slate-100" onClick={() => handleOptionSelect(item)}>
                    <div style={{backgroundColor: `${item}`}} className="w-10 h-10"></div>
                    <div className="self-center ml-2">{item}</div>
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

export default ColorDropdown;
