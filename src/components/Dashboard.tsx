import {useState, useEffect} from 'react';
import APIUtils from '../utils/APIUtils';
import AuthUtils from '../utils/AuthUtils';

import {Results} from '../interfaces/results';

import Header from './Header';
import Categories from './Categories';
import Tasks from './Tasks';
import Modal from './Modal';
import LoadSpinner from './LoadSpinner';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCatManager, setShowCatManager] = useState<boolean>(false);
  const [itemType, setItemType] = useState<string>('');

  const [tasks, setTasks] = useState<Results>({
    count: 0,
    next: '',
    prev: '',
    results: []
  });

  const [cats, setCats] = useState<Results>({
    count: 0,
    next: '',
    prev: '',
    results: []
  });

  const [editItem, setEditItem] = useState<any>(null);

  const fetchCats = async () => {
    let res: any = await APIUtils.callGet('https://task-api.learninbit.app/api/v1/tasks/categories/');
    
    if (res.code === "token_not_valid") {
      AuthUtils.refreshAuth(localStorage.getItem('refresh'));
    }

    setCats(res as Results);
    setIsLoading(false);
    setShowModal(false);
  }

  const updateCatList = (id: string) => {
    let updated = cats.results?.filter(x => {
      return x.id !== id;
    });
    const newCats = {...cats}
    newCats.results = updated;
    setCats(newCats);
  }

  const editCat = (id: string) => {
    let selected = cats.results?.filter(x => {
      return x.id === id;
    });

    setEditItem(selected[0]);
    handleShowModal('Category');
  }

  const editTask = (id: string) => {
    let selected = tasks.results?.filter(x => {
      return x.id === id;
    });

    setEditItem(selected[0]);
    handleShowModal('Task');
  }

  const fetchTasks = async () => {
    let res: any = await APIUtils.callGet('https://task-api.learninbit.app/api/v1/tasks/task/');

    if (res.code === "token_not_valid") {
      AuthUtils.refreshAuth(localStorage.getItem('refresh'));
    }

    setTasks(res as Results);
    setShowModal(false);
  }

  const updateTaskList = (id: string) => {
    let updated = tasks.results?.filter(x => {
      return x.id !== id;
    });
    const newTasks = {...tasks}
    newTasks.results = updated;
    setTasks(newTasks);
  }

  const handleShowModal = (type: string) => {
    setShowModal(true);
    setItemType(type);
  }

  useEffect(() => {
    fetchTasks();
    fetchCats();
  }, []);

  useEffect(() => {
    if (!showModal) {
      setEditItem(null);
    }
  }, [showModal]);

  return (
    <>
      {showModal && (
        <Modal 
          itemType={itemType}
          closeModal={() =>  setShowModal(false)}
          cats={cats}
          editItem={editItem}
          updateTasks={() => fetchTasks()}
          updateCats={() => fetchCats()}
        />
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <LoadSpinner />
        </div>
      )}
      {!isLoading && (
        <>
        <p className="box-border p-2 bg-amber-200 mb-2 max-w-[800px] m-auto rounded-sm">
          <span className="font-bold">ATTN:</span> I started to implement drag and drop on the cards. It is functional upon moving a card to a different column, but the data structure is not ideal for reordering within each column. Visually, you can move them around on the front-end, but I am not saving them because it would quickly throttle the API.</p>
        <Header />
        <div className="flex flex-col-reverse md:flex-row gap-4 max-w-screen-xlg m-auto">
          <Tasks 
            showModal={() => handleShowModal('Task')}
            items={tasks}
            cats={cats}
            showCatManager={() => setShowCatManager(true)}
            showCats={showCatManager}
            update={(id: string) => updateTaskList(id)}
            edit={(id: string) => editTask(id)}
          />
          {showCatManager && (
            <Categories 
              showModal={() => handleShowModal('Category')}
              closeCats={() => setShowCatManager(false)}
              categories={cats}
              update={(id: string) => updateCatList(id)}
              edit={(id: string) => editCat(id)}
            />
          )}
        </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
