import { useParams } from "react-router";

import LayoutDesign from "./LayoutDesign";

export default function () {

  const { id } = useParams();

  return <LayoutDesign layoutId={id} />

}