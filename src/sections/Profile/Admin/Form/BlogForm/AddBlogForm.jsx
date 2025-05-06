import { useState, useRef, useEffect, useContext } from "react";
import { Button, Input} from "../../../../../components";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import AuthContext from "../../../../../context/AuthContext";

import styles from "./styles/AddBlogForm.module.scss";
import Switch from "react-switch";
import moment from "moment";
import { nanoid } from "nanoid";
import { Alert, MicroLoading } from "../../../../../microInteraction";
import { api } from "../../../../../services";

function NewBlogForm() {
  const scrollRef = useRef(null);
  const [isVisibility, setisVisibility] = useState(false);
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [data, setdata] = useState({
    _id: nanoid(),
    blogTitle: "",
    blogSubtitle: "",
    blogContent: "",
    blogImage: "",
    blogDate: "",
    blogAuthor: "",
   MediumLink: "",
    blogCategory: "",
    blogTags: [],
    
    metaDescription: "",
    isPublished: false,
    isFeatured: false,
    isCommentEnabled: true,
  });


  

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  const isValidBlog = () => {
    if (!data.blogTitle) {
      setAlert({
        type: "error",
        message: "Blog title is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.blogImage) {
      setAlert({
        type: "error",
        message: "Blog featured image is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.blogDate) {
      setAlert({
        type: "error",
        message: "Blog publication date is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.blogAuthor) {
      setAlert({
        type: "error",
        message: "Blog author is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.blogCategory) {
      setAlert({
        type: "error",
        message: "Blog department is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.metaDescription) {
      setAlert({
        type: "error",
        message: "Meta description is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    // Add more validations as needed
    return true;
  };

  const onSaveBlog = async () => {
    if (isValidBlog()) {
      setIsLoading(true);
      const form = new FormData();

      if (data.blogImage && data.blogImage instanceof File) {
        form.append("blogImage", data.blogImage);
      }

      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (key !== "blogImage") {
          form.append(key, JSON.stringify(value));
        }
      });

      if (typeof data.blogImage === "string") {
        form.delete("blogImage");
      }

      
      try {
        const response = await api.post(
          isEditing 
            ? `/api/blog/editBlog/${authCtx.blogData?.id}` 
            : "/api/blog/addBlog", 
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setAlert({
            type: "success",
            message: isEditing ? "Blog updated successfully" : "Blog saved successfully",
            position: "bottom-right",
            duration: 3000,
          });
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: "There was an error saving the blog. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <div style={{ width: "100%", marginLeft: "70px" }}>
      <div className={styles.formHeader}>
        <div className={styles.buttonContainer}>
          <h3 className={styles.headInnerText}>
            <span>New</span> Blog
          </h3>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ marginTop: "auto", marginBottom: "auto", marginRight: "12px" }}>
            {isVisibility ? (
              <IoSettingsSharp
                size={20}
                color="#FF8A00"
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => setisVisibility(!isVisibility)}
              />
            ) : (
              <IoSettingsOutline
                size={20}
                style={{ cursor: "pointer", marginTop: "10px" }}
                color="#fff"
                onClick={() => setisVisibility(!isVisibility)}
              />
            )}
          </div>

          <Button isLoading={isLoading} onClick={onSaveBlog}>
            {isEditing ? "Update" : "Save"}
          </Button>
          
        </div>
      </div>

      {isVisibility && (
        <div style={{
          backgroundColor: "rgba(47, 0, 18, 0.07)",
          width: "86%",
          margin: ".5em 0",
          padding: "1.6em",
          borderRadius: "8px",
          marginBottom: "1em",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "1em"
          }}>
          
            <label style={{ color: "#fff", margin: "1px 0", fontSize: ".8em" }}>
              Blog Publishing Status (
              <span style={{ color: !data.isPublished ? "#FF8A00" : "white" }}>
                Draft
              </span>
              /
              <span style={{ color: data.isPublished ? "#FF8A00" : "white" }}>
                Published
              </span>
              )
            </label>
            <Switch
              checked={data.isPublished}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              uncheckedIcon={false}
              onChange={() => setdata({ ...data, isPublished: !data.isPublished })}
            />
          </div>

          
        </div>
      )}

      <div style={{
        height: "90vh",
        width: "90%",
        overflow: "hidden scroll",
        scrollbarWidth: "none",
        marginBottom: "50px",
      }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "45%" }}>
            <Input
              placeholder="Enter Blog Title"
              label="Blog Title"
              value={data.blogTitle}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, blogTitle: e.target.value })}
            />
           <Input
              placeholder="Enter Blog Description"
              label="Blog Description"
              type="textArea"
              className={styles.formInputTxtArea}
              value={data.metaDescription}
              onChange={(e) => setdata({ ...data, metaDescription: e.target.value })}
            />
            <Input
              placeholder="Attach Blog Image"
              label="Blog Image"
              type="image"
              value={
                typeof data.blogImage === "string"
                  ? data.blogImage
                  : data.blogImage?.name || ""
              }
              containerClassName={styles.formInput}
              onChange={(e) => setdata({ ...data, blogImage: e.target.value })}
              className={styles.formInput}
            />
            <Input
              placeholder="Select Publication Date"
              className={styles.formInput}
              label="Publication Date"
              type="date"
              style={{ width: "88%" }}
              value={data.blogDate}
              onChange={(date) => setdata({ ...data, blogDate: date })}
            />
            <Input
              placeholder="Enter Author Name"
              label="Blog Author"
              value={data.blogAuthor}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, blogAuthor: e.target.value })}
            />
             <Input
              placeholder="https://medium.com/@fedkiit/"
              label="Medium Link"
              value={data.mediumlink}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, MediumLink: e.target.value })}
            />
          </div>
          <div style={{ width: "45%" }}>
            <Input
              placeholder="Select Blog Department"
              label="Blog Category"
              type="select"
              options={[
                { label: "Technical", value: "Technical" },
                { label: "Creative", value: "Creative" },
                { label: "Marketing", value: "Marketing" },
                { label: "Operations", value: "Operations" },
              
                { label: "PR and Finance", value: "PR and Finance" },
                { label: "Human Resource", value: "Human Resource" },
             
              ]}
              className={styles.formInput}
              value={data.blogCategory}
              onChange={(value) => setdata({ ...data, blogCategory: value })}
            />
           
            
           
          </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "row",
          width: "86%",
          marginBottom: "12px",
        }}>
         
          
        </div>

      

        
          
        
      </div>
      <Alert />
    </div>
  );
}

export default NewBlogForm;