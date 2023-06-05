import { useEffect, useState } from 'react';
import { Auth } from './components/Auth';
import { db, auth, storage } from './config/firebase.js';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {ref, uploadBytes} from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState<any[]>([]);

  // new movie states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newOscar, setNewOscar] = useState(false);
  const moviesCollectionRef = collection(db, 'movies');

  // update title state
  const [updateTitle, setUpdateTitle] = useState('');

  // file upload state 
  const [fileUpload, setFileUpload] = useState<any>(null)

  const getMovieList = async () => {
    // READ THE DATA
    // SET THE MOVIELIST
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);
  console.log(movieList);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        oscar: newOscar,
        userId: auth?.currentUser?.uid
      });
    } catch (err) {
      console.error(err);
    }
    getMovieList();
  };

  const deleteMovie = async (id: string) => {
    const movieDoc = doc(db, 'movies', id);
    await deleteDoc(movieDoc);
    getMovieList();
  };
  const updateMovieTitle = async (id: string) => {
    const movieDoc = doc(db, 'movies', id);
    await updateDoc(movieDoc,{title: updateTitle});
    getMovieList();
  };

  const uploadFile = async () => {
      if (!fileUpload) return;
      const filesFolderRef = ref(storage,`projectFiles/${(fileUpload as File).name}`);
      try {
      await uploadBytes(filesFolderRef, fileUpload);
      } catch(err) {
          console.error(err);
        }

    }

  return (
    <div>
      <h1>Firebase Course</h1>
      <Auth />

      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={newOscar}
          onChange={(e) => {
            setNewOscar(e.target.checked);
          }}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.oscar ? 'green' : 'red' }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <br />
            <input
              placeholder="new title"
              onChange={(e) => {
                setUpdateTitle(e.target.value);
              }}
            />
            <button onClick={()=> updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}

        <br />
        <input type='file' onChange={(e)=>{
  const files = e.target.files;
  if (files && files.length > 0) {
    setFileUpload(files[0]);
  }
         }} /> 
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;

