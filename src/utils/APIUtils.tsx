const auth = `Bearer ${localStorage.getItem('access')}`;

class APIUtils {

	static callAuth = (endpoint: string, payload: object) => {
		return new Promise((resolve, reject) => {
			fetch(`${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payload),
				credentials: 'include',
			})
			.then(res => res.json())
			.then(json => {
				resolve(json);
			}).catch(err => {
				reject(err);
			});
		});
	}

	static callGet = (endpoint: string) => {
		return new Promise((resolve, reject) => {
			fetch(`${endpoint}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Authorization: auth 
				}
			})
			.then(res => res.json())
			.then(json => {
				resolve(json);
			})
			.catch(err => {
				reject(err);
			});
		});
	}

	static callPost = (endpoint: string, payload: object) => {
		return new Promise((resolve, reject) => {
			fetch(`${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: auth
				},
				body: JSON.stringify(payload),
				credentials: 'include'
			})
			.then(res => res.json())
			.then(json => {
				resolve(json);
			}).catch(err => {
				reject(err);
			});
		});
	}

	static callPut = (endpoint: string, payload: object) => {
		return new Promise((resolve, reject) => {
			fetch(`${endpoint}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: auth 
				},
				body: JSON.stringify(payload),
				credentials: 'include',
				redirect: 'follow'
			})
			.then(res => res.json())
			.then(json => {
				resolve(json);
			}).catch(err => {
				reject(err);
			});
		});
	}

	static callDelete = (endpoint: string) => {
		return new Promise((resolve, reject) => {
			fetch(`${endpoint}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: auth 
				},
				credentials: 'include',
				redirect: 'follow'
			})
			.then(res => {
				if (res.ok && res.status === 204) {
					resolve('deleted');
				}
			})
			.catch(err => {
				reject(err);
			});
		});
	}
}

export default APIUtils;