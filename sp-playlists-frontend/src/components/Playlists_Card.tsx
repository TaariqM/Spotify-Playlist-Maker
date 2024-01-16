const Playlists_Card = ({ music }: { music: any }) => {
  const max: number = music[1].length;
  const min: number = 0;
  const index: number = Math.floor(Math.random() * (max - min) + min); //generate a random number. This number will be used to index the array of songs in the key-value pair
  return (
    <div className="card-container">
      <div className="card-container-pic-container">
        <img src={music[1][index].artistDataInfo.artistIMG.url}></img>
      </div>

      <div className="car-container-title-container">
        <h1>{music[0]}</h1>
      </div>
    </div>
  );
};

export default Playlists_Card;
