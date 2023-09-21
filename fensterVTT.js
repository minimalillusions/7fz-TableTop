// © Elisabeth | Webseite: https://7fz.de/ | 7fz TableTop | Version 1.0 | Lizenziert unter CC BY 4.0

var videoWindow;
var mediaList = [];

function openMedia() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*,image/*';
  input.multiple = true;
  input.onchange = function(event) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var mediaType = getMediaType(file);
      var mediaItem = createMediaItem(file, mediaType);
      document.getElementById('mediaList').appendChild(mediaItem);
      mediaList.push({ file: file, type: mediaType, element: mediaItem });
    }
    updateVideoControls(); // Aktualisiere die Steuerelemente
  };
  input.click();
}

function getMediaType(file) {
  var type = file.type.split('/')[0];
  if (type === 'video') {
    return 'video';
  } else if (type === 'image') {
    return 'image';
  } else if (type === 'application' && file.type.includes('youtube')) {
    return 'youtube';
  } else {
    return 'url';
  }
}

function createMediaItem(file, type) {
  var mediaItem = document.createElement('li');
  mediaItem.className = 'media-item';

  var mediaButton = document.createElement('button');
  if (type === 'youtube') {
    mediaButton.textContent = 'YouTube-Video';
  } else {
    mediaButton.textContent = file.name;
  }
  mediaButton.onclick = function() {
    playMedia(file, type);
  };

  var descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Beschreibung';

  var removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.onclick = function() {
    removeMedia(mediaItem);
  };

  mediaItem.appendChild(mediaButton);
  mediaItem.appendChild(descriptionInput);
  mediaItem.appendChild(removeButton);

  return mediaItem;
}

function playMedia(file, type) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var buttonsDiv = document.getElementById('buttonsDiv');
  var videoButton = document.getElementById('playVideoButton');
  var widthButton = document.getElementById('setWidthButton'); 
  var heightButton = document.getElementById('setHeightButton');

  // Verstecke das Button-Div
  buttonsDiv.style.visibility = 'hidden';

  if (videoWindow && !videoWindow.closed) {
    var gridOverlay = videoWindow.document.getElementById('gridOverlay');

    // Remove any existing media elements
    var mediaContainer = videoWindow.document.getElementById('mediaContainer');
    while (mediaContainer.firstChild) {
      mediaContainer.firstChild.remove();
    }

    if (type === 'video') {
      var newElement = videoWindow.document.createElement('video');
      newElement.controls = true;
      newElement.loop = true;
      newElement.src = getFileURL(file);
      mediaContainer.appendChild(newElement);

      // Set video width and height
      var videoElement = mediaContainer.querySelector('video');
      if (videoElement) {
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
      }
    } else if (type === 'image') {
      var imageElement = videoWindow.document.createElement('img');
      imageElement.src = getFileURL(file);
      imageElement.style.width = '100%'; // Anpassen an die Fensterbreite
      imageElement.style.height = 'auto'; // Anpassen an die Fensterhöhe
      mediaContainer.appendChild(imageElement);
    } else if (type === 'youtube') {
      var youtubeElement = videoWindow.document.createElement('iframe');
      youtubeElement.src = getYouTubeEmbedURL(file);
      youtubeElement.frameBorder = '0';
      youtubeElement.allowFullscreen = true;
      youtubeElement.width = '100%';
      youtubeElement.height = '100%';
      mediaContainer.appendChild(youtubeElement);
    }

    updateVideoControls(); // Call the function to update the buttons
    drawGridOverlay(gridOverlay, videoWindow.innerWidth, videoWindow.innerHeight, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
  } else {
    var width = window.innerWidth * 0.6;
    var height = window.innerHeight * 0.6;
    videoWindow = window.open('', 'Video Window', `width=${width}, height=${height}`);
    videoWindow.document.write(`
    <html>
    <head>
      <meta charset="UTF-8">
      <title>VTT</title>
      <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <body>
      <div id="gridOverlay"></div>
      <div id="mediaContainer"></div>
      <script src="fensterVTT.js"></script>
    </body>
    </html>
    `);
    videoWindow.document.getElementsByTagName('body')[0].style.backgroundColor = 'black';
    videoWindow.document.close();

    videoWindow.addEventListener('DOMContentLoaded', function() {
      var gridOverlay = videoWindow.document.getElementById('gridOverlay');
      var mediaContainer = videoWindow.document.getElementById('mediaContainer');
      playMediaInContainer(file, type, mediaContainer);
      drawGridOverlay(gridOverlay, videoWindow.innerWidth, videoWindow.innerHeight, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
      updateVideoControls(); // Call the function to update the buttons
    });

    videoWindow.addEventListener('resize', function() {
      var gridOverlay = videoWindow.document.getElementById('gridOverlay');
      drawGridOverlay(gridOverlay, videoWindow.innerWidth, videoWindow.innerHeight, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
    });
  }

  // Aktiviere die Buttons
  setTimeout(function() {
    videoButton.disabled = false;
    widthButton.disabled = false;
    heightButton.disabled = false;

    // Zeige das Button-Div wieder an
    buttonsDiv.style.visibility = 'visible';
  }, 100);
}

function setWidth(width) {
  if (videoWindow && !videoWindow.closed) {
    var mediaContainer = videoWindow.document.getElementById('mediaContainer');
    var element = mediaContainer.querySelector('video, img');
    if (element) {
      element.style.width = width;
      if (element.tagName === 'IMG') {
        element.style.height = 'auto';
      }
    }
  }
}

function setHeight(height) {
  if (videoWindow && !videoWindow.closed) {
    var mediaContainer = videoWindow.document.getElementById('mediaContainer');
    var element = mediaContainer.querySelector('video, img');
    if (element) {
      element.style.height = height;
      if (element.tagName === 'IMG') {
        element.style.width = 'auto';
      }
    }
  }
}

function getYouTubeEmbedURL(url) {
  var videoID = '';
  var match = url.match(/(?:\?v=|\/embed\/|\.be\/|\/watch\?v=|\/v\/|https?:\/\/(?:www\.)?youtube\.com\/embed\/)([^#\&\?]*).*/i);
  if (match && match[1]) {
    videoID = match[1];
  }
  return 'https://www.youtube.com/embed/' + videoID;
}

