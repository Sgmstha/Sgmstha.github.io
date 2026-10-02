export type Waypoint = {
  id: string;
  label: string;
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
};

// Order matches the document. Scene progress is measured from actual section offsets.
export const sections: Waypoint[] = [
  { id: 'home', label: 'Home', cameraPosition: [0, 0, 8.8], lookAt: [-1.7, 0, 0] },
  { id: 'about', label: 'About', cameraPosition: [2.4, 1, 7.8], lookAt: [-1, 0, 0] },
  { id: 'projects', label: 'Work', cameraPosition: [-1, .8, 8.5], lookAt: [1.1, 0, 0] },
  { id: 'experience', label: 'Journey', cameraPosition: [1.8, -.5, 9.4], lookAt: [-1.5, 0, 0] },
  { id: 'skills', label: 'Toolkit', cameraPosition: [0, 1, 8], lookAt: [-1, 0, 0] },
  { id: 'contact', label: 'Contact', cameraPosition: [-2, 0, 8.5], lookAt: [1, 0, 0] },
];
