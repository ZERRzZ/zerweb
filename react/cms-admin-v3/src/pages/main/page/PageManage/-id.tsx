import { useParams } from "react-router";

import PageDesign from "./PageDesign";

export default function () {

  const { id } = useParams();

  return <PageDesign pageId={id} />

}