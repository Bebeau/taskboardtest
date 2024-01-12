class NavUtils {
	static redirectToLogin = () => {
		if (window.location.href !== '/') {
			window.location.href = '/';
		}
	}
	static redirectToDash = () => {
		if (window.location.href !== '/dashboard') {
			window.location.href = '/dashboard';
		}
	}
}

export default NavUtils;
