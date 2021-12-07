let baseUrl = '';
let baseApi = '';
let baseImgPath;
let publicPath

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://127.0.0.1:8035/';
	baseApi = 'http://127.0.0.1:8035/api/';
  baseImgPath = 'http://127.0.0.1:8035/img/';
	publicPath = '/'
}else{
	baseUrl = 'http://121.5.123.5:8035/';
	baseApi = 'http://121.5.123.5:8035/api/';
  baseImgPath = 'http://121.5.123.5:8035/img/';
	publicPath = '/shopping-manage/'
}

export {
	baseUrl,
	baseImgPath,
	baseApi,
	publicPath
}