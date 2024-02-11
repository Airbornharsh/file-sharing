import axios from "axios";
import { useState } from "react";

interface FileType {
  _id: string;
  filename: string;
  content: string;
  createdAt: string;
}

interface UserType {
  _id: string;
  username: string;
  files: FileType[];
  access: FileType[];
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [isHome, setIsHome] = useState(true);
  const [isFiles, setIsFiles] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleJoin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/create-user", {
        username: userName,
      });
      console.log(res.data);
      setUser(res.data.user);
      setFiles(res.data.user.files);
      setIsHome(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateFile = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/create-file", {
        filename,
        content,
        username: user?.username,
      });
      console.log(res.data);
      setFiles((prev) => [res.data.file, ...prev]);
      setFilename("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="w-screen h-screen bg-black text-white flex justify-center items-center flex-col gap-4">
      {isHome && (
        <div className="flex flex-col gap-2">
          <input
            className="rounded h-8 text-black px-2 py-1 outline-none"
            type="text"
            value={userName}
            onChange={(e) => {
              console.log(e.target.value);
              setUserName(e.target.value);
            }}
            placeholder="UserName"
          />
          <button
            className="bg-orange-500 px-2 py-1 rounded"
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      )}
      {user && Object.keys(user).length > 0 && (
        <div>
          <h2 className="font-bold">{user.username}</h2>
        </div>
      )}
      {user && Object.keys(user).length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <input
            className="rounded h-8 text-black px-2 py-1 outline-none"
            type="text"
            placeholder="Filename"
            value={filename}
            onChange={(e) => {
              setFilename(e.target.value);
            }}
          />
          <input
            className="rounded h-8 text-black px-2 py-1 outline-none"
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <button
            className="bg-orange-500 px-2 py-1 rounded w-full"
            onClick={handleCreateFile}
          >
            Add
          </button>
        </div>
      )}
      {files.length > 0 && user && Object.keys(user).length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Own Files</h2>
          {files.map((file) => (
            <div
              key={file._id + "ownFiles"}
              className="bg-gray-800 px-6 rounded py-3"
            >
              <h3 className="font-semibold">{file.filename}</h3>
              <h3>{file.content}</h3>
              <p className="text-xs">
                {new Date(file.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {isFiles && (
        <div>
          <h2>Files</h2>
          <button onClick={() => setIsFiles(false)}>Hide files</button>
        </div>
      )}
    </div>
  );
}

export default App;
