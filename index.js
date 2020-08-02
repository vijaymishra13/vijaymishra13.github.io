import { plotSyslog } from './fault-timeline.js';
import { plotHeatMap } from './heat-map.js';

window.chart_width = 1300;
window.chart_scale = 1.5;
window.current_time = '2020-07-20T09:00:00Z';


function toggleIntro(isIntro){
    if(isIntro){
      document.getElementById('intro').style.display='block';
      document.getElementById('chart').style.display='none';
    }else{
      document.getElementById('intro').style.display='none';
      document.getElementById('chart').style.display='block';
    }
}
window.toggleIntro = toggleIntro;
