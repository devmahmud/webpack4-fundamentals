const makeImage = (url, height = 100, width = 100) => {
  const image = document.createElement('img');
  image.src = url;
  image.width = width;
  image.height = height;
  return image;
};

export default makeImage;
