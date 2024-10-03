import React, { useState, useRef, useEffect } from 'react';
import NDTImage from './assets/id-cards/Design.png';
import NETImage from './assets/id-cards/Events.png';
import NOCImage from './assets/id-cards/OC.png';
import AmbienceImage from './assets/id-cards/Ambience.png';
import PRnCImage from './assets/id-cards/PRnC.png';
import NMTImage from './assets/id-cards/Marketing.png';
import PAINImage from './assets/id-cards/PaIN.png';
import { auth, db } from './assets/firebase/firebasecongfig';
import { doc, getDoc } from 'firebase/firestore';
import { useAnswers } from './AnswersContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const calculateTeam = (answers) => {
  const teamScores = {
    NDT: 0,
    Ambience: 0,
    NOC: 0,
    NET: 0,
    NMT: 0,
    PAIN: 0,
    PRnC: 0,
  };
  answers.forEach((answer) => {
    teamScores[answer]++;
  });
  const team = Object.keys(teamScores).reduce((a, b) =>
    teamScores[a] > teamScores[b] ? a : b
  );
  return team;
};

const Results = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { answers } = useAnswers();
  const navigate = useNavigate();
  console.log("These are the answers I got in the results page", answers);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Set initial visibility to false
  const [ IsDownload, setIsDownload] = useState(false)
  const [isUpload, setUpload] = useState(false)
  const [isPreview, setPreview] = useState(false)

  const teamData = {
    NDT: NDTImage,
    NET: NETImage,
    NOC: NOCImage,
    Ambience: AmbienceImage,
    PRnC: PRnCImage,
    NMT: NMTImage,
    PAIN: PAINImage,
  };

  const handlePreview = () => {
    if (imageRef.current.src === "") {
      toast.error("Please upload an image first");
      return;
    }
    setIsVisible(true);
    setUpload(true);
    setIsDownload(true) 
    setPreview(true);// Show the canvas on preview

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.height = 600;
    canvas.width = 400;

    const img = new Image();
    if (answers.length === 0) {
      navigate('/quiz');
      return;
    }
    const team = calculateTeam(answers);
    img.src = teamData[team];
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 86, 130, 240, 230); // Draw the image at a specified position
      ctx.fillStyle = "#fff";
      ctx.font = "20px Jost";
      ctx.fillText(userDetails.name, 100, 390, 70, 30);
      ctx.fillStyle = "#000";
      ctx.font = "15px Jost";
      ctx.fillText(userDetails.rollno, 100, 413, 70, 30);
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleImageLoad = (event) => {
    const image = imageRef.current;
    image.src = URL.createObjectURL(event.target.files[0]);
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    const blob = await fetch(imageData).then(res => res.blob());
    
    const formData = new FormData();
    formData.append('file', blob, `${userDetails.rollno}.png`); // Add the image blob to FormData

    try {
      // Upload to your backend server which will handle Google Drive upload
      await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create a link for the user to download the image
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${userDetails.rollno}.png`;
      a.click();

    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file.');
    }
  };
  // const handleDownload = () => {
  //   if (imageRef.current.src === "") {
  //     toast.error("Please upload an image first");
  //     return;
  //   }
  //   const canvas = canvasRef.current;

  //   if (window.navigator.msSaveBlob) {
  //     window.navigator.msSaveBlob(canvas.msToBlob(), "Card.png");
  //   } else {
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.href = canvas.toDataURL();
  //     a.download = "Card.png";
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // };

  useEffect(() => {
    if (userDetails === null) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserDetails(docSnap.data());
              console.log("User details:", docSnap.data());
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        } else {
          console.log("No user is signed in.");
        }
      });

      return () => unsubscribe();
    }
  }, [userDetails]);

  return (
    
    <div className='result-container'>
      <div>
      <div className='results-text'>
        <h2>Woah! Look at that! Based on your responses, you are most likely to be part of {calculateTeam(answers)}!</h2>
      </div>
      <div className='results-text'>
        <h3>Why don't you upload a picture and generate your ID card?</h3>
      </div>
      </div>
      <div className='idcard'>
     <div className="file-upload-wrapper" style={{ display: IsDownload ? 'none' : 'block' }}>
  <input type="file" id="file-upload" className="file-upload-input" onChange={handleImageLoad} />
  <label htmlFor="file-upload" className="file-upload-label">
    <span>Upload Image</span>
  </label>
</div>
<button className="custom-button" onClick={handlePreview}style={{ display: IsDownload ? 'none' : 'block' }}>
  <span className="icon">👑</span> Preview
</button>



      {/* Render the canvas only if isVisible is true */}
      <canvas
        ref={canvasRef}
        id="result"
        className='idcard-container'
        style={{ display: isVisible ? 'block' : 'none' }}
      />

      <img ref={imageRef} id="imgDisplayed" alt="Preview" style={{ display: "none" }} />

      <button className="custom-button" onClick={handleDownload} style={{ display: IsDownload ? 'block' : 'none' }}>
 Download
</button>

    </div>
    </div>
  );
};

export default Results;
