import {useState, useEffect} from 'react';
import APIUtils from '../utils/APIUtils';
import NavUtils from '../utils/NavUtils';
import LoadSpinner from './LoadSpinner';

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateInputs = () => {
    if (!email) {
      setErrorMessage('email address cannot be blank.');
      return false;
    }
    if (!pass) {
      setErrorMessage('password cannot be blank.');
      return false;
    }
    return true;
  }

  const login = async () => {
    setIsLoading(true);

    const isValid = validateInputs();
    if (!isValid) return setIsLoading(false);

    const payload = {
      email: email,
      password: pass
    }

    let res: any = await APIUtils.callAuth('https://task-api.learninbit.app/api/v1/auth/token/', payload);
    if (res.detail) {
      setErrorMessage(res.detail);
      setIsLoading(false);
      return;
    }
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    NavUtils.redirectToDash();
  }

  useEffect(() => {
    if (
      localStorage.getItem('access') !== null &&
      localStorage.getItem('access') !== 'undefined'
    ) {
      NavUtils.redirectToDash();
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen box-border p-4">
      <div className="bg-slate-100 border rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl mb-2">Login</h1>
        {errorMessage && (
          <p className="bg-red-500 rounded-sm text-white p-1 mb-2 text-center">{errorMessage}</p>
        )}
        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium mb-0">
            Username
          </label>
          <input className="border rounded-lg text-lg p-2 w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@address..."/>
        </div>
        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium mb-0">
            Password
          </label>
          <input className="border rounded-lg text-lg p-2 w-full" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="******"/>
        </div>
        <div className="flex justify-end">
          <button onClick={() => login()} className="bg-black text-white rounded-lg px-4 py-2">
            {isLoading ? <LoadSpinner /> : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
