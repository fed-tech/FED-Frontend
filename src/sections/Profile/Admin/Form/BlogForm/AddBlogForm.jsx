import { useState, useRef, useEffect, useContext } from "react";
import { Button, Input} from "../../../../../components";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AuthContext from "../../../../../context/AuthContext";
import styles from "./styles/AddBlogForm.module.scss";
import Switch from "react-switch";
import { nanoid } from "nanoid";
import { Alert, MicroLoading } from "../../../../../microInteraction";
import { api } from "../../../../../services";
import BlogCard from "../../../../../components/BlogCard/BlogCard";

function NewBlogForm() {
  const scrollRef = useRef(null);
  const [isVisibility, setisVisibility] = useState(false);
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [data, setdata] = useState({
    _id: nanoid(),
    blogTitle: "",
    blogSubtitle: "",
    metaDescription: "",
    image: "",
    blogDate: new Date().toISOString().split('T')[0],
    blogAuthor: "",
    mediumLink: "",
    blogCategory: "",
    blogTags: [],
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

  useEffect(() => {
   // blog mounting fetch
    fetchBlogs();
    
   
    const refreshInterval = setInterval(() => {
      fetchBlogs();
    }, 30000);
    
   
    return () => clearInterval(refreshInterval);
  }, []);

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

    if (!data.image) {
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

    return true;
  };

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      console.log("Fetching blogs...");
      
      const timestamp = new Date().getTime();
      const response = await api.get(`/api/blog/getBlog?t=${timestamp}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
      
      if (response.status === 200) {
        console.log("Fetched blogs:", response.data.blogs);
        setBlogs(response.data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch blogs. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleEditBlog = (blog) => {
    console.log("Edit blog clicked with data:", blog);
    setisEditing(true);
    
    let authorName = "";
    let authorDepartment = "";
    
    try {
      if (typeof blog.author === 'string') {
        console.log("Author is a string:", blog.author);
        try {
          const authorObj = JSON.parse(blog.author);
          console.log("Parsed author object:", authorObj);
          authorName = authorObj.name || "";
          authorDepartment = authorObj.department || "";
        } catch (parseError) {
          console.error("Failed to parse author JSON:", parseError);
          authorName = blog.author;
        }
      } else if (typeof blog.author === 'object' && blog.author !== null) {
        console.log("Author is already an object:", blog.author);
        authorName = blog.author.name || "";
        authorDepartment = blog.author.department || "";
      } else {
        console.log("Author is neither string nor object:", typeof blog.author, blog.author);
        authorName = String(blog.author || "");
      }
    } catch (error) {
      console.error("Error handling author:", error);
      authorName = String(blog.author || "");
    }
    
    console.log("Extracted author name:", authorName);
    console.log("Extracted author department:", authorDepartment);
    
    let formattedDate = new Date().toISOString().split('T')[0];
    if (blog.date) {
      try {
        formattedDate = new Date(blog.date).toISOString().split('T')[0];
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    if (!blog.id) {
      console.error("Blog ID is missing for edit operation");
      setAlert({
        type: "error",
        message: "Cannot edit blog: Missing blog ID",
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }
    
    console.log("Blog ID for edit operation:", blog.id);
    
    const formData = {
      _id: blog.id, 
      originalBlog: blog, 
      blogTitle: blog.title || "",
      blogSubtitle: blog.subtitle || "",
      metaDescription: blog.desc || blog.summary || "",
      image: blog.image || "",
      blogDate: formattedDate,
      blogAuthor: authorName,
      mediumLink: blog.blogLink || "",
      blogCategory: authorDepartment,
      blogTags: blog.tags || [],
      isPublished: blog.visibility === "public" || false,
      isFeatured: blog.isFeatured || false,
      isCommentEnabled: blog.isCommentEnabled || true,
    };
    
    console.log("Setting form data for edit:", formData);
    setdata(formData);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      setIsLoading(true);
      const response = await api.delete(`/api/blog/deleteBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "Blog deleted successfully",
          position: "bottom-right",
          duration: 3000,
        });
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to delete blog. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBlog = (blogLink) => {
    if (blogLink) {
      window.open(blogLink, '_blank');
    } else {
      setAlert({
        type: "warning",
        message: "Blog link not available",
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const onSaveBlog = async () => {
    if (isValidBlog()) {
      setIsLoading(true);
      const form = new FormData();
    
      if (!isEditing) {
       
        if (data.image && data.image instanceof File) {
          form.append("image", data.image);
        }
        form.append('title', data.blogTitle);
        
      
        try {
          if (typeof data.blogAuthor === 'string' && data.blogAuthor.startsWith('{')) {
           
            form.append('author', data.blogAuthor);
          } else {
           
            const authorObj = {
              name: data.blogAuthor,
              department: data.blogCategory || 'General'
            };
            form.append('author', JSON.stringify(authorObj));
          }
        } catch (e) {
          console.error("Error handling author data:", e);
          const authorObj = {
            name: data.blogAuthor,
            department: data.blogCategory || 'General'
          };
          form.append('author', JSON.stringify(authorObj));
        }
        
        form.append('blogLink', data.mediumLink);
        form.append('desc', data.metaDescription);
        form.append('date', data.blogDate);
        form.append('summary', data.metaDescription || "");
        
        // visibility handling based on toggle
        form.append('visibility', data.isPublished ? 'public' : 'private');
        
        const approvalObj = {
          status: true,
          approvedBy: 'System'
        };
        form.append('approval', JSON.stringify(approvalObj));
      }
      
      console.log("Form data being prepared:");
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }
      
      if (typeof data.image === "string" && !data.image.startsWith("http")) {
        form.delete("image");
      }

      try {
        let response;
        
        if (isEditing) {
          // used put method for updating blogs
          console.log(`Updating blog with ID: ${data._id}`);
          
          if (!data._id) {
            throw new Error("Missing blog ID for update operation");
          }
          
          const formEntries = Array.from(form.entries());
          for (const [key] of formEntries) {
            form.delete(key);
          }
          
          form.append('title', data.blogTitle);
          
          const authorObj = {
            name: data.blogAuthor,
            department: data.blogCategory || 'General'
          };
          form.append('author', JSON.stringify(authorObj));
          
          form.append('blogLink', data.mediumLink);
          form.append('desc', data.metaDescription);
          form.append('date', data.blogDate);
          form.append('summary', data.metaDescription || "");
          form.append('visibility', data.isPublished ? 'public' : 'private');
          form.append('category', data.blogCategory || 'General');
          
          const approvalObj = {
            status: true,
            approvedBy: 'System'
          };
          form.append('approval', JSON.stringify(approvalObj));
          
          if (data.image instanceof File) {
            form.append("image", data.image);
          }
          
          console.log("Final update form data:", Object.fromEntries(form.entries()));
          console.log("Updating blog with ID:", data._id);
          
          try {
            const blogId = data._id;
            
            if (!blogId) {
              throw new Error("Missing blog ID for update operation");
            }
            
            console.log(`Making API call to update blog with ID: ${blogId}`);
            console.log("Form data being sent:", Object.fromEntries(form.entries()));
            
            response = await api.put(
              `/api/blog/updateBlog/${blogId}`,
              form,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
              }
            );
            
            console.log("Update response:", response.data);
            
            if (response.status !== 200) {
              throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
            }
          } catch (updateError) {
            console.error("Error updating blog:", updateError);
            throw new Error(updateError.response?.data?.message || "Failed to update blog");
          }
          
          console.log("Update response:", response.data);
        } else {
          response = await api.post(
            "/api/blog/createBlog",
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            }
          );
        }

        if (response.status === 200 || response.status === 201) {
          setisEditing(false);
          setdata({
            _id: nanoid(),
            blogTitle: "",
            blogSubtitle: "",
            blogContent: "",
            image: "",
            blogDate: new Date().toISOString().split('T')[0],
            blogAuthor: "",
            mediumLink: "",
            blogCategory: "",
            blogTags: [],
            metaDescription: "",
            isPublished: false,
            isFeatured: false,
            isCommentEnabled: true,
          });
          
          setTimeout(async () => {
            try {
              const fetchWithTimestamp = async () => {
                const timestamp = new Date().getTime();
                console.log(`Fetching blogs with timestamp: ${timestamp}`);
                const response = await api.get(`/api/blog/getBlog?t=${timestamp}`, {
                  headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                  },
                });
                
                if (response.status === 200) {
                  console.log("Freshly fetched blogs:", response.data.blogs);
                  setBlogs(response.data.blogs || []);
                }
              };
              
              // First fetch
              await fetchWithTimestamp();
              
              setAlert({
                type: "success",
                message: isEditing ? "Blog updated successfully" : "Blog saved successfully",
                position: "bottom-right",
                duration: 3000,
              });
              
              if (isEditing) {
                console.log('Dispatching blog-updated event');
                window.dispatchEvent(new Event('blog-updated'));
              }
              
              setTimeout(async () => {
                await fetchWithTimestamp();
                if (isEditing) {
                  window.dispatchEvent(new Event('blog-updated'));
                }
              }, 1500);
            } catch (error) {
              console.error("Error refreshing blogs after update:", error);
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error saving/updating blog:", error);
        setAlert({
          type: "error",
          message: error.response?.data?.message || "There was an error with the blog operation. Please try again.",
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
          backgroundColor: "rgb(35, 34, 34)",
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
              Blog Visibility (
              <span style={{ color: !data.isPublished ? "#FF8A00" : "white" }}>
                Private
              </span>
              /
              <span style={{ color: data.isPublished ? "#FF8A00" : "white" }}>
                Public
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
                typeof data.image === "string"
                  ? data.image
                  : data.image?.name || ""
              }
              containerClassName={styles.formInput}
              onChange={(e) => setdata({ ...data, image: e.target.value })}
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
              value={data.mediumLink}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, mediumLink: e.target.value })}
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
              ]}
              className={styles.formInput}
              value={data.blogCategory}
              onChange={(value) => setdata({ ...data, blogCategory: value })}
            />


          </div>
        </div>
      </div>
      <Alert />
      
      <div className={styles.blogListSection}>
        <h3 className={styles.headInnerText}>
          <span>Uploaded</span> Blogs
        </h3>
        
        <div className={styles.filterSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.visibilityFilterContainer}>
            <div className={styles.filterLabel}>Filter by visibility:</div>
            <Input
              type="select"
              name="visibilityFilter"
              value={visibilityFilter}
              placeholder="All"
              onChange={(value) => setVisibilityFilter(value)}
              options={[
                { label: "All", value: "all" },
                { label: "Public", value: "public" },
                { label: "Private", value: "private" }
              ]}
              className={styles.visibilitySelect}
            />
          </div>
        </div>
        
        <div className={styles.blogListContainer}>
          {loadingBlogs ? (
            <div className={styles.loadingContainer}>
              
            </div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No blogs found. Create your first blog above!</p>
            </div>
          ) : (
            <div className={styles.blogsList}>
              {blogs
                .filter((blog) => {
                  //visibility filter
                  if (visibilityFilter !== 'all') {
                    if (blog.visibility !== visibilityFilter) {
                      return false;
                    }
                  }
                  
                  if (!searchQuery.trim()) return true;
                  
                  const titleMatch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase());
                  const descMatch = blog.desc?.toLowerCase().includes(searchQuery.toLowerCase());
                  
                  let authorName = '';
                  try {
                    const authorObj = typeof blog.author === 'string' ? JSON.parse(blog.author) : blog.author;
                    authorName = authorObj?.name || '';
                  } catch (err) {
                    authorName = String(blog.author || '');
                  }
                  
                  const visibilityMatch = blog.visibility?.toLowerCase().includes(searchQuery.toLowerCase());
                  
                  const authorMatch = authorName.toLowerCase().includes(searchQuery.toLowerCase());
                  
                  return titleMatch || descMatch || authorMatch || visibilityMatch;
                })
                .map((blog) => (
                  <div key={blog.id} className={styles.blogItem}>
                    <div className={styles.visibilityBadge} style={{
                    }}>
                      {blog.visibility === 'private' ? 'Private' : 'Public'}
                    </div>
                    <BlogCard 
                      data={blog} 
                      customButtons={
                        <div className={styles.customButtonContainer}>
                          <button 
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBlog(blog);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlog(blog.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      }
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewBlogForm;