const Playlists_Card = ({ music }: { music: any }) => {
  const max: number = music.value.length;
  const min: number = 0;
  const index: number = Math.floor(Math.random() * (max - min) + min); //generate a random number. This number will be used to index the array of songs in the key-value pair
  return (
    <div className="card-container">
      <div className="card-container-pic-container">
        <img src={music.value[index].artistDataInfo.artistIMG.url}></img>
      </div>

      <div className="car-container-title-container">
        <h1>{music.key}</h1>
      </div>
    </div>
  );
};

export default Playlists_Card;
