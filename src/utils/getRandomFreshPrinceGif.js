const gifs = [
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629806/Divine/gallery/order%20complete%20dances/mp4_12.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629805/Divine/gallery/order%20complete%20dances/mp4_14.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629804/Divine/gallery/order%20complete%20dances/mp4_13.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629802/Divine/gallery/order%20complete%20dances/mp4_10.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629801/Divine/gallery/order%20complete%20dances/mp4_11.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629798/Divine/gallery/order%20complete%20dances/mp4_6.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629798/Divine/gallery/order%20complete%20dances/mp4_9.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629798/Divine/gallery/order%20complete%20dances/mp4_8.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629795/Divine/gallery/order%20complete%20dances/mp4_7.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629793/Divine/gallery/order%20complete%20dances/mp4_3.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629792/Divine/gallery/order%20complete%20dances/mp4.mp4",
  "https://res.cloudinary.com/de5awe7fs/video/upload/v1609629792/Divine/gallery/order%20complete%20dances/mp4_2.mp4",
];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomFreshPrinceGIF = () => {
  const min = 0;
  const max = gifs.length;

  const index = getRandomInt(min, max);

  return gifs[index];
};

module.exports = { getRandomFreshPrinceGIF };
