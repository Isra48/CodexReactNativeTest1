import { isUsingStrapi } from "../../config/env";
import loginBg from "../../../assets/images/Welcome.png";
import { getRegisterContent } from "./register.service";

const fallbackContent = {
  title: "Crear cuenta",
  description: "Únete a nuestra comunidad MindCo",
  backgroundMedia: {
    url: loginBg,
    mime: "image/png",
    type: "image",
  },
};

export const getRegisterContentData = async () => {
  if (!isUsingStrapi()) {
    return fallbackContent;
  }
  const content = await getRegisterContent();
  return {
    title: content?.title || fallbackContent.title,
    description: content?.description || fallbackContent.description,
    backgroundMedia: content?.backgroundMedia || fallbackContent.backgroundMedia,
  };
};
