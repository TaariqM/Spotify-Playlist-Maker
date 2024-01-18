import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CButton,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import "../css/playlists_card.css";

const Playlists_Card = ({ music }: { music: any }) => {
  const max: number = music[1].length;
  const min: number = 0;
  const index: number = Math.floor(Math.random() * (max - min) + min); //generate a random number. This number will be used to index the array of songs in the key-value pair
  const navigation = useNavigate();

  const handleOnClick = (e: any) => {
    e.preventDefault();

    const redirect = e.target.tagName === "BUTTON";

    if (!redirect) {
      navigation(`/${music[0]}/playlist`, {
        state: {
          genre: music[0],
          songs: music[1],
          image: music[1][index].artistDataInfo.artistIMG.url,
          coverArtist: music[1][index].artistDataInfo.artistName,
        },
      });
    }
  };

  return (
    // <div className="card-container">
    //   <CCard>
    //     <CCardImage src={music[1][index].artistDataInfo.artistIMG.url} />
    //     <CCardBody>
    //       <CCardTitle>{music[0]}</CCardTitle>
    //       <CButton>Go Somewhere</CButton>
    //     </CCardBody>
    //   </CCard>
    // </div>

    <div className="card-container" onClick={handleOnClick}>
      <div className="card-container-pic-container">
        <img src={music[1][index].artistDataInfo.artistIMG.url}></img>
      </div>

      <div className="card-container-title-container">
        <h3>{music[0]}</h3>
      </div>

      <div className="card-container-btn-container">
        <button className="card-container-btn-container-button">Play</button>
      </div>
    </div>
  );
};

export default Playlists_Card;
