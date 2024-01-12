import {useState, useEffect} from 'react';
import APIUtils from '../utils/APIUtils';
import {SingleItem, Results} from '../interfaces/results';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';

import CardList from './CardList';

const Tasks = (props: {
  items: Results,
  cats: Results,
  showModal: () => void,
  showCatManager: () => void,
  showCats: boolean,
  update: (id: string) => void,
  edit: (id: string) => void,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [filteredTasks, setFilteredTasks] = useState<any>({
    pending: [],
    active: [],
    complete: []
  });

  const filterTasksByStatus = () => {
    let pending = props.items.results?.filter(x => {
      return x.meta.status === 'pending' || !x.meta.status;
    });

    let active = props.items.results?.filter(x => {
      return x.meta.status === 'active';
    });

    let complete = props.items.results?.filter(x => {
      return x.meta.status === 'complete';
    });

    let filtered = {...filteredTasks};
    filtered.pending = pending;
    filtered.active = active;
    filtered.complete = complete;

    setFilteredTasks(filtered);
  }

  const updateTask = async (id: string, status: string) => {
    let update = props.items.results.filter(x => { return x.id === id})[0];
    update.meta.status = status.toLowerCase();
    let res: any = await APIUtils.callPut(`https://task-api.learninbit.app/api/v1/tasks/task/${id}/`, update);
    if (res.detail) {
      return console.log(res.details);
    }
  }

  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {

    if (destination === undefined || destination === null) return null;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null;
    };

    const startColumn = source.droppableId.toLowerCase();
    const endColumn = destination.droppableId.toLowerCase();
    const start = filteredTasks[startColumn]
    const end = filteredTasks[endColumn]

    if (start === end) {
      const newList = start.filter(
        (_: any, idx: number) => idx !== source.index
      )

      newList.splice(destination.index, 0, start[source.index]);

      let updatedTaskList = {...filteredTasks};
      updatedTaskList[`${endColumn}`] = newList;
      setFilteredTasks(updatedTaskList);

      return null;
    }

    if (start !== end) {
      const newStartList = start.filter(
        (_: any, idx: number) => idx !== source.index
      )

      const newEndList = end
      newEndList.splice(destination.index, 0, start[source.index]);

      updateTask(draggableId, endColumn);

      let updatedTaskList = {...filteredTasks};
      updatedTaskList[`${startColumn}`] = newStartList;
      updatedTaskList[`${endColumn}`] = newEndList;
      setFilteredTasks(updatedTaskList);
      
      return null;
    }
    
  }

  useEffect(() => {
    if (props.items.count > 0) {
      filterTasksByStatus();
    }
  }, [props.items]);

  return (
    <div className="w-full pb-4 box-border">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <h2 className="text-2xl">Tasks</h2>
        <div className="flex gap-2">
          <button className="bg-slate-600 text-white rounded-lg px-4 py-2 grow" onClick={() => props.showModal()}>Add Task</button>
          {!props.showCats && (
            <button className="bg-slate-600 text-white rounded-lg px-4 py-2" onClick={() => props.showCatManager()}>Manage Categories</button>
          )}
        </div>
      </div>
      <p className="box-border p-2 bg-amber-200 mt-2">ATTN: I started to implement drag and drop on the cards. It is functional upon moving a card to a different column, but the data structure is not ideal for reordering within each column. Visually, you can move them around on the front-end, but I am not saving them because it would throttle the API.</p>
      <div className="flex flex-col md:flex-row items-start w-full gap-4 mt-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <CardList 
            status="Pending"
            cards={filteredTasks.pending}
            cats={props.cats}
            showModal={() => props.showModal()}
            update={(id: string) => props.update(id)}
            edit={(id: string) => props.edit(id)}
          />
          <CardList 
            status="Active"
            cards={filteredTasks.active}
            cats={props.cats}
            showModal={() => props.showModal()}
            update={(id: string) => props.update(id)}
            edit={(id: string) => props.edit(id)}
          />
          <CardList 
            status="Complete"
            cards={filteredTasks.complete}
            cats={props.cats}
            showModal={() => props.showModal()}
            update={(id: string) => props.update(id)}
            edit={(id: string) => props.edit(id)}
          />
        </DragDropContext>
      </div>
    </div>
  );
}

export default Tasks;
