float perlinScale = 10;
int scl = 10;
int xCenter = 1000;// these 2 are for the perlin noise
int yCenter = 1000;
boolean updateMap = false;
boolean[][] mineField;
float probability;

void setup(){
  size(1000,1000);
  noStroke();
  noFill();
  
  updateMap = true;
  mineField = new boolean[width/scl][height/scl];
  probability = 0.20625; // mines / tiles
  stroke(0);
  noiseSeed(floor(random(100000)));

  for (float x = 0; x < width/scl; x++) {
    for (float y = 0; y < height/scl; y++) {
      boolean isMine;
      boolean simplex = noise(x/perlinScale, y/perlinScale) < 0.5;
      //constrain(noise(x/20, y/20)*perlinSteep-perlinOffset+0.5 ,0,1);
      
      if(simplex){
        isMine = random(1) < probability;
      } else {
        isMine = false;
      }
      
      int indexX = floor(x); 
      int indexY = floor(y);
      mineField[indexX][indexY] = isMine;
      // showTile(x, y);
      //fill(50, 50, 50); //  normal
      if(isMine){ 
        fill(255, 0, 0);
        rect(x*scl,y*scl,scl,scl);
      } else {
        fill(int(simplex)*255);
        //fill(0);
        rect(x*scl,y*scl,scl,scl);
      }
    }
  }
}

void draw() {

}

void mouseDragged(){
  updateMap = false;
  int[] mineClicked = pxToIndex(mouseX, mouseY);
  int mineX = mineClicked[0];
  int mineY = mineClicked[1];
  
  showTile(mineX, mineY);
  if(mineField[mineX][mineY]) {
    print("game over");
    //updateMap = true;
  }
  // if(getBombCount(mineX, mineY) == 0) recursiveOpen(mineX, mineY);
  
  fill(255);
  // print(getBombCount(mineClicked[0], mineClicked[1]));
}

void mouseClicked(){
  //mouseDragged();
  setup();
}

void recursiveOpen(int x, int y){
  print("starting flloodd open!");
  ArrayList<int[]> openQueue = new ArrayList();
  
  openQueue.add(new int[]{x, y});
  
  while(openQueue.size() > 0){
    int[] coords = openQueue.get(0);
    openQueue.remove(0);
    
    int curX = coords[0];
    int curY = coords[1];
    showTile(curX, curY);

    if(getBombCount(curX+1, curY)==0 && !isOutOfBounds(curX+1, curY)) openQueue.add(new int[]{curX+1, curY});
    if(getBombCount(curX-1, curY)==0 && !isOutOfBounds(curX-1, curY)) openQueue.add(new int[]{curX-1, curY});
    if(getBombCount(curX, curY+1)==0 && !isOutOfBounds(curX, curY+1)) openQueue.add(new int[]{curX, curY+1});
    if(getBombCount(curX, curY-1)==0 && !isOutOfBounds(curX, curY-1)) openQueue.add(new int[]{curX, curY-1});
  }
}

void showTile(int x, int y){
  switch(getBombCount(x, y)){
    case -1:
      fill(0);
      break;
    case 0:
      fill(200);//recursiveOpen
      break;
    case 1:
      fill(0, 0, 255);
      break;
    case 2:
      fill(0, 128, 0);
      break;
    case 3:
      fill(255, 0, 0);
      break;
    case 4:
      fill(0, 0, 128);
      break;    
    case 5:
      fill(128, 0, 0);
      break;    
    case 6:
      fill(128, 0, 0);
      break;
    default:
      fill(255);
      break;
  }
  rect(x*scl, y*scl, scl, scl);
}

int[] pxToIndex(int px, int py){
  int[] coords = new int[2];
  coords[0] = floor(px/scl);
  coords[1] = floor(py/scl);
  return coords;
}

int getBombCount(int x, int y){
  int value = 0;
  for (int xOff = -1; xOff <= 1; xOff++) {
    for (int yOff = -1; yOff <= 1; yOff++) {
      if(!isOutOfBounds(x+xOff, y+yOff) && mineField[x+xOff][y+yOff]){
        value++;
      }
    }
  }
  // if(mineField[x][y]) value = -1; // use this to see if it is a bomb, easier for coloring
  return value;
}

boolean isOutOfBounds(int x, int y){
  if(x<0 || y<0 || x>width/scl-1 || y>height/scl-1)// x/y are indexes
    return true;
  return false;
}