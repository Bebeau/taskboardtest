import {useState, useEffect} from 'react';
import {SingleItem, Results} from '../interfaces/results';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import LoadSpinner from './LoadSpinner';
import APIUtils from '../utils/APIUtils';
import HelperUtils from '../utils/HelperUtils';
import {ReactComponent as DeleteIcon} from '../assets/img/icons/delete.svg';

const CardList = (props: {
  status: string,
  cards: SingleItem[],
  cats: Results,
  showModal: () => void,
  update: (id: string) => void,
  edit: (id: string) => void,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteTask = async (id: string) => {
    setIsDeleting(true);
    let res: any = await APIUtils.callDelete(`https://task-api.learninbit.app/api/v1/tasks/task/${id}/`);
    if (res.detail) {
      return console.log(res.details);
    }
    props.update(id);
    setIsDeleting(false);
  }

  useEffect(() => {
    if (props.cards) {
      setIsLoading(false);
    }
  }, [props.cards]);
  
  return (
    <Droppable droppableId={props.status}>
      {(provided) => (
        <div className="bg-slate-100 w-full box-border p-2 rounded-sm">
          <h3 className="text-lg self-center font-bold">
            {props.status === 'Pending' && (<>Backlog</>)}
            {props.status === 'Active' && (<>In Progress</>)}
            {props.status === 'Complete' && (<>Done</>)}
          </h3>
          <div 
            id={props.status}
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="flex flex-col gap-2 mt-2 overflow-hidden"
          >
          {isLoading && (
            <LoadSpinner />
          )}
          {
            !isLoading &&
            props.cards &&
            props.cards.length > 0 &&
            props.cards.map((item: SingleItem, index: number) => {
              return(
                <Draggable draggableId={item.id ? item.id : ''} index={index} key={item.id}>
                  {provided => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex gap-2 group"
                      >
                      <div className="flex border bg-slate-200 rounded-md box-border p-2 w-full" onClick={() => props.edit(item.id as string)}>
                        <div style={{backgroundColor: `${HelperUtils.retrieveColorHex(item?.meta?.catID as string, props.cats)}`}} className="w-2 h-auto bg-slate-400 rounded-md"></div>
                        <div className="self-center ml-2 w-full">
                          <h4 className="font-medium">{item.label}</h4>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                      </div>
                      <button className="bg-red-500 rounded-md w-0 group-hover:w-auto overflow-hidden" onClick={() => deleteTask(item.id as string)}>
                        <span className="block p-2">
                          {isDeleting ? (<LoadSpinner />) : (<DeleteIcon className="w-full max-w-6" />)}</span> 
                      </button>
                    </div>
                  )}
                </Draggable>
              )
            })
          }
          {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default CardList;
