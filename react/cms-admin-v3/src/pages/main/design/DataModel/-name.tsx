import { useParams } from "react-router";
import ModelDataList from "./components/ModelDataList";

const DataManagePage: React.FC = () => {
    const { name } = useParams();
    return <ModelDataList name={name} />
}

export default DataManagePage;