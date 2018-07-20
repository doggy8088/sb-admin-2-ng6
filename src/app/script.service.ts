import { Injectable } from '@angular/core';

declare var document: any;

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  // Flot
  // {name: 'excanvas', src: '/assets/vendor/flot/excanvas.min.js'},
  // {name: 'jqflot', src: '/assets/vendor/flot/jquery.flot.js'},
  {name: 'jqflotpie', src: '/assets/vendor/flot/jquery.flot.pie.js'},
  {name: 'jqflotresize', src: '/assets/vendor/flot/jquery.flot.resize.js'},
  {name: 'jqflottime', src: '/assets/vendor/flot/jquery.flot.time.js'},
  {name: 'jqflottooltip', src: '/assets/vendor/flot-tooltip/jquery.flot.tooltip.min.js'},
  // Morris
  {name: 'raphael', src: '/assets/vendor/raphael/raphael.js'},
  {name: 'morris', src: '/assets/vendor/morrisjs/morris.js'}
];

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    var promises: any[] = [];
    scripts.forEach(script => promises.push(this.loadScript(script)));
    // 這一段無法保證載入順序，所有有相依的 JS 無法透過這裡載入
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {
          //IE
          script.onreadystatechange = () => {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {
          //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) =>
          resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
