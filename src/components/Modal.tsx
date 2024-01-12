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
  item: SingleItem,
  updateTasks: () => void,
  updateCats: () => void,
}) => {

  const defaultVals = {
    id: '',
    label: '',
    description: null,
    meta: {
      catID: ''
    }
  }
  
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState<SingleItem>(defaultVals);
  const [isUpdate, setIsUpdate] = useState(false);

  const updateField = (isMeta: boolean, key: string, value: string) => {
    let category: any = {...newItem};
    if (isMeta) {
      category.meta[key] = value;
    }
    if (!isMeta) {
      category[key] = value;
    }
    setNewItem(category);
  }

  const handleCloseModal = () => {
    props.closeModal();
  }

  const handleSave = (type: string) => {
    setIsLoading(true);
    if (isUpdate && props.itemType === 'Category') {
      return updateCategory(type);
    }
    if (isUpdate && props.itemType === 'Task') {
      return updateTask(type);
    }
    createNewItem(type);
  }

  const createNewItem = async (type: string) => {
    let url;
    let payload = newItem;
    delete payload.id;

    if (props.itemType === 'Category') {
      delete payload.meta.catID;
      url = 'https://task-api.learninbit.app/api/v1/tasks/categories/';
    }

    if (props.itemType === 'Task') {
      payload = {...newItem};
      payload.meta.status = "pending";
      url = 'https://task-api.learninbit.app/api/v1/tasks/task/';
    }

    let res = await APIUtils.callPost(url as string, payload);
    // TODO: add error handling

    if (props.itemType === 'Category') {
      props.updateCats();
    }

    if (props.itemType === 'Task') {
      props.updateTasks();
    }

    setIsLoading(false);
  }

  const updateCategory = async (type: string) => {
    delete newItem.id;

    let res = await APIUtils.callPut(`https://task-api.learninbit.app/api/v1/tasks/categories/${props.item?.id}/`, newItem);
    // TODO: add error handling

    props.updateCats();
    props.closeModal();
    setIsLoading(false);
  }

  const updateTask = async (type: string) => {
    delete newItem.id;

    let res = await APIUtils.callPut(`https://task-api.learninbit.app/api/v1/tasks/task/${props.item?.id}/`, newItem);

    props.updateTasks();
    props.closeModal();
    setIsLoading(false);
  }

  useEffect(() => {
    if (props.item) {
      setNewItem(props.item);
      setIsUpdate(true);
    }
  }, [props.item]);

  return (
    <>
    <div className="backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0"></div>
    <div className="flex flex-col gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white box-border p-4 rounded-lg w-5/6 sm:w-1/2 md:w-1/3 lg:w-1/4">
      <h3>
        {isUpdate ? 'Update ' : 'Add New '}
        {props.itemType}
      </h3>
      {props.itemType === 'Task' && (
        <CategoryDropdown 
          placeholder={'Select A Category'}
          options={props.cats.results}
          cats={props.cats}
          selected={props.item?.meta.catID}
          update={(item: SingleItem) => updateField(true, 'catID', item.id as string)}
        />
      )}
      {props.itemType === 'Category' && (
        <ColorDropdown 
          placeholder={'Select A Color'}
          selected={props.item?.meta.color}
          update={(value: string) => updateField(true, 'color', value)}
        />
      )}
      <input className="border rounded-lg text-lg p-2 w-full" type="text" value={newItem.label} onChange={(e) => updateField(false, 'label', e.target.value)} placeholder="Label" />
      <textarea className="border rounded-lg text-lg p-2 w-full" value={newItem.description ? newItem.description : ''} onChange={(e) => updateField(false, 'description', e.target.value)} placeholder="Description"></textarea>
      <div className="flex flex-row-reverse gap-2 w-full">
        <button className="bg-black text-white rounded-lg p-4 py-2 w-full" onClick={() => handleSave(props.itemType)}>
          {isLoading && (
            <div className="flex justify-center">
              <LoadSpinner />
            </div>
          )}
          {!isLoading && (
            isUpdate ? 'Save' : 'Create'
          )}
        </button>
        <button className="bg-slate-300 text-black rounded-lg px-4 py-2 w-full" onClick={() => handleCloseModal()}>Cancel</button>
      </div>
    </div>
    </>
  );
}

export default Modal;
