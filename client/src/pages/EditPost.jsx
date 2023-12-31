import { useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "../context/PostsContext";
import styles from "../styles/pages/createPost.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";

const EditPost = () => {
  const { getPost, editPost } = useContext(PostsContext);
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState({});

  const [imageUrl, setImage] = useState();

  const contentRef = useRef();

  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    getPost(id).then((post) => {
      console.log(post);
      if (!post._id) navigate("/");
      if (post.userId !== user._id) navigate("/");

      setImage(post.image);
      setPost(post);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleUpdatePost = async (event) => {
    event.preventDefault();

    const bodyFormData = new FormData();
    bodyFormData.append("image", imageUrl);

    let image = imageUrl;

    if (
      imageUrl &&
      typeof imageUrl !== "string" &&
      URL.createObjectURL(imageUrl).startsWith("blob")
    ) {
      const { data } = await axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload?key=24c0739558a06818cc59d916baa94e86",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      image = data.data.url;
    }

    const content = contentRef.current.value;

    // console.log(content, image);
    await editPost(id, content, image);
    navigate("/user");
  };

  if (!post?._id) return;

  const renderFileUploadBox = () => {
    const handleImageClick = () => {
      setImage(null);
    };

    if (imageUrl) {
      return (
        <div className={styles.imageWrapper}>
          <img
            src={
              typeof imageUrl === "string" && imageUrl.startsWith("http")
                ? imageUrl
                : URL.createObjectURL(imageUrl)
            }
            className={styles.previewImage}
          />
          <button
            onClick={handleImageClick}
            type="button"
            className={`btn ${styles.deleteBtn}`}
          >
            <AiOutlineClose />
          </button>
        </div>
      );
    }

    const handleImageChanged = (e) => {
      setImage(e.target.files[0]);
    };

    return (
      <input
        type="file"
        id="file"
        onChange={handleImageChanged}
        accept="image/*"
        className={styles.fileUpload}
      />
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.createPost}>
        <h2 className={styles.title}>Edit Post</h2>
        <form onSubmit={handleUpdatePost} className={styles.form}>
          <div>
            <label htmlFor="file">Project Image</label>
            <div
              className={`${styles.fileUploadWrap} ${
                !imageUrl && styles.padding
              }`}
            >
              {renderFileUploadBox()}
            </div>
          </div>
          <div>
            <label htmlFor="content" className={styles.required}>
              Content
            </label>
            <textarea
              name="content"
              rows="6"
              id="content"
              ref={contentRef}
              defaultValue={post.content}
              className="form__input"
              placeholder="Write something..."
              required
              maxLength={280}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
