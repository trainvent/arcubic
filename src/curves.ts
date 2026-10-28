import Color from 'colorjs.io';
import {radixSeeds} from './palette';
export const splinePositions = [0, .25, .5, .75, 1];
export const splineHues = [0, ...['orange','amber'].map(key => new Color(radixSeeds[key as 'orange'|'amber']).to('hsl').coords[0]), 120, new Color(radixSeeds.teal).to('hsl').coords[0]];
const d = splineHues.slice(1).map((h,i)=>(h-splineHues[i])/.25);
function endpoint(a:number,b:number) {
  const m=(3*a-b)/2;
  return m*a<=0?0:a*b<0&&Math.abs(m)>3*Math.abs(a)?3*a:m;
}
const slopes=[endpoint(d[0],d[1]),...d.slice(1).map((v,i)=>d[i]*v<=0?0:2*d[i]*v/(d[i]+v)),endpoint(d[3],d[2])];
/** PCHIP through the documented five anchors, red to teal. */
export function splineHue(i:number) {
  const x=Math.min(1,Math.max(0,i));
  const j=Math.min(3,Math.floor(x*4));
  const u=(x-splinePositions[j])/.25;
  return (2*u**3-3*u**2+1)*splineHues[j]+(u**3-2*u**2+u)*.25*slopes[j]+(-2*u**3+3*u**2)*splineHues[j+1]+(u**3-u**2)*.25*slopes[j+1];
}
