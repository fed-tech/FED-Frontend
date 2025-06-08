import React, { useState, useEffect } from 'react';
import BlogCard from '../../components/BlogCard/BlogCard';
import { ChatBot } from "../../features";
import styles from '../Blog/styles/Blog.module.scss';
import LeftSidebar from '../../layouts/Blog/LeftSidebar/LeftSidebar';
import RightSidebar from '../../layouts/Blog/RightSidebar/RightSidebar';
import { api } from '../../services';
import { ComponentLoading } from '../../microInteraction';

const Blog = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching blogs from backend...');
        const response = await api.get('/api/blog/getBlog');
        console.log('Blog API raw response:', response);
        console.log('Blog API data response:', response.data);
        
        if (response.status === 200) {
          
          const blogData = response.data.blogs || [];
          console.log('Raw blog data array:', blogData);
          console.log('Number of blogs received:', blogData.length);
          
         
          if (typeof blogData === 'string') {
            try {
              const parsedBlogs = JSON.parse(blogData);
              console.log('Successfully parsed blog data string into array:', parsedBlogs);
              setBlogs(parsedBlogs);
            } catch (err) {
              console.error('Error parsing blog data string:', err);
              setBlogs([]);
            }
          } else if (Array.isArray(blogData)) {
            console.log('Processing blog array...');
            const processedBlogs = blogData.map((blog, index) => {
              console.log(`Processing blog ${index}:`, blog);
              
              const processedBlog = {
                id: blog.id || blog._id,
                title: blog.title || blog.blogTitle || 'Untitled Blog',
                desc: blog.desc || blog.metaDescription || blog.blogContent || '',
                image: blog.image || blog.blogImage || 'https://via.placeholder.com/100',
                date: blog.date || blog.blogDate || new Date().toISOString(),
                author: blog.author || blog.blogAuthor || '{"name":"Unknown","department":"N/A"}',
                blogLink: blog.blogLink || blog.mediumLink || '',
                visibility: blog.visibility === 'private' ? 'private' : 'public',
                approval: blog.approval === false ? false : true,
                summary: blog.summary || blog.metaDescription || '',
                likes: blog.likes || 0,
                comments: blog.comments || [],
              };
              
              console.log(`Processed blog ${index}:`, processedBlog);
              return processedBlog;
            });
            
            console.log('All processed blogs:', processedBlogs);
            console.log('Number of processed blogs:', processedBlogs.length);
            setBlogs(processedBlogs);
          } else {
            console.error('Blog data is neither an array nor a string:', blogData);
            setBlogs([]);
          }
        } else {
          console.error('Failed to fetch blogs, status:', response.status);
          setError('Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('An error occurred while fetching blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredData = blogs
    .filter((blog) => {
      let authorObj;
      try {
        authorObj = typeof blog.author === 'string' ? JSON.parse(blog.author) : blog.author;
      } catch (err) {
        authorObj = { department: null, name: '' };
      }

      return selectedDepartment
        ? authorObj.department === selectedDepartment
        : true;
    })
    .filter((blog) => {
      
      const titleMatch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = blog.desc?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // fetch author name from blog object
      let authorName = '';
      try {
        const authorObj = typeof blog.author === 'string' ? JSON.parse(blog.author) : blog.author;
        authorName = authorObj?.name || '';
      } catch (err) {
        
      }
      
      const authorMatch = authorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return titleMatch || descMatch || authorMatch;
    })
    .filter((blog) => {
      console.log('Filtering blog:', blog);
      console.log('Blog details - Title:', blog.title, 'Visibility:', blog.visibility, 'Approval:', blog.approval);
      
      if (blog.visibility === 'private') {
        console.log('Blog is private, filtering out:', blog.title);
        return false;
      }

      if (blog.approval) {
        try {
          if (typeof blog.approval === 'object') {
            if (blog.approval.status === false) {
              console.log('Blog not approved (object), filtering out:', blog.title);
              return false;
            }
          } 
          else if (typeof blog.approval === 'string') {
            try {
              const approvalObj = JSON.parse(blog.approval);
              if (approvalObj.status === false) {
                console.log('Blog not approved (string), filtering out:', blog.title);
                return false;
              }
            } catch (parseErr) {
              console.log('Could not parse approval string, showing blog anyway:', blog.title);
            }
          }
        } catch (err) {
          console.log('Error handling approval for blog:', blog.title, err);
        }
      }
      
      console.log('Blog passed all filters, showing:', blog.title);
      return true;
    });
    //sorted data

  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ComponentLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  const isMobile = window.innerWidth <= 767;

  return (
    <div className={styles.feed}>
      <LeftSidebar
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.displayFeed}>
        {sortedData.length > 0 ? (
          sortedData.map((blog) => <BlogCard key={blog.id} data={blog} />)
        ) : (
          <p>No blogs match your search criteria.</p>
        )}
      </div>
      <div className={`${styles.rightSidebarContainer} ${isMobile ? styles.mobileRightSidebar : ''}`}>
        <RightSidebar blogs={sortedData} />
      </div>
      <ChatBot />
    </div>
  );
};

export default Blog;
