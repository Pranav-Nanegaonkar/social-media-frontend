import axios from "axios";

export const uploadImage = async (file:File) => {
  const formData = new FormData();
  formData.append("image", file);
  const url = import.meta.env.VITE_BASE_URL + "/upload";
  const res = await axios.post(url, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data.imageUrl; // Cloudinary URL
};
