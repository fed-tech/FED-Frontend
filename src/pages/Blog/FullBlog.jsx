import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles/FullBlog.module.scss";
import RightSidebar from "../../layouts/Blog/RightSidebar/RightSidebar";
import { ChatBot } from "../../features";
import { api } from "../../services";
import { ComponentLoading } from "../../microInteraction";

const FullBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [headings, setHeadings] = useState([]);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/blog/getBlog/${id}`);
        console.log('Single blog API response:', response.data);
        
        if (response.status === 200 && response.data.blogs) {
          let blogData = response.data.blogs;
          
// more edits will be there in this file after summarization
          if (typeof blogData === 'string') {
            try {
              blogData = JSON.parse(blogData);
            } catch (err) {
              console.error('Error parsing blog data:', err);
              setError('Error parsing blog data');
              return;
            }
          }
          
          
          const processedBlog = {
            id: blogData.id || blogData._id,
            title: blogData.title || blogData.blogTitle || 'Untitled Blog',
            desc: blogData.desc || blogData.metaDescription || blogData.blogContent || '',
            image: blogData.image || blogData.blogImage || 'https://via.placeholder.com/100',
            date: blogData.date || blogData.blogDate || new Date().toISOString(),
            author: blogData.author || blogData.blogAuthor || '{"name":"Unknown","department":"N/A"}',
            blogLink: blogData.blogLink || blogData.mediumLink || '',
            visibility: blogData.visibility || blogData.isPublished || false,
            approval: blogData.approval || blogData.isFeatured || false,
            summary: blogData.summary || blogData.metaDescription || '',
            likes: blogData.likes || 0,
            comments: blogData.comments || [],
            // will innclude any other fields that might be needed
          };
          
          console.log('Processed blog data:', processedBlog);
          setBlog(processedBlog);
        } else {
          setError('Blog not found');
        }

        // Fetch all blogs for related content
        const allBlogsResponse = await api.get('/api/blog/getBlog');
        if (allBlogsResponse.status === 200 && allBlogsResponse.data.blogs) {
          // Process all blogs to ensure consistent format
          const processedBlogs = allBlogsResponse.data.blogs.map(blog => ({
            id: blog.id || blog._id,
            title: blog.title || blog.blogTitle || 'Untitled Blog',
            desc: blog.desc || blog.metaDescription || blog.blogContent || '',
            image: blog.image || blog.blogImage || 'https://via.placeholder.com/100',
            date: blog.date || blog.blogDate || new Date().toISOString(),
            author: blog.author || blog.blogAuthor || '{"name":"Unknown","department":"N/A"}',
            blogLink: blog.blogLink || blog.mediumLink || '',
            // Include other fields as needed
          }));
          
          // Filter out the current blog and limit to 3 related blogs
          const filtered = processedBlogs
            .filter(b => b.id !== id)
            .slice(0, 3);
            
          console.log('Related blogs:', filtered);
          setRelatedBlogs(filtered);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('An error occurred while fetching the blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (blog?.blogContent || blog?.desc) {
      try {
        const parser = new DOMParser();
        const content = parser.parseFromString(blog.blogContent || blog.desc, "text/html");
        const h2Tags = Array.from(content.querySelectorAll("h2")).map((tag, index) => ({
          id: tag.id || `heading-${index + 1}`,
          text: tag.textContent || `Heading ${index + 1}`,
        }));
        setHeadings(h2Tags);
      } catch (error) {
        console.error('Error parsing blog content:', error);
      }
    }
  }, [blog]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ComponentLoading />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFoundContainer}>
          <p className={styles.notFound}>{error || 'Blog not found.'}</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/Blog')}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Parse author information
  let authorObj = { name: 'Unknown', department: 'N/A' };
  try {
    if (typeof blog.author === 'string') {
      authorObj = JSON.parse(blog.author);
    } else if (typeof blog.author === 'object') {
      authorObj = blog.author;
    }
  } catch (err) {
    console.error('Error parsing author:', err);
  }

  const handleReadOnMedium = () => {
    if (blog.blogLink) {
      window.open(blog.blogLink, "_blank");
    } else {
      // default medium link when none provided
      window.open(
        "https://medium.com/@fedkiit",
        "_blank"
      );
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.fullBlogContainer}>
        <div className={styles.contentArea}>
          <article className={styles.fullBlog}>
            <header className={styles.blogHeader}>
              <div className={styles.headerContent}>
                <figure className={styles.image}>
                  <img src={blog.image} alt={blog.title} />
                </figure>

                <div className={styles.titleWrapper}>
                  <h1 className={styles.heading}>{blog.title}</h1>
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: blog.desc }}
                  />
                  <br />
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>By {authorObj.name}</span>
                    <span className={styles.authorDept}>{authorObj.department}</span>
                    <time className={styles.date}>
                      Posted on: {new Date(blog.date).toDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </header>

            <footer className={styles.blogFooter}>
              <div className={styles.reactions}>
                <p className={styles.likes}>
                  <span className={styles.reactionIcon}>Likes:</span>{" "}
                  {blog.likes || 0}
                </p>
                <p className={styles.comments}>
                  <span className={styles.reactionIcon}>Comments:</span>{" "}
                  {blog.comments?.length || 0}
                </p>
              </div>

              {blog.blogLink && (
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.summarizeButton}
                    onClick={handleReadOnMedium}
                  >
                    Read on Medium
                  </button>
                </div>
              )}
              
              {blog.summary && (
                <div className={styles.summarySection}>
                  <h3>Summary</h3>
                  <p>{blog.summary}</p>
                </div>
              )}
            </footer>
          </article>
        </div>

        <aside className={styles.sidebarArea}>
          <RightSidebar blogs={relatedBlogs} />
          <div className={styles.chatBotWrapper}>
            <ChatBot />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FullBlog;
