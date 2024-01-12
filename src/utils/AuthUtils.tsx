import APIUtils from './APIUtils';
import NavUtils from './NavUtils';

interface RefreshResponse {
  detail?: string;
  access?: string;
}

class AuthUtils {

	static refreshAuth = async (refreshToken: string | null) => {
    let res: any = await APIUtils.callAuth('https://task-api.learninbit.app/api/v1/auth/token/refresh/', {refresh: refreshToken});
    if (res as RefreshResponse && res.detail) {
      AuthUtils.logout();
    }
    if (res.access) {
      localStorage.setItem("access", res.access);
      window.location.reload();
    }
  }

  static verifyAuth = () => {
    if (!AuthUtils.hasAccess) {
      NavUtils.redirectToLogin();
    }
    
    if (
      localStorage.getItem('refresh') &&
      localStorage.getItem('refresh') !== null
    ) {
      AuthUtils.refreshAuth(localStorage.getItem('refresh'));
    }
  }

  static logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    NavUtils.redirectToLogin();
  }

  static hasAccess = () => {
    if (localStorage.getItem('access') === null) {
      return false;
    }
    if (localStorage.getItem('refresh') === null) {
      return false;
    }
    return true;
  }

}

export default AuthUtils;