import axios from "axios";
const baseUrl = "http://sharetaxi.somee.com/api/";
const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

// handle before call API
const handleBefore = (config) => {
  // handle hành động trước khi call API

  // lấy ra cái token và đính kèm theo cái request
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};
function App(){
  useEffect(() => {
    fetch(`${baseApi}/posts`)
    .then(res => res.json())
    .then(posts => {
    console.log(posts); })
    }, []);
}

api.interceptors.request.use(handleBefore, null);

export default api;