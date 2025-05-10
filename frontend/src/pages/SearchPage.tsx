import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  return <span>user serach for {city}</span>;
};

export default SearchPage;
