// © Elisabeth | Webseite: https://7fz.de/ | 7fz TableTop | Version 1.0 | Lizenziert unter CC BY 4.0

var gridAspectRatio = 16 / 9; // Seitenverhältnis des Rasters

var horizontalLines = 17;
var verticalLines = Math.ceil((horizontalLines + 1) * gridAspectRatio);
var horizontalLineStyle = 'position: absolute; left: 0; right: 0; height: 1px; background-color: rgb(0, 0, 0);';
var verticalLineStyle = 'position: absolute; top: 0; bottom: 0; width: 1px; background-color: rgb(0, 0, 0);';

function updateGridOpacity() {
  var gridOverlay = videoWindow.document.getElementById('gridOverlay');
  if (gridOverlay) {
    var opacity = document.getElementById('gridOpacitySlider').value;
    gridOverlay.style.opacity = opacity;
  }
}

function setGridSize(vertical, horizontal) {
  verticalLines = vertical;
  horizontalLines = horizontal;
  document.getElementById('verticalLines').value = verticalLines;
  document.getElementById('horizontalLines').value = horizontalLines;
  updateGrid();
}

function drawGridOverlay(gridOverlay, width, height, numHorizontalLines, numVerticalLines, lineThickness, lineColor) {
  // Clear the current contents of the gridOverlay element
  gridOverlay.innerHTML = '';

  var lineSpacingX = width / numVerticalLines;
  var lineSpacingY = height / numHorizontalLines;

  // Draw the horizontal lines
  for (var i = 0; i < numHorizontalLines; i++) {
    var y = (i + 1) * lineSpacingY;
    var line = document.createElement('div');
    line.className = 'horizontal-line';
    line.style.top = y + 'px';
    line.style.height = lineThickness + 'px';
    line.style.backgroundColor = lineColor;
    gridOverlay.appendChild(line);
  }

  // Draw the vertical lines
  for (var j = 0; j < numVerticalLines; j++) {
    var x = (j + 1) * lineSpacingX;
    var line = document.createElement('div');
    line.className = 'vertical-line';
    line.style.left = x + 'px';
    line.style.width = lineThickness + 'px';
    line.style.backgroundColor = lineColor;
    gridOverlay.appendChild(line);
  }
}

function updateGrid() {
  var horizontalLines = parseInt(document.getElementById('horizontalLines').value);
  var verticalLines = parseInt(document.getElementById('verticalLines').value);
  var lineThickness = parseInt(document.getElementById('lineThickness').value);
  var lineColor = document.getElementById('lineColor').value;
  
  var gridOverlay = videoWindow.document.getElementById('gridOverlay');
  drawGridOverlay(gridOverlay, videoWindow.innerWidth, videoWindow.innerHeight, horizontalLines, verticalLines, lineThickness, lineColor);
}

function updateGridFromSlider() {
  var sliderValue = document.getElementById('gridSlider').value;
  var baseVerticalLines = 32; // Change this value to your desired base value for vertical lines
  var baseHorizontalLines = 17; // Change this value to your desired base value for horizontal lines
  var verticalLines = Math.ceil(baseVerticalLines * (sliderValue / 50));
  var horizontalLines = Math.ceil(baseHorizontalLines * (sliderValue / 50));
  document.getElementById('verticalLines').value = verticalLines;
  document.getElementById('horizontalLines').value = horizontalLines;
  updateGrid();
}
function handleWindowResize(gridOverlay) {
  var horizontalLines = document.getElementById('horizontalLines').value;
  var verticalLines = document.getElementById('verticalLines').value;
  var lineThickness = document.getElementById('lineThickness').value;
  var lineColor = document.getElementById('lineColor').value;

  updateGrid();
}
function updateGridInVideoWindow(horizontalLines, verticalLines, lineThickness, lineColor) {
  if (!videoWindow || videoWindow.closed) {
    // Das Videofenster ist nicht geöffnet, daher können wir nichts tun.
    return;
  }

  var gridOverlay = videoWindow.document.getElementById('gridOverlay');

  // Remove any existing grid lines
  while (gridOverlay.firstChild) {
    gridOverlay.firstChild.remove();
  }

  // Set the new line styles
  var horizontalLineStyle = 'position: absolute; left: 0; right: 0; height: ' + lineThickness + 'px; background-color: ' + lineColor + ';';
  var verticalLineStyle = 'position: absolute; top: 0; bottom: 0; width: ' + lineThickness + 'px; background-color: ' + lineColor + ';';

  // Draw the new grid lines
  drawGridOverlay(gridOverlay, horizontalLines, verticalLines, horizontalLineStyle, verticalLineStyle);
}
