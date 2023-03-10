const svg = 
    `<svg
  
   id="svg72512"
   inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)"
   sodipodi:docname="RobotFrameV2.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  
   <defs
   id="defs72509" />
<g
   inkscape:label="Layer 1"
   inkscape:groupmode="layer"
   id="layer1"
   transform="translate(-49.072211,-163.54384)">
  <path
     id="path76327"
     style="fill-opacity:0;stroke:#000000"
     inkscape:transform-center-y="-15.36739"
     d="m 49.71862,243.64767 c 0,0 -1.491358,-21.5853 5.056298,-44.48511 3.273828,-11.44991 5.817597,-20.84384 10.810957,-27.02618 4.99336,-6.18233 12.436311,-9.15306 25.508506,-7.75656 6.536097,0.69825 9.902529,1.92395 11.557429,3.87093 m 0,0 c 1.6549,1.94699 1.59827,4.61526 1.28824,8.19865 -0.62005,7.16679 -2.25369,17.99408 6.76416,34.03258 18.0357,32.07701 26.07808,33.70471 26.07808,33.70471 m 0,0 -46.765959,-0.53902 H 49.71862"
     sodipodi:nodetypes="csssccsscccc" />
</g>
</svg>`
const svgGroup = project.importSVG(svg,{insert: true});
const group = svgGroup.lastChild;
var customSVG = group.lastChild;
customSVG.strokeColor= null

const thickness = 4.8
var Dthick = thickness*2
const tabLength = 10
const width = 130
const length = 140

const height = 60
const cornerSize = new Size(30, 30);

let rectangle1 = new Rectangle(new Point(0,0),new Size(length,width));
customSVG.fitBounds(rectangle1)



var lenList = [
    customSVG.children[0].length,
    customSVG.children[1].length,
    customSVG.children[2].length
]
var perimeter = lenList.reduce((a, b) => a + b, 0);

//makeLivingHinge(10,10,50,50)
makeLid(20,30+height)
makeLid(40+length,30+height)
// makeLid(40+length,height+30)
makeSide(10+thickness,10)

// process()