function createMediaItem(source, type) {
  var mediaItem = document.createElement('li');
  mediaItem.className = 'media-item';

  var mediaButton = document.createElement('button');
  if (type === 'youtube') {
    mediaButton.textContent = 'YouTube-Video';
  } else {
    mediaButton.textContent = source.name;
  }
  mediaButton.onclick = function() {
    playMedia(source, type);
  };

  var descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Beschreibung';

  var removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.onclick = function() {
    removeMedia(mediaItem);
  };

  mediaItem.appendChild(mediaButton);
  mediaItem.appendChild(descriptionInput);
  mediaItem.appendChild(removeButton);

  return mediaItem;
}

function removeMedia(mediaItem) {
  var index = mediaList.findIndex(function(item) {
    return item.element === mediaItem;
  });

  if (index !== -1) {
    mediaList.splice(index, 1);
    mediaItem.parentNode.removeChild(mediaItem);
    updateVideoControls(); // Aufruf der Funktion, um die Buttons zu aktualisieren
  }
}



function updateVideoControls() {
  var videoButton = document.getElementById('playVideoButton');
  var widthButton = document.getElementById('setWidthButton'); // Umbenannter Button
  var heightButton = document.getElementById('setHeightButton'); // Umbenannter Button

  if (mediaList.length > 0 && videoWindow && !videoWindow.closed) {
    videoButton.disabled = false;
    widthButton.disabled = false;
    heightButton.disabled = false;
    videoButton.classList.remove('disabled');
    widthButton.classList.remove('disabled');
    heightButton.classList.remove('disabled');
  } else {
    videoButton.disabled = true;
    widthButton.disabled = true;
    heightButton.disabled = true;
    videoButton.classList.add('disabled');
    widthButton.classList.add('disabled');
    heightButton.classList.add('disabled');
  }
}

function getFileURL(file) {
  return URL.createObjectURL(file);
}

function openVideoWindow() {
  var windowFeatures = "width=" + screen.width + ",height=" + screen.height + ",resizable=yes";
  videoWindow = window.open('', 'Fenster VTT', windowFeatures);
  videoWindow.document.write('<html><head><meta charset="UTF-8"><title>Fenster VTT</title><link rel="stylesheet" type="text/css" href="style.css"></head><body><div id="gridOverlay"></div><div id="mediaContainer"></div><script src="fensterVTT.js"></script></body></html>');
  videoWindow.document.close();

  videoWindow.addEventListener('DOMContentLoaded', function() {
    var gridOverlay = videoWindow.document.getElementById('gridOverlay');
    drawGridOverlay(gridOverlay, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
  });

  videoWindow.addEventListener('resize', function() {
    var gridOverlay = videoWindow.document.getElementById('gridOverlay');
    drawGridOverlay(gridOverlay, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
  });
}

function playMediaInContainer(file, type, container) {
  if (type === 'video') {
    var newElement;
    if (file.type.includes('youtube')) {
      var embedURL = getYouTubeEmbedURL(file);
      newElement = videoWindow.document.createElement('iframe');
      newElement.src = embedURL;
      newElement.frameBorder = '0';
      newElement.allowFullscreen = true;
    } else {
      newElement = videoWindow.document.createElement('video');
      newElement.controls = true;
      newElement.loop = true;
      newElement.autoplay = true;
      newElement.src = getFileURL(file);
    }
    container.appendChild(newElement);
  } else if (type === 'image') {
    var imageElement = videoWindow.document.createElement('img');
    imageElement.src = getFileURL(file);
    imageElement.style.width = 'auto'; // Anpassen an die Fensterbreite
    imageElement.style.height = '100%'; // Anpassen an die Fensterhöhe
    container.appendChild(imageElement);
  }
}

function embedYouTubeVideo() {
  var youtubeURL = document.getElementById('youtubeURL').value;
  if (youtubeURL) {
    var mediaItem = createMediaItem(youtubeURL, 'youtube');
    document.getElementById('mediaList').appendChild(mediaItem);
    mediaList.push({ url: youtubeURL, type: 'youtube', element: mediaItem });
    updateVideoControls(); // Aktualisiere die Steuerelemente
  }
}

function playVideoInWindow(file, type) {
  if (videoWindow && !videoWindow.closed) {
    var mediaContainer = videoWindow.document.getElementById('mediaContainer');
    var element = mediaContainer.querySelector('video, img');
    if (element) {
      if (element.tagName === 'VIDEO') {
        element.play(); // Video im zweiten Fenster abspielen
      }
    } else {
      playMediaInContainer(file, type, mediaContainer);
    }
  } else {
    openVideoWindow();

    videoWindow.addEventListener('DOMContentLoaded', function() {
      var mediaContainer = videoWindow.document.getElementById('mediaContainer');
      playMediaInContainer(file, type, mediaContainer);
    });
  }
}

function createVideoElement(file) {
  var videoElement = videoWindow.document.createElement('video');
  videoElement.controls = true;
  videoElement.loop = true;
  videoElement.src = getFileURL(file);
  return videoElement;
}
