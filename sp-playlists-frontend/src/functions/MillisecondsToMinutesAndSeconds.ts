function millisecondsToMinutesAndSeconds(milliseconds: number): string {
  const minutes: number = Math.floor(milliseconds / 60000);
  const seconds: string = ((milliseconds % 60000) / 1000).toFixed(0);

  return seconds == "60"
    ? minutes + 1 + ":00"
    : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
}

export default millisecondsToMinutesAndSeconds;