function makeLid(x,y){
    test = new Path.Rectangle(new Point(x,y+width-20),new Size(95,20))
    test.strokeColor="#ff0000"
    var path = customSVG.clone()
    
    
    path.position = new Point(x+length/2,y+width/2)
    
    //indent to free lid tabs
    let lidIndent  = new Path(path.children[1].segments)
    lidIndent = PaperOffset.offset(lidIndent, thickness/2, { join: 'round' })
    let refer  = new Path(path.children[0].segments)
    refer = PaperOffset.offset(refer, 7, { join: 'round' })
    lidIndent.insert(0,refer.getPointAt(refer.length-4))
    lidIndent.segments.unshift(new Segment(lidIndent.bounds.topRight))
    
    // create the tabs
    var tabs = makeTabs(path.children[0],path.children[0].length)

    //make specail lid tabs here:
    var tabs2 = makeTabs(path.children[1],path.children[1].length+10)
    let holeOff = 2
    let hingeInner = Path.Circle(path.children[1].getPointAt((path.children[1].length-holeOff)),Math.hypot(thickness,tabLength)/2)
    let hingeOuter = Path.Circle(path.children[1].getPointAt((path.children[1].length-holeOff)),9)
    hingeInner.strokeColor = "#00000"
    
    var tabs3 = makeTabs(path.children[2],path.children[2].length-10,10)
    // merge the tabs together
    tabs = tabs.unite(tabs2)
    tabs = tabs.unite(tabs3)
    
    // make connected path
    var connectedPath =new Path()//path.unite(path)
    connectedPath = connectedPath.unite(path.children[0])
    // connectedPath = connectedPath.unite(path.children[1])
    connectedPath.join(path.children[1])
    connectedPath.join(path.children[2])
    connectedPath.fillColor = null
    // connectedPath.strokeColor = "#000000"
    
    //dialate path to be bigger
    var dilaConnectedPath = PaperOffset.offset(connectedPath, 7, { join: 'round' })
    dilaConnectedPath.strokeColor = null


    dilaConnectedPath = dilaConnectedPath.subtract(lidIndent)
    dilaConnectedPath = dilaConnectedPath.unite(hingeOuter)
    dilaConnectedPath = dilaConnectedPath.subtract(tabs)
    dilaConnectedPath.strokeColor = "#000000"
}
function makeSide(x,y){
    let rectangle1 = new Path.Rectangle(new Point(x,y),new Size(perimeter,height));
    let path = rectangle1
    
    //let lenList = [length-(thickness*2),width,length -(thickness*2),width]
    let xcord = x;
    
    let pannel1 = new Path.Rectangle(new Point(xcord,y),new Size(lenList[0],height));
    let tabs = new Path();
    tabs = tabs.unite(makeTabs(pannel1, lenList[0], height,thickness/2))
    tabs = tabs.unite(makeTabs(pannel1, lenList[0], 2*height+lenList[0],thickness/2))
    
    let lidDent = (makeTabs(pannel1, height/2, (height+lenList[0])+height/4,-thickness/2))
    
    pannel1 = pannel1.unite(tabs)
    pannel1 = pannel1.subtract(lidDent)
    
    let p = pannel1.bounds
    makeLivingHinge(p.x, p.y, (p.width-12), p.height)
    pannel1.strokeColor="#000000"

    xcord += lenList[0]+ 10

    let offset = 6
    let pannel2 = new Path.Rectangle(new Point(xcord,y),new Size(lenList[1]+offset,height));
    let tabs2 = new Path();
    tabs2 = tabs2.unite(makeTabs(pannel2, lenList[1]+10, height+3,thickness/2))
    tabs2 = tabs2.unite(makeTabs(pannel2, lenList[1]+10, 2*height+lenList[1]+(2*offset-10)-3,thickness/2))
    
    let lidTab = (makeTabs(pannel2, height/2, height/4,+thickness/2))

    pannel2 = pannel2.unite(tabs2)
    let p2 = pannel2.bounds
    makeLivingHinge(p2.x+1, p2.y, (p2.width-12), p2.height)
    pannel2 = pannel2.unite(lidTab)
    
    pannel2.strokeColor="#000000"
    
    xcord += lenList[1]+ 10

    offset = 6
    let pannel3 = new Path.Rectangle(new Point(xcord,y),new Size(lenList[2]-offset,height));
    let tabs3 = new Path();
    tabs3 = tabs3.unite(makeTabs(pannel3, lenList[2]-10, (height),thickness/2))
    tabs3 = tabs3.unite(makeTabs(pannel3, lenList[2]-10,2*height+lenList[2]-(2*offset-10),thickness/2))
    pannel3 = pannel3.unite(tabs3)
    

    pannel3.strokeColor="#000000"
    

}
function makeTabs(shapePath,length, start=0, dist=0)
{


    var tabPath = new Path()

    let tabPos = 0;
    
    let tabCount = getTabCount(length)
    for(var j=0;j<tabCount;j++){
        var tab = new Path.Rectangle(new Point(0,0),new Size(tabLength,thickness));
        tabPos = j*(length/tabCount) + (length/tabCount)/2 + start
        var offsetPoint = shapePath.getPointAt(tabPos)
        var tan = shapePath.getTangentAt(tabPos); 
        let norm = shapePath.getNormalAt(tabPos)

        tab.rotate(tan.angle/*, offsetPoint*/);
        tab.position = offsetPoint + (norm*dist)
        
        // console.log("test: " + norm*dist +" "+ j)
        tabPath = tabPath.unite(tab)
    }
    // tabPath.strokeColor = "#00ff00"
    return tabPath;
}
function makeLivingHinge(x,y,w,h)
{
    const spacing = 3,line = 17,gap = 7;

    x += spacing
    w -= spacing
    
    // let a = new Path.Rectangle(new Point(x,y),new Size(w,h))
    // a.strokeColor = "#000000"
    var path = new CompoundPath() 
    
    for(var i=0; i< w/spacing;i++){
        let yOffset = (i%2 *(line+gap)/2)- line

        while(yOffset < h){
            let top = Math.max(y+yOffset, y);
            let bot = Math.min(line+y+yOffset, y+h)

            var path2 = new Path.Line(new Point(i*spacing+x,top), new Point(i*spacing+x,bot));
            path2.strokeColor = '#000000'
            yOffset += gap + line
            path.addChild(path2)

        }
    }
    path.strokeColor = '#000000'
    return path
}

function process()
{

    project.activeLayer.scale(3.779528)
    // project.activeLayer.scale(2)

    project.activeLayer.position = project.activeLayer.bounds.size/2;

    // myCanvas is an Id made in html doc
    myCanvas.width = project.activeLayer.bounds.width+100
    myCanvas.height = project.activeLayer.bounds.height+10
    
    
    
   
    downloadAsSVG()
    // console.log(project.exportSVG())
    // rect.strokeColor = "#000000"
}
var downloadAsSVG = function (fileName) {
   
    if(!fileName) {
        fileName = "paperjs_example.svg"
    }
 
    let rect = new Rectangle(project.activeLayer.bounds)
    rect = rect.scale(1.1) ;

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(project.exportSVG({asString:true,bounds:rect}));
    
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
 }

 function getTabCount(len, tabDense = 2.0)
 {
    return Math.floor(((len-tabLength)/tabDense)/tabLength)
 }
window.process = process;