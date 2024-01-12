import AuthUtils from '../utils/AuthUtils';

const Header = () => {

  return (
    <div className="flex justify-end mb-2">
      <button className="bg-slate-200 text-black rounded-lg px-4 py-2" onClick={() => AuthUtils.logout()}>Logout</button>
    </div>
  );
}

export default Header;
