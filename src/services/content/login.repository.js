import { isUsingStrapi } from "../../config/env";
import loginBg from "../../../assets/images/Welcome.png";
import { getLoginContent } from "./login.service";

const fallbackContent = {
  title: "MindCo",
  description: "Explora tu nueva comunidad.",
  backgroundMedia: {
    url: loginBg,
    mime: "image/png",
    type: "image",
  },
};

export const getLoginContentData = async () => {
  if (!isUsingStrapi()) {
    return fallbackContent;
  }
  const content = await getLoginContent();
  return {
    title: content?.title || fallbackContent.title,
    description: content?.description || fallbackContent.description,
    backgroundMedia: content?.backgroundMedia || fallbackContent.backgroundMedia,
  };
};
