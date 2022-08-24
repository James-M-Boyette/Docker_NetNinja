import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    // fetch('https://jsonplaceholder.typicode.com/posts' // this React app is from another one of his projects, and can use the above API indipendantly of any back end we might've needed to code ... however we *did* make a (simple) one, so we should use it!
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>all blogs</h1>
        {blogs && blogs.map((blog) => <div key={blog.id}>{blog.title}</div>)}
      </header>
    </div>
  );
}

export default App;
