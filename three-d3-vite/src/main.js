import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'd3';

function makeTextSprite(message, parameters = {}) {
    const fontface = parameters.fontface || 'Arial';
    const fontsize = parameters.fontsize || 24;
    const borderThickness = parameters.borderThickness || 2;
    const borderColor = parameters.borderColor || { r:0, g:0, b:0, a:1.0 };
    const backgroundColor = parameters.backgroundColor || { r:255, g:255, b:255, a:1.0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // Get size
    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    // Background
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    context.fillRect(borderThickness, borderThickness, textWidth + borderThickness, fontsize * 1.4 + borderThickness);

    // Border
    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.strokeRect(borderThickness, borderThickness, textWidth + borderThickness, fontsize * 1.4 + borderThickness);

    // Text
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(message, borderThickness, fontsize + borderThickness);

    // Texture
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 5, 1);  // Adjust size

    return sprite;
}

// constructed tree 
const data = {
  name: "William Phelps",
  children: [
    { name: "Nathaniel Phelps",
      children: [ 
        { 
          name: "Mary Phelps",
          birthday:"04-11-1734",
          children: [
            { name: "Thankful Clesson",
              children:[
                {
                  name:"John Davis",
                  birthday:"01-01-1706",
                  children:[
                    {
                      name:"Elizabeth Davis",
                      birthday:"01-01-1729",
                    }
                ]
                }
              ],
            },
            { name: "Mary Clesson",
              children:[
                {name:"Mary Bartlett",
                 birthday:"01-01-1701",
                 children:[
                   {
                     name:"Hannah Bartlett",
                     birthday:"01-01-1731",
                     children:[
                       {
                         name:"Apron Gould",
                         birthday:"01-01-1757",
                         children:[
                           {
                             name:"Mehitable Gould"
                           }
                         ]
                       }
                     ]
                   }
                 ]
                }
              ],
            }
          ]
        },
        {
          name: "William Phelps",
          birthday: "05-01-2076",
          children: [
            { name: "William Phelps",
              children:[
                {
                  name:"Experience Phelps",
                  birthday:"01-01-1727",
                },
                { 
                  name: "Eliakim Phelps",
                  birthday:"01-01-1709",
                }
              ],
            },
            { name: "x" }
          ]
        }
      ]
    }
  ]
};

// D3 tree layout
// const data = {
//   name: "Root",
//   children: [
//     { name: "Child 1" },
//     { name: "Child 2", children: [ { name: "Grandchild" } ] }
//    ]
// };
const root = d3.hierarchy(data);
d3.tree().size([400, 400])(root);

const nodes = root.descendants().map((d, i) => ({
  id: i,
  name: d.data.name,
  x: d.y - 200,
  y: -d.x + 200,
  z: d.depth * 30
}));

// Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f8f8);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const material = new THREE.MeshBasicMaterial({ color: 0x3366cc });

nodes.forEach(n => {
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), material);
  sphere.position.set(n.x, n.y, n.z);
  scene.add(sphere);
});

nodes.forEach(node => {
    const label = makeTextSprite(node.name);
    label.position.set(node.x, node.y + 2, node.z); // slightly above node
    scene.add(label);
});

const links = root.links();
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });

const nodeMap = new Map();
nodes.forEach((n, i) => nodeMap.set(root.descendants()[i], n));

links.forEach(link => {
  const source = nodeMap.get(link.source);
  const target = nodeMap.get(link.target);

  const points = [
    new THREE.Vector3(source.x, source.y, source.z),
    new THREE.Vector3(target.x, target.y, target.z)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, lineMaterial);

  scene.add(line);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
