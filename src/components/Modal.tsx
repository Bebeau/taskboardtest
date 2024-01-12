import {useState, useEffect} from 'react';
import APIUtils from '../utils/APIUtils';
import {SingleItem, Results} from '../interfaces/results';

import CategoryDropdown from './CategoryDropdown';
import ColorDropdown from './ColorDropdown';
import LoadSpinner from './LoadSpinner';

const Modal = (props: {
  itemType: string,
  closeModal: () => void,
  cats: Results,
  editItem?: SingleItem,
  updateTasks: () => void,
  updateCats: () => void,
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string | null>(null);
  const [catID, setCatID] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const handleSave = (type: string) => {
    setIsLoading(true);

    if (isEdit && props.itemType === 'Category') {
      return updateCategory();
    }
    if (isEdit && props.itemType === 'Task') {
      return updateTask();
    }
    createNewItem();
  }

  const createNewItem = async () => {
    let url;
    let payload;
    if (props.itemType === 'Category') {
      payload = {
        label: label,
        description: description,
        meta: {
          color: color,
        }
      };
      url = 'https://task-api.learninbit.app/api/v1/tasks/categories/';
    }

    if (props.itemType === 'Task') {
      payload = {
        label: label,
        description: description,
        meta: {
          catID: catID,
          status: 'pending',
        }
      };
      url = 'https://task-api.learninbit.app/api/v1/tasks/task/';
    }
    
    let res: any = await APIUtils.callPost(url as string, payload as any);
    
    if (res.detail) {
      return console.error(res);
    }

    if (props.itemType === 'Category') {
      props.updateCats();
    }

    if (props.itemType === 'Task') {
      props.updateTasks();
    }

    setIsLoading(false);
  }

  const updateCategory = async () => {
    let payload = {
      label: label,
      description: description,
      meta: {
        color: color,
      }
    }
    let res: any = await APIUtils.callPut(`https://task-api.learninbit.app/api/v1/tasks/categories/${props.editItem?.id}/`, payload);
    
    if (res.detail) {
      return console.error(res);
    }

    props.updateCats();
    props.closeModal();
    setIsLoading(false);
  }

  const updateTask = async () => {
    let payload = {
      label: label,
      description: description,
      meta: {
        catID: catID,
        status: props.editItem?.meta.status
      }
    };

    let res: any = await APIUtils.callPut(`https://task-api.learninbit.app/api/v1/tasks/task/${props.editItem?.id}/`, payload);

    if (res.detail) {
      return console.error(res);
    }

    props.updateTasks();
    props.closeModal();
    setIsLoading(false);
  }

  useEffect(() => {
    if (props.editItem) {
      setLabel(props.editItem.label);
      setDescription(props.editItem.description);
      setCatID(props.editItem?.meta?.catID as string);
      setColor(props.editItem?.meta?.color as string);
      setIsEdit(true);
    }
  }, []);

  return (
    <>
    <div className="backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0"></div>
    <div className="flex flex-col gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white box-border p-4 rounded-lg w-5/6 sm:w-1/2 md:w-1/3 lg:w-1/4">
      <h3>
        {props.editItem ? 'Update ' : 'Add New '}
        {props.itemType}
      </h3>
      {props.itemType === 'Task' && (
        <CategoryDropdown 
          placeholder={'Select A Category'}
          options={props.cats.results}
          selected={props.editItem?.meta?.catID}
          updateField={(item: SingleItem) => setCatID(item.id as string)}
        />
      )}
      {props.itemType === 'Category' && (
        <ColorDropdown 
          placeholder={'Select A Color'}
          selected={props.editItem?.meta?.color}
          updateField={(value: string) => setColor(value)}
        />
      )}
      <input className="border rounded-lg text-lg p-2 w-full" type="text" value={label ? label : ''} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
      <textarea className="border rounded-lg text-lg p-2 w-full min-h-48" value={description ? description: ''} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <div className="flex flex-row-reverse gap-2 w-full">
        <button className="bg-black text-white rounded-lg p-4 py-2 w-full" onClick={() => handleSave(props.itemType)}>
          {isLoading && (
            <div className="flex justify-center">
              <LoadSpinner />
            </div>
          )}
          {!isLoading && (
            props.editItem ? 'Save' : 'Create'
          )}
        </button>
        <button className="bg-slate-300 text-black rounded-lg px-4 py-2 w-full" onClick={() =>  props.closeModal()}>Cancel</button>
      </div>
    </div>
    </>
  );
}

export default Modal;
