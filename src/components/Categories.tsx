import {useState, useEffect} from 'react';
import {SingleItem, Results} from '../interfaces/results';
import LoadSpinner from './LoadSpinner';
import APIUtils from '../utils/APIUtils';

import {ReactComponent as EditIcon} from '../assets/img/icons/edit.svg';
import {ReactComponent as DeleteIcon} from '../assets/img/icons/delete.svg';

const Categories = (props: {
  showModal: () => void,
  closeCats: () => void,
  categories: Results,
  edit: (id: string) => void,
  update: (id: string) => void
}) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCat = async (id: string) => {
    setIsDeleting(true);
    let res: any = await APIUtils.callDelete(`https://task-api.learninbit.app/api/v1/tasks/categories/${id}/`);
    
    if (res.detail) {
      return console.log(res.details);
    }

    props.update(id);
    setIsDeleting(false);
  }

  useEffect(() => {
    if (props.categories) {
      setIsLoading(false);
    }
  }, [props.categories]);

  return (
    <aside className="bg-slate-400 box-border p-4 h-auto md:h-screen w-full md:w-1/2 rounded-sm">
      <div className="mb-2">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl">Categories</h2>
          <button className="bg-slate-300 text-black rounded-md px-4 py-2" onClick={() => props.closeCats()}>Close</button>
        </div>
        <button className="bg-black text-white rounded-md px-4 py-2 w-full" onClick={() => props.showModal()}>Add</button>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <LoadSpinner />
        </div>
      )}

      {
        props.categories.count === 0 && (
          <p>No categories created.</p>
        )
      }

      {
        props.categories.count > 0 &&
        props.categories.results && (
          <div className="flex flex-col gap-2 overflow-hidden">
          {props.categories.results.map((item: SingleItem, index: number) => {
            return(
              <div key={`category-${index}`} className="flex gap-1 group">
                
                <button className="flex bg-slate-300 text-black rounded-md p-2 w-full" key={`cat-${index}`} onClick={() => props.edit(item.id as string)}>
                  <div style={{backgroundColor: `${item.meta.color}`}} className="w-2 h-8 bg-slate-400 rounded-md"></div>
                  <div className="self-center ml-2">{item.label}</div>
                </button>
                
                <div className="group-hover:w-auto w-0 overflow-hidden flex gap-1"> 
                  <button className="bg-red-500 rounded-md p-2" onClick={() => deleteCat(item.id as string)}>
                    {isDeleting ? (<LoadSpinner />) : (<DeleteIcon className="w-full max-w-6" />)}
                  </button>
                </div>

              </div>
            )
          })}
          </div>
        )
      }

    </aside>
  );
}

export default Categories;
