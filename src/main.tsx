import { createRoot } from 'react-dom/client'
import './style/index.css'
import './assets/fontawesome/css/fontawesome.css'
import './assets/fontawesome/css/solid.css'
import './assets/fontawesome/css/regular.css'
import App from './components/app.tsx'

// function perfObserver(entries: PerformanceObserverEntryList, observer: PerformanceObserver) {
//   entries.getEntries().forEach((entry) => {
//     if (entry.entryType === "mark") {
//       console.log(`${entry.name}'s startTime: ${entry.startTime}`);
//     }
//     if (entry.entryType === "measure") {
//       console.log(`${entry.name}'s duration: ${entry.duration}`);
//     }
//   });
// }
// const observer = new PerformanceObserver(perfObserver);
// observer.observe({ entryTypes: ["measure", "mark"] });

createRoot(document.getElementById('root')!).render(
  <App />
)
